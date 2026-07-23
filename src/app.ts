import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middleware/errorhandler.middleware";
import cookieParser from "cookie-parser"
// npm i -D @types/express

//* importing routes
import authRoutes from "./routes/auth.routes";
import brandRoutes from "./routes/brand.routes";

//* express app instance
const app = express();

//! using middlewares
app.use(cookieParser());
app.use(express.json());

//! health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "server is up & running!!!",
    success: true,
    status: "success",
    data: null,
  });
});

//! using routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/brands", brandRoutes);

//!  using path not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  const message = `can not ${req.method} on ${req.path}`;
  res.status(404).json({
    message,
    status: "'fail",
  });
});

//! error handler middleware
app.use(errorHandler);

export default app;
