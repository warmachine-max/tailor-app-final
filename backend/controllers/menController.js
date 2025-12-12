import MenKurtaScema from "../models/men/MenKurtaScema.js";
import MenSuitSchema from "../models/men/MenSuitSchema.js";
import MenShirtSchema from "../models/men/menShirtSchema.js";

import cloudinary from "../config/cloudinary.js";

// controllers/menController.js


export const createKurta = async (req, res) => {
  try {
    const { price, notes } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newKurta = await MenKurtaScema.create({
      price,
      notes,
      image: {
        public_id: req.file.filename,   // CLOUDINARY PUBLIC ID
        url: req.file.path,             // CLOUDINARY URL
      },
    });

    res.status(201).json({
      success: true,
      kurta: newKurta,
    });

  } catch (error) {
    console.error("Kurta Creation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};




export const deleteKurta = async (req, res) => {
  try {
    const { id } = req.params;

    // Find kurta by id
    const kurta = await MenKurtaScema.findById(id);
    if (!kurta) {
      return res.status(404).json({ message: "Kurta not found" });
    }

    // Delete image from Cloudinary if exists
    if (kurta.image?.public_id) {
      await cloudinary.uploader.destroy(kurta.image.public_id);
    }

    // Delete from MongoDB
    await MenKurtaScema.findByIdAndDelete(id);

    res.status(200).json({ message: "Kurta deleted successfully" });

  } catch (error) {
    console.error("Kurta Deletion Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const fetchKurtas = async (req, res) => {
  try {
    const kurtas = await MenKurtaScema.find();
    res.status(200).json({ success: true, kurtas });
  } catch (error) {
    console.error("Fetch Kurtas Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

////  Shirt

export const createShirt = async (req, res) => {
  try {
    const { price, notes } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Image is required" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "churps/shirt",
    });

    const newShirt = await MenShirtSchema.create({
      price,
      notes,
      image: { public_id: result.public_id, url: result.secure_url },
    });

    res.status(201).json({ success: true, shirt: newShirt });
  } catch (error) {
    console.error("Shirt Creation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteShirt = async (req, res) => {
  try {
    const { id } = req.params;
    const shirt = await MenShirtSchema.findById(id);
    if (!shirt) return res.status(404).json({ message: "Shirt not found" });

    if (shirt.image?.public_id)
      await cloudinary.uploader.destroy(shirt.image.public_id);

    await MenShirtSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Shirt deleted successfully" });
  } catch (error) {
    console.error("Shirt Deletion Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const fetchShirts = async (req, res) => {
  try {
    const shirts = await MenShirtSchema.find();
    res.status(200).json({ success: true, shirts });
  } catch (error) {
    console.error("Fetch Shirts Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------- SUIT ---------------------- */
export const createSuit = async (req, res) => {
 
  try {
    const { price, notes } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Image is required" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "churps/suit",
    });

    const newSuit = await MenSuitSchema.create({
      price,
      notes,
      image: { public_id: result.public_id, url: result.secure_url },
    });

    res.status(201).json({ success: true, suit: newSuit });
  } catch (error) {
    console.error("Suit Creation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteSuit = async (req, res) => {
  try {
    const { id } = req.params;
    const suit = await MenSuitSchema.findById(id);
    if (!suit) return res.status(404).json({ message: "Suit not found" });

    if (suit.image?.public_id)
      await cloudinary.uploader.destroy(suit.image.public_id);

    await MenSuitSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Suit deleted successfully" });
  } catch (error) {
    console.error("Suit Deletion Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const fetchSuits = async (req, res) => {
 
  try {
    const suits = await MenSuitSchema.find();
    res.status(200).json({ success: true, suits });
  } catch (error) {
    console.error("Fetch Suits Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};