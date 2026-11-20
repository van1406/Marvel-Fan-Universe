import jwt from "jsonwebtoken";

/**
 * Signs a JWT for a user payload.
 * Expiry: 7 days by default (override with JWT_EXPIRES_IN, e.g. "1d", "12h").
 */
export const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
