// /controllers/consultationController.js

import Consultation from '../models/ConsultationModel.js'; 

/**
 * @desc Book a new personalized tailor consultation
 * @route POST /api/consultations/book
 * @access Public
 */
const bookConsultation = async (req, res) => {
    console.log('Booking attempt:', req.body.email);
    try {
        const { 
            name, email, phone, serviceType, preferredDate, preferredTime, address,
            occasion, styleArchetype, bodyShape, comfortPreference, notes, inspirationLink 
        } = req.body;

        // --- 1. Custom Validation for Doorstep Service ---
        const isDoorstep = serviceType === 'Doorstep Visit (Tailor comes to you)';

        if (isDoorstep && !address) {
            return res.status(400).json({ 
                message: 'Address is required for a Doorstep Visit consultation. Please fill in the address field.' 
            });
        }
        
        // --- 2. Assemble Data into Schema Structure ---
        const consultationData = {
            client: {
                name,
                email,
                phone,
            },
            appointment: {
                serviceType,
                preferredDate: new Date(preferredDate), // Convert date string to Date object
                preferredTime,
                address: isDoorstep ? address : null, 
            },
            profile: {
                occasion,
                styleArchetype,
                bodyShape,
                comfortPreference,
                inspirationLink,
                notes,
            },
            // status defaults to 'PENDING_CONFIRMATION'
        };

        // --- 3. Database Operation ---
        const savedConsultation = await Consultation.create(consultationData);
        
        // --- 4. Final Success Response ---
        res.status(201).json({ 
            success: true,
            message: 'Consultation request successfully submitted. Awaiting confirmation from our tailor team.',
            data: savedConsultation 
        });

    } catch (error) {
        console.error('Error booking consultation:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ 
                message: 'Validation Error',
                errors: messages 
            });
        }
        
        res.status(500).json({ 
            message: 'An unexpected error occurred while processing your request.',
            error: error.message 
        });
    }
};

// --------------------------------------------------------------------------

/**
 * @desc Get all consultation requests
 * @route GET /api/consultations
 * @access Private/Admin
 */
const getAllConsultations = async (req, res) => {
    try {
        // Find all consultations, sort by creation date (newest first)
        const consultations = await Consultation.find({})
            .sort({ createdAt: -1 }); 

        res.status(200).json(consultations);

    } catch (error) {
        console.error('Error fetching all consultations:', error);
        res.status(500).json({ message: 'Server Error: Could not retrieve consultations.' });
    }
};

// --------------------------------------------------------------------------

/**
 * @desc Update the status of a specific consultation
 * @route PUT /api/consultations/:id/status
 * @access Private/Admin
 */
const updateConsultationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate if the status is one of the allowed values
    const allowedStatuses = ['PENDING_CONFIRMATION', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status value: ${status}` });
    }

    try {
        const consultation = await Consultation.findById(id);

        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found.' });
        }

        // Update the status
        consultation.status = status;
        
        // Optional: Log the admin who performed the action (if you have user info in req.user)
        // console.log(`Admin ${req.user.email} updated consultation ${id} to ${status}`);

        const updatedConsultation = await consultation.save();
        
        // TODO: Trigger email notification to the client here about the status change.

        res.status(200).json({
            success: true,
            message: `Consultation status updated to ${status}.`,
            data: updatedConsultation
        });

    } catch (error) {
        console.error(`Error updating status for consultation ${id}:`, error);
        res.status(500).json({ message: 'Server Error: Could not update consultation status.', error: error.message });
    }
};

// --------------------------------------------------------------------------

/**
 * @desc Delete a specific consultation record
 * @route DELETE /api/consultations/:id
 * @access Private/Admin
 */
const deleteConsultation = async (req, res) => {
    const { id } = req.params;

    try {
        const consultation = await Consultation.findById(id);

        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found.' });
        }

        // --- NEW BUSINESS LOGIC: Enforce Deletion Policy ---
        const deletableStatuses = ['CANCELLED', 'COMPLETED'];
        
        if (!deletableStatuses.includes(consultation.status)) {
            // Block deletion if the status is PENDING_CONFIRMATION or CONFIRMED
            return res.status(403).json({ 
                message: `Deletion denied. Consultation status is '${consultation.status}'. Records can only be deleted when CANCELLED or COMPLETED.` 
            });
        }
        // --- END NEW BUSINESS LOGIC ---

        // Use findByIdAndDelete
        await Consultation.findByIdAndDelete(id); 

        res.status(200).json({
            success: true,
            message: 'Consultation record successfully deleted.'
        });

    } catch (error) {
        console.error(`Error deleting consultation ${id}:`, error);
        
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Invalid consultation ID format.' });
        }
        res.status(500).json({ message: 'Server Error: Could not delete consultation record.', error: error.message });
    }
};

// --------------------------------------------------------------------------

export { 
    bookConsultation, 
    getAllConsultations, 
    updateConsultationStatus,
    deleteConsultation // <-- New export
};