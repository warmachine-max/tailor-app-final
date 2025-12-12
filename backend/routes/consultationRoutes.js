// /routes/consultationRoutes.js

import express from 'express';
const router = express.Router();
import { 
    bookConsultation, 
    getAllConsultations, 
    updateConsultationStatus,
    deleteConsultation // <-- NEW: Import the delete function
    
} from '../controllers/consultationController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Adjust path as necessary

// Public route for customers to submit a booking
// POST /api/consultations/book
router.post('/book', bookConsultation);

// --- ADMIN ROUTES (Requires JWT authentication and Admin role) ---

// GET all consultations (Admin dashboard fetch)
// GET /api/consultations
router.get('/', protect, admin, getAllConsultations);

// PUT update consultation status (Admin action)
// PUT /api/consultations/:id/status
router.put('/:id/status', protect, admin, updateConsultationStatus);

// DELETE a specific consultation record (Admin action)
// DELETE /api/consultations/:id
router.delete('/:id', protect, admin, deleteConsultation); // <-- NEW: DELETE Route added

export default router;