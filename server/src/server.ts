import app from "./app";
import { env } from "./config/env";
import { pool } from "./config/db";

const startServer = async () => {
  try {
    // 1. Verify PostgreSQL connection before accepting HTTP traffic
    const client = await pool.connect();
    console.log("✅ Database connected successfully to PostgreSQL");
    client.release(); // Return client to pool

    // 2. Start listening on the configured PORT
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 ShopStreet Server running in ${env.NODE_ENV} mode`);
      console.log(`📡 Listening on http://localhost:${env.PORT}`);
    });

    // 3. Graceful shutdown handler (Ctrl+C or kill signal)
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        console.log("🔒 HTTP server closed.");
        await pool.end();
        console.log("🐘 PostgreSQL pool connections closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
