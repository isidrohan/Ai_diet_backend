import express from "express";
const router = express.Router();
import FoodLog from "../models/FoodLog.js";

// GET /nutrition/by-date?userId=123&date=YYYY-MM-DD
router.get("/by-date", async (req, res) => {
  const { userId, date } = req.query;

  if (!userId || !date) {
    return res.status(400).json({ message: "userId and date are required" });
  }

  try {
    const logs = await FoodLog.find({
      user: userId,
      date: new Date(date),
    });

    if (!logs.length) {
      return res.status(404).json({ message: "No nutrition data found for this date" });
    }

    // Aggregate totals
    const totals = logs.reduce(
      (acc, log) => {
        acc.calories += log.calories;
        acc.protein += log.protein;
        acc.carbs += log.carbs;
        acc.fat += log.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    res.json(totals);
  } catch (err) {
    console.error("Error fetching nutrition:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
