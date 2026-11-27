import { query } from "../config/db";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  created_at: Date;
}

export interface UserWithPassword extends User {
  password_hash: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role?: "CUSTOMER" | "ADMIN";
}

/**
 * Inserts a new user record into the database using parameterized SQL.
 * The RETURNING clause immediately returns the newly inserted row without a separate SELECT.
 */
export const createUser = async (data: CreateUserData): Promise<User> => {
  const sql = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at;
  `;
  const params = [data.name, data.email, data.passwordHash, data.role || "CUSTOMER"];

  const res = await query(sql, params);
  return res.rows[0];
};

/**
 * Finds a user by unique email. Includes password_hash for credential verification.
 */
export const findUserByEmail = async (email: string): Promise<UserWithPassword | null> => {
  const sql = `
    SELECT id, name, email, password_hash, role, created_at
    FROM users
    WHERE email = $1;
  `;
  const res = await query(sql, [email]);
  return res.rows[0] || null;
};

/**
 * Finds a user by ID. Excludes password_hash for safe consumer/profile lookups.
 */
export const findUserById = async (id: string): Promise<User | null> => {
  const sql = `
    SELECT id, name, email, role, created_at
    FROM users
    WHERE id = $1;
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};
