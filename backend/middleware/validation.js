import { body, validationResult } from 'express-validator';

/**
 * Validation middleware to check validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Sign-up validation rules
 */
export const signUpValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .withMessage('Password must contain at least one letter and one number')
];

/**
 * Login validation rules
 */
export const loginValidation = [
  body('usernameOrEmail')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Email verify validation rules (generate code)
 */
export const emailVerifyValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
];

/**
 * Verify email code validation rules
 */
export const verifyEmailCodeValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('code')
    .isInt({ min: 10000000, max: 99999999 })
    .withMessage('Code must be an 8-digit number')
];

/**
 * Reset code generate validation rules
 */
export const resetCodeGenerateValidation = [
  body('usernameOrEmail')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required')
];

/**
 * Reset code verify validation rules
 */
export const resetCodeVerifyValidation = [
  body('usernameOrEmail')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required'),
  body('code')
    .isInt({ min: 10000000, max: 99999999 })
    .withMessage('Code must be an 8-digit number')
];
