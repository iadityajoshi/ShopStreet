import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

/**
 * Authorization Middleware:
 * Must be used AFTER authenticate middleware.
 * Verifies that the authenticated user possesses the ADMIN role.
 */
export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required.");
  }

  if (req.user.role !== "ADMIN") {
    throw ApiError.forbidden("Access denied: Administrator privileges required.");
  }

  next();
};
