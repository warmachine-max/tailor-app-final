import ReturnRequest from "../models/ReturnRequest.js";
import Booking from '../models/Booking.js';

// --- POST /api/booking/:id/return ---
export const initiateReturn = async (req, res) => {
  
    const bookingId = req.params.id;
    const currentUserId = req.user.id; 
    const { reason } = req.body;

    if (!reason) {
        return res.status(400).json({ message: "Return reason is required." });
    }

    try {
        // 2. Verification: Check if the booking exists and belongs to the user
        const booking = await Booking.findOne({ _id: bookingId, user: currentUserId });
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found or access denied." });
        }

        // 3. CRITICAL: Check Eligibility (Must be delivered)
        if (booking.status !== 'delivered') {
            return res.status(400).json({ 
                message: `Return can only be initiated for delivered items. Current status: ${booking.status}` 
            });
        }

        // 4. Prevent Duplicates Check
        const existingReturn = await ReturnRequest.findOne({ 
            bookingId, 
            status: { $in: ['return_pending', 'return_approved'] } // Check for active return requests
        });
        
        if (existingReturn) {
            return res.status(400).json({ 
                message: `An active return request for this booking already exists with status: ${existingReturn.status}` 
            });
        }

        // 5. Create the Return Request
        const newReturn = await ReturnRequest.create({
            bookingId,
            userId: currentUserId,
            returnReason: reason,
            status: 'return_pending',
        });
        
        // 6. CRITICAL: Update the original Booking status
        booking.status = 'return_pending';
        // Optional: Add a note to the booking for quick reference
        booking.adminMessage = `Return requested by customer. Reason: ${reason}`;
        const updatedBooking = await booking.save(); // Save the updated booking

        // 7. Send success response with the updated booking data
        res.status(201).json({
            message: "Return request submitted successfully and booking status updated.",
            returnRequest: newReturn,
            // Send the updated booking so the frontend can refresh
            booking: updatedBooking 
        });

    } catch (error) {
        console.error('Error initiating return:', error);
        res.status(500).json({ message: "Server error while creating return request." });
    }
};


// // --- Assuming this function is in your bookingController.js file ---
// import Booking from '../models/Booking.js'; // Ensure you import your Booking model

export const updateStatus = async (req, res) => {
    const bookingId = req.params.id;
    // Get status and optional message from the frontend
    const { status, adminMessage } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Status is required." });
    }

    try {
        // Find and update the booking in a single, robust operation
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { 
                status: status, 
                // Ensure adminMessage is included, even if empty, so the existing message is overwritten if needed.
                adminMessage: adminMessage || "" 
            },
            { 
                new: true, // Return the updated document
                runValidators: true // CRITICAL: Run Mongoose enum validation to ensure status is correct
            }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        res.status(200).json({ 
            message: "Booking status updated successfully.", 
            booking: updatedBooking // Return the updated object for frontend state management
        });

    } catch (error) {
        console.error("Error updating booking status:", error);
        // Return a detailed error if validation fails (which should be fixed by now, 
        // but this helps catch future issues)
        return res.status(500).json({ 
            message: "Server error or invalid status provided.", 
            details: error.message 
        });
    }
};