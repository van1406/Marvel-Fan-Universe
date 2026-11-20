/**
 * 404 handler for unmatched routes.
 */
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Central error handler: converts thrown errors (including mongoose
 * CastError/ValidationError and JWT errors) into a consistent JSON shape.
 */
export const errorHandler = (err, _req, res, _next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server error";

  // Mongoose: malformed ObjectId in a URL
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid identifier format";
  }
  // Mongoose: schema validation failure
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }
  // Mongoose: duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    status = 409;
    message = "Email is already registered";
  }

  // In production, don't leak internal error details
  if (process.env.NODE_ENV === "production" && status === 500) {
    message = "Server error";
  }

  res.status(status).json({ message });
};
