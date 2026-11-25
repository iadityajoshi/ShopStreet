import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

/**
 * Centralized error-handling middleware.
 * Guarantees a consistent JSON response shape: { error: { code, message, details? } }
 * Prevents internal SQL details, stack traces, and sensitive data from leaking to clients.
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = "An unexpected error occurred on the server";
  let details: unknown = undefined;

  // 1. Handled operational API Errors
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.errors;

    switch (statusCode) {
      case 400:
        code = "BAD_REQUEST";
        break;
      case 401:
        code = "UNAUTHORIZED";
        break;
      case 403:
        code = "FORBIDDEN";
        break;
      case 404:
        code = "NOT_FOUND";
        break;
      case 409:
        code = "CONFLICT";
        break;
      default:
        code = "ERROR";
    }
  }
  // 2. PostgreSQL specific errors
  else if (err.code === "23505") {
    // Unique violation (e.g. duplicate email)
    statusCode = 409;
    code = "DUPLICATE_ENTRY";
    message = "A record with this information already exists.";
  } else if (err.code === "23503") {
    // Foreign key constraint violation
    statusCode = 400;
    code = "FOREIGN_KEY_VIOLATION";
    message = "Referenced resource does not exist.";
  } else if (err.code === "22P02") {
    // Invalid UUID / data type
    statusCode = 400;
    code = "INVALID_INPUT_SYNTAX";
    message = "Invalid identifier or parameter syntax.";
  } else {
    // Unhandled / system errors: log to server console
    console.error("🔥 Unhandled Server Error:", err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
      ...(env.NODE_ENV !== "production" && !err.isOperational ? { stack: err.stack } : {}),
    },
  });
};
