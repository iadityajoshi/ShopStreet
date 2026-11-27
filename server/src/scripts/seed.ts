import fs from "fs";
import path from "path";
import pg from "pg";
import { env } from "../config/env";

const { Client } = pg;

async function runSeed() {
  console.log("-----------------------------------------");
  console.log("🌱 Starting database seeding...");

  const client = new Client({ connectionString: env.DATABASE_URL });

  try {
    await client.connect();

    const seedPath = path.resolve(__dirname, "../../sql/002_seed.sql");
    const seedSql = fs.readFileSync(seedPath, "utf-8");

    console.log("Executing 002_seed.sql...");
    await client.query(seedSql);

    // Verify row counts
    const categoriesCount = await client.query("SELECT COUNT(*) FROM categories");
    const productsCount = await client.query("SELECT COUNT(*) FROM products");
    const usersCount = await client.query("SELECT COUNT(*) FROM users");

    console.log("✅ Seeding completed successfully!");
    console.log(`📊 Current DB Stats:`);
    console.log(`   - Categories: ${categoriesCount.rows[0].count}`);
    console.log(`   - Products:   ${productsCount.rows[0].count}`);
    console.log(`   - Users:      ${usersCount.rows[0].count}`);
    console.log("-----------------------------------------");
  } catch (err: any) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeed();
