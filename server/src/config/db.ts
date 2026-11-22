import pg from "pg";
import { env } from "./env";

const { Pool } = pg;

// Connection pool: reuses existing connections instead of opening a new TCP connection on every request
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
  process.exit(-1);
});

// Helper for single parameterized queries
export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  if (env.NODE_ENV !== "production") {
    console.log(`[SQL] (${duration}ms) ${text.trim().split("\n")[0]}`);
  }
  return res;
};

// Helper to get a dedicated client for multi-step transactions (BEGIN, COMMIT, ROLLBACK)
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};
