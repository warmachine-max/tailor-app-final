import MenKurtaScema from "../models/men/MenKurtaScema.js";
import MenSuitSchema from "../models/men/MenSuitSchema.js";
import MenShirtSchema from "../models/men/menShirtSchema.js";

import WomenBlouseSchema from "../models/women/WomenBlouseSchema.js";
import WomenSareeSchema from "../models/women/WomenSareeSchema.js";
import WomenLehengaShema from "../models/women/WomenLehengaSchema.js";
import WomenSalwarSchema from "../models/women/WomenSalwarSchema.js";

import Booking from "../models/Booking.js";
const productSchemas = {
  MenKurta: MenKurtaScema,
  MenSuit: MenSuitSchema,
  MenShirt: MenShirtSchema,
  WomenBlouse: WomenBlouseSchema,
  WomenSaree: WomenSareeSchema,
  WomenLehenga: WomenLehengaShema,
  WomenSalwar: WomenSalwarSchema,
};

// ====================================================================
// Booking Creation (Looks fine)
// ====================================================================
export const createBooking = async (req, res) => {
  console.log("Booking Request Body:", req.body);
  try {
    const { productId, productType, notes,phone } = req.body;

    const Schema = productSchemas[productType];
    if (!Schema) return res.status(400).json({ message: "Invalid product type" });

    const product = await Schema.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const booking = await Booking.create({
      user: req.user._id,
      productType,
      productId,
      productTitle: product.title,
      productImage: product.image?.url,
      name: req.user.name,
      phone: phone,
      email: req.user.email,
      notes,
      status: "pending",
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================================================================
// Fetch Bookings (Looks fine)
// ====================================================================
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================================================================
// Admin Update Booking (FIXED)
// ====================================================================
export const adminUpdateBooking = async (req, res) => {
  try {
    const { status, adminMessage } = req.body;

    // Check if status is provided, but REMOVE the hardcoded validStatuses array check.
    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    // Use findByIdAndUpdate for a single, robust operation
    const updateFields = {
        status: status,
        adminMessage: adminMessage || ""
    };

    const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        updateFields,
        {
            new: true, // Return the updated document
            runValidators: true // CRITICAL: This executes the Mongoose enum validation
        }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // If a validation error occurred, it will be caught in the catch block below.
    
    return res.json({
      message: `Booking updated to ${status}`,
      booking: updatedBooking,
    });
  } catch (err) {
    // If the status is invalid (not in the Mongoose enum list), Mongoose throws a ValidationError.
    if (err.name === 'ValidationError' && err.message.includes('status')) {
        return res.status(400).json({ message: "Invalid status value. Ensure status is one of the allowed enum values." });
    }
    
    return res.status(500).json({ message: err.message });
  }
};

// ====================================================================
// Delete Booking (Looks fine, assuming admin check is in router)
// ====================================================================
export const deleteBooking = async (req, res) => {
  try {
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.deleteOne()
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};