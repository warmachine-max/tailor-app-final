import express from "express";
import upload from "../middleware/upload.js";
import {
  createBlouse,
  deleteBlouse,
  createSaree,
  deleteSaree,
  createLehenga,
  deleteLehenga,
  createSalwar,
  deleteSalwar,
  fetchBlouses,
  fetchSarees,
  fetchLehengas,
  fetchSalwars
} from "../controllers/womenController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------------- BLOUSE ---------------------- */
router.post("/blouse/create", protect, admin, upload.single("image"), createBlouse);
router.delete("/blouse/:id", protect, admin, deleteBlouse);
router.get("/blouses", fetchBlouses); // FETCH BLOUSES

/* ---------------------- SAREE ---------------------- */
router.post("/saree/create", protect, admin, upload.single("image"), createSaree);
router.delete("/saree/:id", protect, admin, deleteSaree);
router.get("/sarees", fetchSarees); // FETCH SAREES

/* ---------------------- LEHENGA ---------------------- */
router.post("/lehenga/create", protect, admin, upload.single("image"), createLehenga);
router.delete("/lehenga/:id", protect, admin, deleteLehenga);
router.get("/lehengas", fetchLehengas); // FETCH LEHENGAS

/* ---------------------- SALWAR ---------------------- */
router.post("/salwar/create", protect, admin, upload.single("image"), createSalwar);
router.delete("/salwar/:id", protect, admin, deleteSalwar);
router.get("/salwars", fetchSalwars); // FETCH SALWARS

export default router;
