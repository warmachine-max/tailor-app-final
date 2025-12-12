import express from "express";
import upload from "../middleware/upload.js";
import {
  createKurta,
  deleteKurta,
  createShirt,
  deleteShirt,
  createSuit,
  deleteSuit,
  fetchKurtas,
  fetchShirts,
  fetchSuits
} from "../controllers/menController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------------- KURTA ---------------------- */
router.post(
  "/kurta/create",
  protect,
  admin,
  upload.single("image"),
  createKurta
);
router.delete("/kurta/:id", protect, admin, deleteKurta);
router.get("/kurtas", fetchKurtas); // FETCH KURTAS

/* ---------------------- SHIRT ---------------------- */
router.post(
  "/shirt/create",
  protect,
  admin,
  upload.single("image"),
  createShirt
);
router.delete("/shirt/:id", protect, admin, deleteShirt);
router.get("/shirts", fetchShirts); // FETCH SHIRTS

/* ---------------------- SUIT ---------------------- */
router.post(
  "/suit/create",
  protect,
  admin,
  upload.single("image"),
  createSuit
);
router.delete("/suit/:id", protect, admin, deleteSuit);
router.get("/suits", fetchSuits); // FETCH SUITS

export default router;
