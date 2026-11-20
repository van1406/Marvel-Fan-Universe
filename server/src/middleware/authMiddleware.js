import jwt from "jsonwebtoken";

/**
 * Verifies the Authorization: Bearer <token> header and attaches req.user.
 * Usage: router.get("/me", protect, handler)
 */
export const protect = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};
