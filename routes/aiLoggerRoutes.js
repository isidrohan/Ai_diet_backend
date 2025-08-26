import express from "express";
import { analyzeAndLogFood } from "../controllers/aiLoggerController.js";

const router = express.Router();

router.post("/analyze", analyzeAndLogFood);

export default router;
