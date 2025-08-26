

import dotenv from "dotenv";
dotenv.config();

import FoodLog from "../models/FoodLog.js";
// import cohere from "cohere-ai";

console.log("COHERE_API_KEY from env:", process.env.COHERE_API_KEY);

import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const analyzeAndLogFood = async (req, res) => {
  const { userId, prompt } = req.body;

  try {
    const cohereRes = await cohere.generate({
      model: "command",
      prompt: `Analyze the following meal and give calories, protein, carbs, and fat:\n\n"${prompt}"\n\nReturn JSON format like this:\n{"foodName":"Paneer Tikka", "calories":350, "protein":20, "carbs":15, "fat":25}`,
      max_tokens: 100,
      temperature: 0.5,
    });

    // Debug: print the full Cohere response
    // console.log("Cohere API full response:", JSON.stringify(cohereRes, null, 2));
    if (!cohereRes || !Array.isArray(cohereRes.generations) || !cohereRes.generations[0]) {
      throw new Error("Malformed or empty Cohere API response");
    }
    const responseText = cohereRes.generations[0].text.trim();
    // Debug: print the raw AI output
    // console.log("Cohere AI raw output:", responseText);
    // Extract JSON substring robustly
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
    //   console.error("No JSON found in AI response:", responseText);
      throw new Error("No JSON found in AI response");
    }

    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
    const nutritionData = JSON.parse(jsonString);

    // Helper to extract number from string (e.g. "31.8g" -> 31.8)
    const parseNumber = (val) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const num = parseFloat(val.replace(/[^\d.\-]/g, ''));
        return isNaN(num) ? undefined : num;
      }
      return undefined;
    };

    const foodLog = new FoodLog({
      user: userId,
      foodName: nutritionData.foodName,
      calories: parseNumber(nutritionData.calories),
      protein: parseNumber(nutritionData.protein),
      carbs: parseNumber(nutritionData.carbs),
      fat: parseNumber(nutritionData.fat),
      aiGenerated: true,
    });

    await foodLog.save();
    res.status(201).json({ message: "Food log saved", foodLog });
  } catch (error) {
    console.error("AI logging error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to analyze and log food", details: error.message });
  }
};
