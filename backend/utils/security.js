import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a random salt for password hashing
 * @returns {Promise<string>} Random salt
 */
export const generateSalt = async () => {
  return bcrypt.genSalt(12);
};

/**
 * Hash a password with a salt
 * @param {string} password - Plain text password
 * @param {string} salt - Salt to use for hashing
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password, salt) => {
  return bcrypt.hash(password, salt);
};

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a 10-character access token
 * Format: username + random numbers + random text
 * @param {string} username - Username to include in token
 * @returns {string} 10-character access token
 */
export const generateAccessToken = (username) => {
  // Take first 3 chars of username (or pad if shorter)
  const usernamePart = username.substring(0, 3).padEnd(3, '0');
  
  // Generate 3 random digits
  const randomNumbers = crypto.randomInt(100, 999).toString();
  
  // Generate 4 random alphanumeric characters
  const randomText = crypto.randomBytes(2).toString('hex').substring(0, 4);
  
  // Combine to exactly 10 characters
  const token = (usernamePart + randomNumbers + randomText).substring(0, 10);
  
  return token;
};

/**
 * Generate an 8-digit verification code
 * @returns {number} 8-digit code
 */
export const generateVerificationCode = () => {
  return crypto.randomInt(10000000, 99999999);
};

/**
 * Generate JWT token for authenticated user
 * @param {Object} payload - Token payload (user_id, username, subscription_level)
 * @returns {string} JWT token
 */
export const generateJWT = (payload) => {
  return jwt.sign(
    {
      userId: payload.user_id,
      username: payload.username,
      subscriptionLevel: payload.subscription_level,
      // Include server-verified claims only
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'financeviz-backend'
    }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username format (alphanumeric, underscore, 3-20 chars)
 * @param {string} username - Username to validate
 * @returns {boolean} True if valid username format
 */
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate password strength (min 8 chars, at least one letter and one number)
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets requirements
 */
export const isValidPassword = (password) => {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
};
