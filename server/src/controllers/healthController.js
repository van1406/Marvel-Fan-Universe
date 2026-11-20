import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @route  GET /api/health
 * @desc   Liveness check — also verifies DB connectivity
 * @access Public
 */
export const healthCheck = asyncHandler(async (_req, res) => {
  const mongoose = (await import("mongoose")).default;
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
  });
});
