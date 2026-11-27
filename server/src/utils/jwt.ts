import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./ApiError";

export interface TokenPayload {
  id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

/**
 * Signs a stateless JSON Web Token (JWT) containing non-sensitive user identity claims.
 */
export const signToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as any,
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

/**
 * Verifies a JWT's cryptographic signature using our server's secret.
 * Throws an ApiError.unauthorized if expired or tampered with.
 */
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Authentication token has expired. Please log in again.");
    }
    throw ApiError.unauthorized("Invalid authentication token.");
  }
};
