import WomenBlouseSchema from "../models/women/WomenBlouseSchema.js";
import WomenSareeSchema from "../models/women/WomenSareeSchema.js";
import WomenLehengaShema from "../models/women/WomenLehengaSchema.js";
import WomenSalwarSchema from "../models/women/WomenSalwarSchema.js";
import cloudinary from "../config/cloudinary.js";

/* ---------------------- BLOUSE ---------------------- */
export const createBlouse = async (req, res) => {
  try {
    const { price, notes } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Image is required" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "churps/blouse",
    });

    const newBlouse = await WomenBlouseSchema.create({
      price,
      notes,
      image: { public_id: result.public_id, url: result.secure_url },
    });

    res.status(201).json({ success: true, blouse: newBlouse });
  } catch (error) {
    console.error("Blouse Creation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteBlouse = async (req, res) => {
  try {
    const { id } = req.params;
    const blouse = await WomenBlouseSchema.findById(id);
    if (!blouse) return res.status(404).json({ message: "Blouse not found" });

    if (blouse.image?.public_id)
      await cloudinary.uploader.destroy(blouse.image.public_id);

    await WomenBlouseSchema.findByIdAndDelete(id);

    res.status(200).json({ message: "Blouse deleted successfully" });
  } catch (error) {
    console.error("Blouse Deletion Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const fetchBlouses = async (req, res) => {
  try {
    const blouses = await WomenBlouseSchema.find();
    res.status(200).json({ success: true, blouses });
  } catch (error) {
    console.error("Fetch Blouses Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------- SAREE ---------------------- */
export const createSaree = async (req, res) => {
  try {
    const { price, notes } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Image is required" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "churps/saree",
    });

    const newSaree = await WomenSareeSchema.create({
      price,
      notes,
      image: { public_id: result.public_id, url: result.secure_url },
    });

    res.status(201).json({ success: true, saree: newSaree });
  } catch (error) {
    console.error("Saree Creation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteSaree = async (req, res) => {
  try {
    const { id } = req.params;
    const saree = await WomenSareeSchema.findById(id);
    if (!saree) return res.status(404).json({ message: "Saree not found" });

    if (saree.image?.public_id)
      await cloudinary.uploader.destroy(saree.image.public_id);

    await WomenSareeSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Saree deleted successfully" });
  } catch (error) {
    console.error("Saree Deletion Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const fetchSarees = async (req, res) => {
  try {
    const sarees = await WomenSareeSchema.find();
    res.status(200).json({ success: true, sarees });
  } catch (error) {
    console.error("Fetch Sarees Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------- LEHENGA ---------------------- */
export const createLehenga = async (req, res) => {
  try {
    const { price, notes } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Image is required" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "churps/lehenga",
    });

    const newLehenga = await WomenLehengaShema.create({
      price,
      notes,
      image: { public_id: result.public_id, url: result.secure_url },
    });

    res.status(201).json({ success: true, lehenga: newLehenga });
  } catch (error) {
    console.error("Lehenga Creation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteLehenga = async (req, res) => {
  try {
    const { id } = req.params;
    const lehenga = await WomenLehengaShema.findById(id);
    if (!lehenga) return res.status(404).json({ message: "Lehenga not found" });

    if (lehenga.image?.public_id)
      await cloudinary.uploader.destroy(lehenga.image.public_id);

    await WomenLehengaShema.findByIdAndDelete(id);
    res.status(200).json({ message: "Lehenga deleted successfully" });
  } catch (error) {
    console.error("Lehenga Deletion Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const fetchLehengas = async (req, res) => {
  try {
    const lehengas = await WomenLehengaShema.find();
    res.status(200).json({ success: true, lehengas });
  } catch (error) {
    console.error("Fetch Lehengas Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------- SALWAR ---------------------- */
export const createSalwar = async (req, res) => {
  try {
    const { price, notes } = req.body;
    if (!req.file)
      return res.status(400).json({ error: "Image is required" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "churps/salwar",
    });

    const newSalwar = await WomenSalwarSchema.create({
      price,
      notes,
      image: { public_id: result.public_id, url: result.secure_url },
    });

    res.status(201).json({ success: true, salwar: newSalwar });
  } catch (error) {
    console.error("Salwar Creation Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteSalwar = async (req, res) => {
  try {
    const { id } = req.params;
    const salwar = await WomenSalwarSchema.findById(id);
    if (!salwar) return res.status(404).json({ message: "Salwar not found" });

    if (salwar.image?.public_id)
      await cloudinary.uploader.destroy(salwar.image.public_id);

    await WomenSalwarSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Salwar deleted successfully" });
  } catch (error) {
    console.error("Salwar Deletion Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const fetchSalwars = async (req, res) => {
  try {
    const salwars = await WomenSalwarSchema.find();
    res.status(200).json({ success: true, salwars });
  } catch (error) {
    console.error("Fetch Salwars Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


