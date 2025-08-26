import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
});

nutritionSchema.index({ user: 1, date: 1 }, { unique: true }); // To prevent duplicates

export default mongoose.model("Nutrition", nutritionSchema);
 