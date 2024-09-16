const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} - The hashed password.
 */
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

/**
 * Compares a plain text password with a stored hash.
 * @param {string} password - The plain text password to compare.
 * @param {string} storedHash - The hashed password to compare against.
 * @returns {Promise<boolean>} - Whether the passwords match.
 */
const comparePassword = async (password, storedHash) => {
  try {
    const isMatch = await bcrypt.compare(password, storedHash);
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

module.exports = {
  hashPassword,
  comparePassword
};
