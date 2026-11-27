import { Request, Response, NextFunction } from "express";
import {
  findCategories,
  findProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../repositories/product.repository";
import { GetProductsQuery } from "../schemas/product.schema";
import { ApiError } from "../utils/ApiError";

/**
 * Retrieves all categories.
 * GET /api/categories (Public)
 */
export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await findCategories();
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves paginated, filtered, and sorted products.
 * GET /api/products (Public)
 */
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req.query has already been coerced and validated by validate(getProductsQuerySchema)
    const filters = req.query as unknown as GetProductsQuery;
    const result = await findProducts(filters);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single product by its UUID.
 * GET /api/products/:id (Public)
 */
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await findProductById(id);

    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new product in the catalog.
 * POST /api/products (Admin Only)
 */
export const createProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Partially updates an existing product.
 * PUT /api/products/:id (Admin Only)
 */
export const updateProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await updateProduct(id, req.body);

    if (!product) {
      throw ApiError.notFound("Product not found or has been deactivated");
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft deletes a product (sets is_active = FALSE).
 * DELETE /api/products/:id (Admin Only)
 */
export const deleteProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await deleteProduct(id);

    if (!deleted) {
      throw ApiError.notFound("Product not found or already deactivated");
    }

    res.status(200).json({
      message: "Product deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};
