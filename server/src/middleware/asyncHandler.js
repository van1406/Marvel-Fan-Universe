/**
 * Wraps async route handlers so rejected promises are forwarded to
 * Express's error handling (no try/catch needed in every controller).
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
