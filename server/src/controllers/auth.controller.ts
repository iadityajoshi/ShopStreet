import { Request, Response, NextFunction } from "express";
import { createUser, findUserByEmail, findUserById } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

/**
 * Handles user registration.
 * Creates a new user record with a hashed password and issues an initial JWT token.
 * Responds with HTTP 201 Created.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw ApiError.badRequest("A user with this email already exists");
    }

    // 2. Hash plain-text password with bcrypt (10 salt rounds)
    const passwordHash = await hashPassword(password);

    // 3. Persist new user in PostgreSQL
    const newUser = await createUser({
      name,
      email,
      passwordHash,
      role: "CUSTOMER",
    });

    // 4. Issue a stateless JWT token containing user identity claims
    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // 5. Respond with HTTP 201 Created
    res.status(201).json({
      message: "Registration successful",
      user: newUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles user login.
 * Verifies email and password hash, then issues a fresh JWT token.
 * Responds with HTTP 200 OK.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Retrieve user with password_hash by email
    const user = await findUserByEmail(email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // 2. Compare incoming plain password with stored bcrypt hash
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // 3. Issue a fresh JWT token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // 4. Return safe user profile (without password_hash) and token
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    res.status(200).json({
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the currently authenticated user's profile.
 * Expects auth.middleware to have already verified the JWT and populated req.user.
 * Responds with HTTP 200 OK.
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};
