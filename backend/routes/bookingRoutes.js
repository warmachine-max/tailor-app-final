import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { 
    createBooking, 
    getUserBookings, 
    getAllBookings, 
    adminUpdateBooking, // Handles Admin status PATCH /:id/status
    deleteBooking 
} from "../controllers/bookingController.js";

import { initiateReturn } from '../controllers/returnController.js'; // Handles Customer POST /:id/return

const router = express.Router();

// ======================== CUSTOMER ROUTES (PROTECTED) ========================

// POST /api/booking/book - Customer creates a new booking
router.post("/book", protect, createBooking);

// GET /api/booking/user - Customer fetches their own bookings
router.get("/user", protect, getUserBookings);

// POST /api/booking/:id/return - Customer initiates a return request (sets status to 'return_pending')
router.post('/:id/return', protect, initiateReturn);


// ========================= ADMIN ROUTES (PROTECTED + ADMIN) =========================

// GET /api/booking/all - Admin fetches all bookings
router.get("/all", protect, admin, getAllBookings);

// PATCH /api/booking/:id/status - Admin updates booking status (including return statuses)
router.patch("/:id/status", protect, admin, adminUpdateBooking);

// DELETE /api/booking/:id/delete - Admin deletes/archives a booking record
router.delete("/:id/delete", protect, admin, deleteBooking); 
// NOTE: I added 'protect, admin' to the delete route for security, 
// assuming only admins should permanently delete records.

export default router;