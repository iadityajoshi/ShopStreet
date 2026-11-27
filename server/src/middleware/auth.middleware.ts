import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

/**
 * Authentication Middleware:
 * Extracts and validates the Bearer JWT token from the Authorization header.
 * Attaches the decoded user identity payload (id, email, role) to req.user.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Authentication required. Please provide a Bearer token.");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw ApiError.unauthorized("Token missing from Authorization header.");
  }

  // verifyToken will throw ApiError.unauthorized if token is expired or invalid
  const payload = verifyToken(token);
  req.user = payload;

  next();
};
