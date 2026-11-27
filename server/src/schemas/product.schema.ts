import { z } from "zod";

/**
 * Validates query parameters for GET /api/products
 * Uses z.coerce to safely parse string values from URL query strings into numbers.
 */
export const getProductsQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    minPrice: z.coerce
      .number({ invalid_type_error: "minPrice must be a number" })
      .min(0, "minPrice cannot be negative")
      .optional(),
    maxPrice: z.coerce
      .number({ invalid_type_error: "maxPrice must be a number" })
      .min(0, "maxPrice cannot be negative")
      .optional(),
    sort: z
      .enum(["newest", "price_asc", "price_desc", "title_asc"])
      .default("newest"),
    page: z.coerce
      .number({ invalid_type_error: "page must be a number" })
      .int("page must be an integer")
      .min(1, "page must be at least 1")
      .default(1),
    limit: z.coerce
      .number({ invalid_type_error: "limit must be a number" })
      .int("limit must be an integer")
      .min(1, "limit must be at least 1")
      .max(50, "limit cannot exceed 50")
      .default(12),
  }),
});

/**
 * Validates route parameters for single product lookups: GET /api/products/:id
 */
export const productIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID format (must be a valid UUID)"),
  }),
});

/**
 * Validates request body for product creation: POST /api/products (Admin)
 */
export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid("Invalid category ID format"),
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title cannot exceed 200 characters"),
    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(10, "Description must be at least 10 characters"),
    price: z
      .number({ required_error: "Price is required" })
      .positive("Price must be greater than 0"),
    stock: z
      .number({ required_error: "Stock is required" })
      .int("Stock must be an integer")
      .min(0, "Stock cannot be negative"),
    imageUrl: z
      .string({ required_error: "Image URL is required" })
      .url("Invalid image URL format"),
  }),
});

/**
 * Validates partial updates: PUT /api/products/:id (Admin)
 */
export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID format"),
  }),
  body: createProductSchema.shape.body.partial(),
});

// Infer static TypeScript types from Zod schemas
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>["query"];
export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
