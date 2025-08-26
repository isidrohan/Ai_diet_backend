// models/Goal.js
import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gender: String,
  age: Number,
  currentWeight: Number,
  targetWeight: Number,
  heightFeet: Number,
  activityLevel: String,
  goalType: String, // gain / lose / maintain
  weightGainRate: String, // 500g / 1kg per week

  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
});

export default mongoose.model("Goal", goalSchema);
