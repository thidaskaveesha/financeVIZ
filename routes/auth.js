import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabaseAdmin } from '../config/database.js';
import { generateSalt, hashPassword, verifyPassword, generateVerificationCode } from '../utils/password.js';
import { sendVerificationEmail } from '../utils/email.js';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Login user with username and password
 * @access Public
 */
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      // Get user from database by username
      const { data: user, error: fetchError } = await supabaseAdmin
        .from('user')
        .select('*')
        .eq('username', username)
        .single();

      if (fetchError || !user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Verify password using stored salt
      const isValidPassword = await verifyPassword(password, user.hashed_password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Check if email is verified
      if (!user.email_verified) {
        return res.status(403).json({ 
          error: 'Email not verified',
          requiresVerification: true 
        });
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.user_id,
        username: user.username,
        email: user.user_email,
        subscriptionLevel: user.subscription_level,
      });

      // Return user data (excluding sensitive information)
      res.json({
        message: 'Login successful',
        token,
        user: {
          userId: user.user_id,
          username: user.username,
          email: user.user_email,
          subscriptionLevel: user.subscription_level,
          firstTimeLogin: user.first_time_login,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @route POST /api/auth/signup
 * @desc Register new user and send verification email
 * @access Public
 */
router.post(
  '/signup',
  [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, email } = req.body;

      // Check if username already exists
      const { data: existingUser } = await supabaseAdmin
        .from('user')
        .select('user_id')
        .eq('username', username)
        .single();

      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      // Check if email already exists
      const { data: existingEmail } = await supabaseAdmin
        .from('user')
        .select('user_id')
        .eq('user_email', email)
        .single();

      if (existingEmail) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Generate salt and hash password
      const salt = await generateSalt();
      const hashedPassword = await hashPassword(password, salt);

      // Generate verification code
      const verifyCode = generateVerificationCode();
      const expiringTime = new Date();
      expiringTime.setMinutes(expiringTime.getMinutes() + 30); // 30 minutes expiry

      // Create user record (email_verified will be false initially)
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('user')
        .insert({
          username,
          user_email: email,
          hashed_password: hashedPassword,
          salt,
          first_time_login: true,
          subscription_level: 'free', // Default subscription level
          email_verified: false,
          verify_email_code: verifyCode,
          verify_email_expiring_time: expiringTime.toISOString(),
          access_token: '', // Will be set after email verification
        })
        .select()
        .single();

      if (insertError) {
        console.error('Signup error:', insertError);
        return res.status(500).json({ error: 'Failed to create user account' });
      }

      // Send verification email
      try {
        await sendVerificationEmail(email, verifyCode, 'verification');
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the signup if email fails, but log it
      }

      res.status(201).json({
        message: 'Account created successfully. Please check your email for verification code.',
        userId: newUser.user_id,
        email: newUser.user_email,
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @route POST /api/auth/reset-password
 * @desc Request password reset - sends reset code to email
 * @access Public
 */
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      // Find user by email
      const { data: user, error: fetchError } = await supabaseAdmin
        .from('user')
        .select('user_id, user_email, username')
        .eq('user_email', email)
        .single();

      // Don't reveal if email exists or not (security best practice)
      if (fetchError || !user) {
        return res.json({
          message: 'If the email exists, a reset code has been sent.',
        });
      }

      // Generate reset code
      const resetCode = generateVerificationCode();
      const expiringTime = new Date();
      expiringTime.setMinutes(expiringTime.getMinutes() + 5); // 5 minutes expiry

      // Update user with reset code
      const { error: updateError } = await supabaseAdmin
        .from('user')
        .update({
          reset_code: resetCode,
          reset_code_expiring_time: expiringTime.toISOString(),
        })
        .eq('user_id', user.user_id);

      if (updateError) {
        console.error('Reset password error:', updateError);
        return res.status(500).json({ error: 'Failed to process reset request' });
      }

      // Send reset email
      try {
        await sendVerificationEmail(email, resetCode, 'reset');
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        return res.status(500).json({ error: 'Failed to send reset email' });
      }

      res.json({
        message: 'If the email exists, a reset code has been sent.',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @route POST /api/auth/reset-password/verify
 * @desc Verify reset code and update password
 * @access Public
 */
router.post(
  '/reset-password/verify',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('code').isNumeric().withMessage('Reset code must be numeric'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, code, newPassword } = req.body;
      const resetCode = parseInt(code);

      // Find user by email
      const { data: user, error: fetchError } = await supabaseAdmin
        .from('user')
        .select('*')
        .eq('user_email', email)
        .single();

      if (fetchError || !user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if reset code matches
      if (user.reset_code !== resetCode) {
        return res.status(400).json({ error: 'Invalid reset code' });
      }

      // Check if reset code has expired (must be within 5 minutes)
      if (!user.reset_code_expiring_time) {
        return res.status(400).json({ error: 'Reset code has expired' });
      }

      const expiringTime = new Date(user.reset_code_expiring_time);
      const now = new Date();
      const timeDifference = (now - expiringTime) / 1000 / 60; // minutes

      if (timeDifference > 5) {
        return res.status(400).json({ error: 'Reset code has expired' });
      }

      // Generate new salt and hash new password
      const newSalt = await generateSalt();
      const newHashedPassword = await hashPassword(newPassword, newSalt);

      // Update user password and clear reset code
      const { error: updateError } = await supabaseAdmin
        .from('user')
        .update({
          hashed_password: newHashedPassword,
          salt: newSalt,
          reset_code: null,
          reset_code_expiring_time: null,
        })
        .eq('user_id', user.user_id);

      if (updateError) {
        console.error('Password update error:', updateError);
        return res.status(500).json({ error: 'Failed to update password' });
      }

      res.json({
        message: 'Password reset successfully',
      });
    } catch (error) {
      console.error('Reset password verify error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @route POST /api/auth/verify-email
 * @desc Verify user email with verification code
 * @access Public
 */
router.post(
  '/verify-email',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('code').isNumeric().withMessage('Verification code must be numeric'),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, code } = req.body;
      const verifyCode = parseInt(code);

      // Find user by email
      const { data: user, error: fetchError } = await supabaseAdmin
        .from('user')
        .select('*')
        .eq('user_email', email)
        .single();

      if (fetchError || !user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if already verified
      if (user.email_verified) {
        return res.status(400).json({ error: 'Email already verified' });
      }

      // Check if verification code matches
      if (user.verify_email_code !== verifyCode) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      // Check if verification code has expired
      if (!user.verify_email_expiring_time) {
        return res.status(400).json({ error: 'Verification code has expired' });
      }

      const expiringTime = new Date(user.verify_email_expiring_time);
      const now = new Date();

      if (now > expiringTime) {
        return res.status(400).json({ error: 'Verification code has expired' });
      }

      // Generate access token
      const accessToken = generateToken({
        userId: user.user_id,
        username: user.username,
        email: user.user_email,
      });

      // Update user - mark email as verified and clear verification code
      const { error: updateError } = await supabaseAdmin
        .from('user')
        .update({
          email_verified: true,
          verify_email_code: null,
          verify_email_expiring_time: null,
          access_token: accessToken,
        })
        .eq('user_id', user.user_id);

      if (updateError) {
        console.error('Email verification error:', updateError);
        return res.status(500).json({ error: 'Failed to verify email' });
      }

      // Generate JWT token for immediate login
      const token = generateToken({
        userId: user.user_id,
        username: user.username,
        email: user.user_email,
        subscriptionLevel: user.subscription_level,
      });

      res.json({
        message: 'Email verified successfully',
        token,
        user: {
          userId: user.user_id,
          username: user.username,
          email: user.user_email,
          subscriptionLevel: user.subscription_level,
          firstTimeLogin: user.first_time_login,
          emailVerified: true,
        },
      });
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
