// server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import menRoutes from './routes/menRoutes.js';
import womenRoutes from './routes/womenRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';

// Import Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import Configuration
import './config/cloudinary.js'; 

dotenv.config();

const app = express();

// --- CORS Configuration ---
// Get the allowed origin from environment variables
// Use '||' to provide a fallback, though it's best to set the variable on Render.
// For production, this should be 'https://tailor-app-final.vercel.app'
const allowedOrigin = process.env.CLIENT_ORIGIN || 'https://tailor-app-final.vercel.app'; 


app.use(
  cors({
    origin: function(origin, callback) {
      // 1. Allow if no origin is present (e.g., Postman, same-server requests)
      if (!origin) return callback(null, true); 

      // 2. Check if the origin matches the allowed single URL
      if (origin === allowedOrigin) {
        return callback(null, true);
      } 
      
      // 3. Fallback for testing/development (Optional - remove for strict production)
      // Check if the current environment is development and allow localhost:5173
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost:5173')) {
          return callback(null, true);
      }

      // 4. Block all other origins
      return callback(new Error(`CORS policy does not allow this origin: ${origin}`), false);
    },
    credentials: true, // Crucial for sending cookies/JWTs
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
// --- End CORS Configuration ---


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