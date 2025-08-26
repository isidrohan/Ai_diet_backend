// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import nutritionRoutes from "./routes/nutrition.js";
import aiLoggerRoutes from "./routes/aiLoggerRoutes.js";
import foodLogRoutes from "./routes/foodLogRoutes.js";



dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.CLIENT_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/goal", goalRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/ai", aiLoggerRoutes);
app.use('/api/foodlogs', foodLogRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
