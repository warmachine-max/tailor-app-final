import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper function to generate JWT token
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );


export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
   console.log(name, email, password, role);
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const user = await User.create({
    name,
    email,
    password,
    role: role || "customer"   // default role
  });

  const token = generateToken(user);

  // --- CORRECTED COOKIE SETTINGS ---
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,         // <-- CRITICAL: Must be true for HTTPS/Cross-Site
    sameSite: "None",     // <-- CRITICAL: Must be "None" for Vercel (frontend) to Render (backend)
    maxAge: 7*24*60*60*1000
  });
  // ---------------------------------

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token // Sending token in JSON body is often used for client-side state/context
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user);

  // --- CORRECTED COOKIE SETTINGS ---
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,         // <-- CRITICAL: Changed from false to true
    sameSite: "None",     // <-- CRITICAL: Changed from "lax" to "None"
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  // ---------------------------------

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const logout = (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    maxAge: 0
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getUser = async (req, res) => {
  try {
    if (!req.user) {
      // This happens if the protection middleware failed to set req.user
      return res.status(404).json({ message: "User not found or token missing/invalid" });
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};