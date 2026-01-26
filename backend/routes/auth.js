import express from 'express';
import {
  signUp,
  login,
  emailVerify,
  verifyEmailCode,
  resetCodeGenerate,
  resetCodeVerify
} from '../controllers/authController.js';
import {
  signUpValidation,
  loginValidation,
  emailVerifyValidation,
  verifyEmailCodeValidation,
  resetCodeGenerateValidation,
  resetCodeVerifyValidation,
  validate
} from '../middleware/validation.js';

const router = express.Router();

// Sign-Up endpoint
router.post('/sign-up', signUpValidation, validate, signUp);

// Login endpoint
router.post('/login', loginValidation, validate, login);

// Email Verify endpoint (generate and send code)
router.post('/email-verify', emailVerifyValidation, validate, emailVerify);

// Verify Email Code endpoint
router.post('/verify-email-code', verifyEmailCodeValidation, validate, verifyEmailCode);

// Reset Code Generate endpoint
router.post('/reset-code-generate', resetCodeGenerateValidation, validate, resetCodeGenerate);

// Reset Code Verify endpoint
router.post('/reset-code-verify', resetCodeVerifyValidation, validate, resetCodeVerify);

export default router;
