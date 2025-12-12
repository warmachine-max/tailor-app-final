import express from "express";
import { signup, login, logout, getUser } from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get('/user', protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;
