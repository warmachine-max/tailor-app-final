import mongoose from 'mongoose'; // Use import instead of require

const Schema = mongoose.Schema;

const ReturnRequestSchema = new Schema({
    // --- Link to Original Transaction ---
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: 'Booking', 
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // --- Return Specific Details ---
    returnReason: {
        type: String,
        required: true,
        trim: true,
    },
    
    status: {
        type: String,
        enum: [
            'return_pending',
            'return_approved',
            'return_rejected',
            'return_completed'
        ],
        default: 'return_pending',
    },

    requestDate: {
        type: Date,
        default: Date.now,
    },
    
    // --- Admin/Processing Details ---
    adminNotes: {
        type: String,
        default: '',
    },
    refundAmount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Use export default for the model
const ReturnRequest = mongoose.model('ReturnRequest', ReturnRequestSchema);
export default ReturnRequest;