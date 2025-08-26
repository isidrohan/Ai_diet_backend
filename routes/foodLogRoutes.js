import express from "express";
import { getFoodLogsByDate } from "../controllers/foodLogController.js";

const router = express.Router();

router.get("/date", getFoodLogsByDate);

export default router;
