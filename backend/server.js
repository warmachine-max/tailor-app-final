// server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import menRoutes from './routes/menRoutes.js';
import womenRoutes from './routes/womenRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import './config/cloudinary.js'; // Cloudinary config

dotenv.config();

const app = express();

// ⭐ Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',                  // local frontend
  'https://tailor-app-final.vercel.app'     // deployed frontend
];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true); // allow Postman/server requests
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('CORS policy does not allow this origin.'), false);
      }
    },
    credentials: true, // allow cookies/auth headers
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/men', menRoutes);
app.use('/api/women', womenRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/consultations', consultationRoutes);

// Error middlewares
app.use(notFound);
app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is live ✅");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
