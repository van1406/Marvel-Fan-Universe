import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { healthCheck } from "./controllers/healthController.js";
import { getMe } from "./controllers/authController.js";
import { protect } from "./middleware/authMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// --- Core middleware -------------------------------------------------------
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json()); // parse JSON bodies

// --- Routes ----------------------------------------------------------------
app.get("/api/health", healthCheck);
app.use("/api/auth", authRoutes);
// Current-user profile — JWT required (must be registered before the 404 handler)
app.get("/api/me", protect, getMe);

// --- 404 + centralized error handling --------------------------------------
app.use(notFound);
app.use(errorHandler);

export default app;
