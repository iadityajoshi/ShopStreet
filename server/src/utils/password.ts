import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password using bcrypt.
 * Generates a random cryptographic salt and runs 10 key-expansion rounds.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain-text password with an existing bcrypt hash.
 * Resists timing attacks by computing the hash with the salt embedded in the stored hash.
 */
export const comparePassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};
