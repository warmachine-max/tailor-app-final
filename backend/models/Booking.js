import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productType: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },

    productTitle: String,
    productImage: String,

    name: String,
    phone: String,
    email: String,
    notes: String,

    // --- UPDATED STATUS ENUM TO INCLUDE RETURN WORKFLOW ---
    status: {
      type: String,
      enum: [
        "pending",     // customer requested
        "confirmed",   // admin accepted
        "rejected",    // admin rejected
        "completed",   // stitching finished
        "delivered",   // customer received
        
        // --- NEW RETURN STATUSES ADDED HERE ---
        "return_pending",   // customer requested return (replaces delivered)
        "return_approved",  // admin accepted return
        "return_rejected",  // admin rejected return
        "return_completed"  // refund/return process finished
      ],
      default: "pending",
    },

    adminMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);