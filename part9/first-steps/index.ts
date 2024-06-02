import express from "express";
import qs from "qs";

import { calculateBmi } from "./bmiCalculator";

const app = express();

app.set("query parser", (str: string) => qs.parse(str));

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    return res.status(400).json({ error: "Height and weight are required" });
  }

  const heightInCm = Number(height);
  const weightInKg = Number(weight);

  if (isNaN(heightInCm) || isNaN(weightInKg)) {
    return res.status(400).json({ error: "Height and weight must be numbers" });
  }

  const bmi = calculateBmi(heightInCm, weightInKg);

  return res.json({
    weight: weightInKg,
    height: heightInCm,
    bmi: bmi,
  });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
