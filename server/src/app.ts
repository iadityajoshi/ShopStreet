import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import { getCategories } from "./controllers/product.controller";
import { errorHandler } from "./middleware/error.middleware";
import { ApiError } from "./utils/ApiError";

const app: Application = express();

// 1. Cross-Origin Resource Sharing (CORS) Configuration
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// 2. Parse incoming JSON request bodies into req.body
app.use(express.json());

// 3. Health Check endpoint for uptime monitoring & smoke testing
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// 4. Mount Application Feature Routers
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.get("/api/categories", getCategories);

// 5. 404 Handler for undefined routes
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
});

// 6. Centralized Error Handling Middleware (must be registered last!)
app.use(errorHandler);

export default app;
