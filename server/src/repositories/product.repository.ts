import { query } from "../config/db";
import { GetProductsQuery } from "../schemas/product.schema";

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
}

export interface Product {
  id: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  title: string;
  description: string;
  price: string; // PostgreSQL NUMERIC returns as string in JS to preserve decimal precision
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: Date;
}

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateProductData {
  categoryId: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface UpdateProductData {
  categoryId?: string;
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  isActive?: boolean;
}

/**
 * Retrieves all categories ordered alphabetically.
 */
export const findCategories = async (): Promise<Category[]> => {
  const sql = `
    SELECT id, name, slug, created_at
    FROM categories
    ORDER BY name ASC;
  `;
  const res = await query(sql);
  return res.rows;
};

/**
 * Retrieves a paginated, filtered, and sorted list of products.
 * Uses dynamic parameterization to securely build the WHERE clause.
 */
export const findProducts = async (filters: GetProductsQuery): Promise<PaginatedProducts> => {
  const conditions: string[] = ["p.is_active = TRUE"];
  const params: unknown[] = [];

  // 1. Keyword search (title or description)
  if (filters.search) {
    params.push(`%${filters.search}%`);
    const placeholder = `$${params.length}`;
    conditions.push(`(p.title ILIKE ${placeholder} OR p.description ILIKE ${placeholder})`);
  }

  // 2. Category filter (supports either slug or UUID)
  if (filters.category) {
    params.push(filters.category);
    const placeholder = `$${params.length}`;
    conditions.push(`(c.slug = ${placeholder} OR c.id::text = ${placeholder})`);
  }

  // 3. Price range filters
  if (filters.minPrice !== undefined) {
    params.push(filters.minPrice);
    conditions.push(`p.price >= $${params.length}`);
  }

  if (filters.maxPrice !== undefined) {
    params.push(filters.maxPrice);
    conditions.push(`p.price <= $${params.length}`);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  // 4. Safe dynamic sorting allowlist
  const sortMap: Record<string, string> = {
    price_asc: "p.price ASC",
    price_desc: "p.price DESC",
    title_asc: "p.title ASC",
    newest: "p.created_at DESC",
  };
  const orderByClause = `ORDER BY ${sortMap[filters.sort] || "p.created_at DESC"}`;

  // 5. Total count query for pagination metadata
  const countSql = `
    SELECT COUNT(p.id) AS total
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ${whereClause};
  `;
  const countRes = await query(countSql, params);
  const total = parseInt(countRes.rows[0].total, 10);

  // 6. Pagination parameters (LIMIT & OFFSET)
  const page = filters.page;
  const limit = filters.limit;
  const offset = (page - 1) * limit;

  params.push(limit);
  const limitPlaceholder = `$${params.length}`;

  params.push(offset);
  const offsetPlaceholder = `$${params.length}`;

  // 7. Main catalog data query
  const dataSql = `
    SELECT 
      p.id,
      p.category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      p.title,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.is_active,
      p.created_at
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ${orderByClause}
    LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
  `;

  const dataRes = await query(dataSql, params);

  return {
    products: dataRes.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Retrieves a single active product by its UUID.
 */
export const findProductById = async (id: string): Promise<Product | null> => {
  const sql = `
    SELECT 
      p.id,
      p.category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      p.title,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.is_active,
      p.created_at
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1 AND p.is_active = TRUE;
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

/**
 * Inserts a new product into PostgreSQL. (Admin)
 */
export const createProduct = async (data: CreateProductData): Promise<Product> => {
  const sql = `
    INSERT INTO products (category_id, title, description, price, stock, image_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;
  const res = await query(sql, [
    data.categoryId,
    data.title,
    data.description,
    data.price,
    data.stock,
    data.imageUrl,
  ]);

  // Fetch created product joined with its category info
  const product = await findProductById(res.rows[0].id);
  return product!;
};

/**
 * Partially updates an existing product. (Admin)
 */
export const updateProduct = async (
  id: string,
  data: UpdateProductData
): Promise<Product | null> => {
  const fields: string[] = [];
  const params: unknown[] = [id]; // $1 is always the product ID

  if (data.categoryId !== undefined) {
    params.push(data.categoryId);
    fields.push(`category_id = $${params.length}`);
  }
  if (data.title !== undefined) {
    params.push(data.title);
    fields.push(`title = $${params.length}`);
  }
  if (data.description !== undefined) {
    params.push(data.description);
    fields.push(`description = $${params.length}`);
  }
  if (data.price !== undefined) {
    params.push(data.price);
    fields.push(`price = $${params.length}`);
  }
  if (data.stock !== undefined) {
    params.push(data.stock);
    fields.push(`stock = $${params.length}`);
  }
  if (data.imageUrl !== undefined) {
    params.push(data.imageUrl);
    fields.push(`image_url = $${params.length}`);
  }
  if (data.isActive !== undefined) {
    params.push(data.isActive);
    fields.push(`is_active = $${params.length}`);
  }

  // If nothing to update, return current product
  if (fields.length === 0) {
    return findProductById(id);
  }

  const sql = `
    UPDATE products
    SET ${fields.join(", ")}
    WHERE id = $1 AND is_active = TRUE
    RETURNING id;
  `;

  const res = await query(sql, params);
  if (res.rows.length === 0) {
    return null;
  }

  return findProductById(id);
};

/**
 * Soft deletes a product by marking is_active = FALSE. (Admin)
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
  const sql = `
    UPDATE products
    SET is_active = FALSE
    WHERE id = $1 AND is_active = TRUE
    RETURNING id;
  `;
  const res = await query(sql, [id]);
  return res.rows.length > 0;
};
