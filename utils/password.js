import bcrypt from 'bcrypt';

/**
 * Generate a random salt for password hashing
 * @returns {Promise<string>} Generated salt
 */
export async function generateSalt() {
  return await bcrypt.genSalt(10);
}

/**
 * Hash a password with a given salt
 * @param {string} password - Plain text password
 * @param {string} salt - Salt to use for hashing
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password, salt) {
  return await bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password to verify
 * @param {string} hashedPassword - Stored hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a random 8-digit code
 * @returns {number} 8-digit code
 */
export function generateVerificationCode() {
  return Math.floor(10000000 + Math.random() * 90000000);
}
