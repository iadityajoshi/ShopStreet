import fs from "fs";
import path from "path";
import pg from "pg";
import { env } from "../config/env";

const { Client } = pg;

async function runMigration() {
  console.log("-----------------------------------------");
  console.log("🚀 Starting database migration...");
  console.log(`Connecting to: ${env.DATABASE_URL.replace(/:[^:@]+@/, ":****@")}`);

  let client = new Client({ connectionString: env.DATABASE_URL });

  try {
    await client.connect();
  } catch (err: any) {
    // If the database does not exist (PostgreSQL error 3D000)
    if (err.code === "3D000") {
      console.log("ℹ️ Database does not exist yet. Creating it via default 'postgres' database...");
      
      // Parse URL to connect to default "postgres" db
      const url = new URL(env.DATABASE_URL);
      const dbNameToCreate = url.pathname.replace(/^\//, "");
      url.pathname = "/postgres";

      const adminClient = new Client({ connectionString: url.toString() });
      await adminClient.connect();
      await adminClient.query(`CREATE DATABASE "${dbNameToCreate}"`);
      await adminClient.end();
      console.log(`✅ Database "${dbNameToCreate}" created successfully!`);

      // Reconnect to the newly created database
      client = new Client({ connectionString: env.DATABASE_URL });
      await client.connect();
    } else {
      console.error("❌ Failed to connect to PostgreSQL:", err.message);
      console.log("\n💡 Check your .env DATABASE_URL setting (username, password, port).");
      process.exit(1);
    }
  }

  try {
    const schemaPath = path.resolve(__dirname, "../../sql/001_schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    console.log("Executing 001_schema.sql...");
    await client.query(schemaSql);

    console.log("✅ Schema migration completed successfully!");
    console.log("Tables created: categories, users, products, cart_items, orders, order_items, reviews");
    console.log("-----------------------------------------");
  } catch (err: any) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
