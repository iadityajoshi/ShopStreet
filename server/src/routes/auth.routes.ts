import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new customer account
 * @access  Public
 */
router.post("/register", validate(registerSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user credentials & issue JWT token
 * @access  Public
 */
router.post("/login", validate(loginSchema), login);

/**
 * @route   GET /api/auth/me
 * @desc    Retrieve current authenticated user profile
 * @access  Protected (Requires valid Bearer token)
 */
router.get("/me", authenticate, getMe);

export default router;
