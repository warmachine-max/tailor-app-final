import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';   // <-- ADD THIS

import authRoutes from './routes/authRoutes.js';
import menRoutes from './routes/menRoutes.js';
import womenRoutes from './routes/womenRoutes.js';

import bookinRoutes from './routes/bookingRoutes.js';

import consultationRoutes from './routes/consultationRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { v2 as cloudinary } from 'cloudinary';
import './config/cloudinary.js';

dotenv.config();

const app = express();

// ⭐ Enable CORS here
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// DB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/men', menRoutes);
app.use('/api/women', womenRoutes);

app.use('/api/booking', bookinRoutes);

app.use('/api/consultations', consultationRoutes);


app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// app.listen(3000);   <-- example of commenting a line

