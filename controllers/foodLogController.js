import FoodLog from "../models/FoodLog.js";

// Controller to get logs by date
export const getFoodLogsByDate = async (req, res) => {
  try {
    const { date } = req.query; // expected format: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: "Date is required in YYYY-MM-DD format" });
    }

    // Create a range for the full day: 00:00 to 23:59
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // Find logs where 'date' is between start and end
    const logs = await FoodLog.find({
      date: {
        $gte: start,
        $lte: end,
      },
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs by date:", error);
    res.status(500).json({ message: "Server error" });
  }
};
