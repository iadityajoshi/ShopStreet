import { Router } from "express";
import {
  getCategories,
  getProducts,
  getProductById,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/product.controller";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import {
  getProductsQuerySchema,
  productIdParamSchema,
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";

const router = Router();

/**
 * @route   GET /api/products/categories
 * @desc    Retrieve all product categories
 * @access  Public
 */
router.get("/categories", getCategories);

/**
 * @route   GET /api/products
 * @desc    List products with pagination, search, category, price, and sorting
 * @access  Public
 */
router.get("/", validate(getProductsQuerySchema), getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Retrieve single product details by UUID
 * @access  Public
 */
router.get("/:id", validate(productIdParamSchema), getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin Only)
 */
router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(createProductSchema),
  createProductHandler
);

/**
 * @route   PUT /api/products/:id
 * @desc    Partially update an existing product
 * @access  Private (Admin Only)
 */
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateProductSchema),
  updateProductHandler
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Soft delete (deactivate) a product
 * @access  Private (Admin Only)
 */
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validate(productIdParamSchema),
  deleteProductHandler
);

export default router;
