import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import { signToken } from "../utils/generateToken.js";

/**
 * @route  POST /api/auth/signup
 * @desc   Register a new user
 * @access Public
 */
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, favouriteHero } = req.body ?? {};

  // Required fields present?
  if (!name || !email || !password || !favouriteHero) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, password and favouriteHero" });
  }

  // Email already registered? (unique index is the real safety net; this gives a friendlier error)
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  // Create — hashing happens in the User model's pre-save hook
  const user = await User.create({ name, email, password, favouriteHero });

  res.status(201).json({
    message: "Account created successfully",
    token: signToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      favouriteHero: user.favouriteHero,
    },
  });
});

/**
 * @route  POST /api/auth/login
 * @desc   Authenticate an existing user
 * @access Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  // Password has `select: false`, so request it explicitly here
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    // Same message for both cases — don't reveal whether the email exists
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  res.status(200).json({
    message: "Login successful",
    token: signToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      favouriteHero: user.favouriteHero,
    },
  });
});

/**
 * @route  GET /api/me
 * @desc   Return the profile of the user who owns the bearer token
 * @access Private (JWT)
 */
export const getMe = asyncHandler(async (req, res) => {
  // protect middleware has already verified the JWT → req.user = { id, email }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User no longer exists" });
  }

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      favouriteHero: user.favouriteHero,
    },
  });
});
