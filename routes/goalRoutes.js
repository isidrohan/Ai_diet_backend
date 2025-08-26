// routes/goalRoutes.js
import express from "express";
import Goal from "../models/Goal.js";
const router = express.Router();

router.post("/calculate", async (req, res) => {
  try {
    const {
      userId, // 🧠 Coming from frontend now!
      gender,
      age,
      currentWeight,
      targetWeight,
      heightFeet,
      activityLevel,
      goalType,
      weightGainRate,
    } = req.body;

    // Calculate BMR, TDEE, and macros
    const heightCm = heightFeet * 30.48;
    const weight = currentWeight;

    let bmr =
      gender === "male"
        ? 10 * weight + 6.25 * heightCm - 5 * age + 5
        : 10 * weight + 6.25 * heightCm - 5 * age - 161;

    const activityFactor =
      activityLevel === "light" ? 1.375 : activityLevel === "moderate" ? 1.55 : 1.725;

    let tdee = bmr * activityFactor;

    if (goalType === "gain") {
      tdee += weightGainRate === "1kg" ? 1000 : 500;
    } else if (goalType === "lose") {
      tdee -= 500;
    }

    // Macros
    const protein = Math.round(currentWeight * 2.2);
    const fat = Math.round((0.25 * tdee) / 9);
    const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);

    const goal = await Goal.create({
      user: userId,
      gender,
      age,
      currentWeight,
      targetWeight,
      heightFeet,
      activityLevel,
      goalType,
      weightGainRate,
      calories: Math.round(tdee),
      protein,
      carbs,
      fat,
    });

    res.status(201).json(goal);
  } catch (err) {
    console.error("Goal calc error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
// Get latest goal for a user
router.get("/user", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    // Find the latest goal for the user
    const goal = await Goal.findOne({ user: userId }).sort({ createdAt: -1 });
    if (!goal) {
      return res.status(404).json({ error: "No nutrition goal found" });
    }
    res.json(goal);
  } catch (err) {
    console.error("Fetch goal error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
