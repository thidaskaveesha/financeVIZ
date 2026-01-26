import { supabase } from '../config/database.js';
import {
  generateSalt,
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateVerificationCode,
  generateJWT
} from '../utils/security.js';
import { sendVerificationEmail, sendResetCodeEmail } from '../utils/email.js';

/**
 * Sign-Up Controller
 * Creates a new user account with secure password hashing
 */
export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username already exists (optimized query with index)
    const { data: existingUserByUsername, error: usernameError } = await supabase
      .from('user')
      .select('user_id')
      .eq('username', username)
      .single();

    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check if email already exists
    const { data: existingUserByEmail, error: emailError } = await supabase
      .from('user')
      .select('user_id')
      .eq('user_email', email)
      .single();

    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Generate salt and hash password
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    // Generate access token (10 characters)
    const accessToken = generateAccessToken(username);

    // Set subscription level server-side only (default: 'free')
    const subscriptionLevel = 'free'; // Can be modified based on business logic

    // Insert user into database
    const { data: newUser, error: insertError } = await supabase
      .from('user')
      .insert({
        username,
        user_email: email,
        hashed_password: hashedPassword,
        salt,
        access_token: accessToken,
        first_time_login: true,
        email_verified: false,
        subscription_level: subscriptionLevel,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user account'
      });
    }

    res.status(201).json({
      success: true,
      message: 'User account created successfully',
      data: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.user_email,
        email_verified: newUser.email_verified
      }
    });
  } catch (error) {
    console.error('Sign-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Login Controller
 * Authenticates user and returns JWT token
 */
export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Find user by username or email
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('*')
      .or(`username.eq.${usernameOrEmail},user_email.eq.${usernameOrEmail}`)
      .single();

    if (!user || userError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.hashed_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({
        success: false,
        message: 'Email not verified'
      });
    }

    // Generate JWT token with server-verified claims
    const token = generateJWT({
      user_id: user.user_id,
      username: user.username,
      subscription_level: user.subscription_level // Server-verified, cannot be tampered
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.user_email,
          subscription_level: user.subscription_level,
          first_time_login: user.first_time_login
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Email Verify Controller
 * Generates and sends verification code to user's email
 */
export const emailVerify = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('user_id, email_verified')
      .eq('user_email', email)
      .single();

    if (!user || userError) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    // Check if already verified
    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate 8-digit verification code
    const verificationCode = generateVerificationCode();

    // Set expiration time (5 minutes from now)
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    // Update user with verification code and expiration time
    const { error: updateError } = await supabase
      .from('user')
      .update({
        verify_email_code: verificationCode,
        verify_email_expiring_time: expirationTime.toISOString()
      })
      .eq('user_id', user.user_id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate verification code'
      });
    }

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.json({
      success: true,
      message: 'Verification code sent to email'
    });
  } catch (error) {
    console.error('Email verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Verify Email Code Controller
 * Verifies the email verification code and marks email as verified
 */
export const verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('user_email', email)
      .single();

    if (!user || userError) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    // Check if code matches
    if (user.verify_email_code !== parseInt(code)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Check if code has expired
    const expirationTime = new Date(user.verify_email_expiring_time);
    const currentTime = new Date();
    
    if (currentTime > expirationTime) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Mark email as verified and clear verification code
    const { error: updateError } = await supabase
      .from('user')
      .update({
        email_verified: true,
        verify_email_code: null,
        verify_email_expiring_time: null
      })
      .eq('user_id', user.user_id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify email'
      });
    }

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email code error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Reset Code Generate Controller
 * Generates and sends password reset code to user's email
 */
export const resetCodeGenerate = async (req, res) => {
  try {
    const { usernameOrEmail } = req.body;

    // Find user by username or email
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('user_id, user_email')
      .or(`username.eq.${usernameOrEmail},user_email.eq.${usernameOrEmail}`)
      .single();

    if (!user || userError) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate 8-digit reset code
    const resetCode = generateVerificationCode();

    // Set expiration time (5 minutes from now)
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    // Update user with reset code and expiration time
    const { error: updateError } = await supabase
      .from('user')
      .update({
        reset_code: resetCode,
        reset_code_expiring_time: expirationTime.toISOString()
      })
      .eq('user_id', user.user_id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate reset code'
      });
    }

    // Send reset code email
    const emailSent = await sendResetCodeEmail(user.user_email, resetCode);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset code email'
      });
    }

    res.json({
      success: true,
      message: 'Reset code sent to email'
    });
  } catch (error) {
    console.error('Reset code generate error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Reset Code Verify Controller
 * Verifies the password reset code
 */
export const resetCodeVerify = async (req, res) => {
  try {
    const { usernameOrEmail, code } = req.body;

    // Find user by username or email
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('*')
      .or(`username.eq.${usernameOrEmail},user_email.eq.${usernameOrEmail}`)
      .single();

    if (!user || userError) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if reset code matches
    if (user.reset_code !== parseInt(code)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset code'
      });
    }

    // Check if code has expired
    if (!user.reset_code_expiring_time) {
      return res.status(400).json({
        success: false,
        message: 'Reset code not found'
      });
    }

    const expirationTime = new Date(user.reset_code_expiring_time);
    const currentTime = new Date();
    
    if (currentTime > expirationTime) {
      return res.status(400).json({
        success: false,
        message: 'Reset code has expired'
      });
    }

    res.json({
      success: true,
      message: 'Reset code verified successfully'
    });
  } catch (error) {
    console.error('Reset code verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
