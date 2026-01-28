import express from 'express';
import {
  signUp,
  login,
  emailVerify,
  verifyEmailCode,
  resetCodeGenerate,
  resetCodeVerify,
  transactionInsert
} from '../controllers/authController.js';
import {
  signUpValidation,
  loginValidation,
  emailVerifyValidation,
  verifyEmailCodeValidation,
  resetCodeGenerateValidation,
  resetCodeVerifyValidation,
  transactionValidation,
  validate
} from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

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

// Transaction insert endpoint (requires authentication)
router.post('/transaction-in', authenticate, transactionValidation, validate, transactionInsert);

export default router;
