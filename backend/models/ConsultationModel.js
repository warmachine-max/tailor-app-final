// /models/ConsultationModel.js

import mongoose from 'mongoose'; // Use import

const Schema = mongoose.Schema;

const ConsultationSchema = new Schema({
    // --- 1. Contact & Scheduling Details (Step 1) ---
    client: {
        name: { 
            type: String, 
            required: [true, 'Client name is required.'], 
            trim: true 
        },
        email: { 
            type: String, 
            required: [true, 'Client email is required.'], 
            lowercase: true 
        },
        phone: { 
            type: String, 
            required: [true, 'Client phone number is required.'],
            trim: true
        },
    },

    appointment: {
        serviceType: { 
            type: String, 
            required: [true, 'Service type is required.'],
            enum: {
                values: ['Remote Call (Phone/Video)', 'Doorstep Visit (Tailor comes to you)', 'In-Studio Appointment'],
                message: 'Invalid service type.'
            },
            default: 'Remote Call (Phone/Video)'
        },
        preferredDate: { 
            type: Date, 
            required: [true, 'Preferred date is required.'],
        },
        preferredTime: { 
            type: String, 
            required: [true, 'Preferred time is required.']
        }, 
        address: { // Conditionally required by the controller based on serviceType
            type: String, 
            default: null,
            trim: true
        },
    },
    
    // --- 2. Style Profile Details (Step 2) ---
    profile: {
        occasion: { 
            type: String, 
            required: [true, 'Primary occasion is required.']
        },
        styleArchetype: { 
            type: String, 
            required: [true, 'Style archetype is required.']
        },
        bodyShape: { 
            type: String, 
            default: null 
        },
        comfortPreference: { 
            type: String, 
            default: null 
        },
        inspirationLink: { 
            type: String, 
            default: null 
        },
        notes: { 
            type: String, 
            default: null, 
            maxlength: [500, 'Notes cannot exceed 500 characters.'] 
        },
    },

    // --- 3. Operational/Status Fields ---
    status: {
        type: String,
        required: true,
        enum: {
            values: ['PENDING_CONFIRMATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
            message: 'Invalid status value.'
        },
        default: 'PENDING_CONFIRMATION'
    },
    
    tailorAssigned: {
        type: Schema.Types.ObjectId, 
        ref: 'User', // Assuming a 'User' model includes your tailors
        default: null
    },

}, {
    // Enable Mongoose timestamps for `createdAt` and `updatedAt`
    timestamps: true 
});


// Use export default for the model
const Consultation = mongoose.model('Consultation', ConsultationSchema);
export default Consultation;