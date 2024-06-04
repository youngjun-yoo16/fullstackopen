import express from "express";
import qs from "qs";

import { parseBmiArguments, calculateBmi } from "./bmiCalculator";
import {
  parseExerciseArguments,
  calculateExercise,
} from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.set("query parser", (str: string) => qs.parse(str));

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { height, weight } = req.query;

  if (!height || !weight) {
    return res.status(400).send({ error: "Height and weight are required" });
  }

  try {
    const { heightInCm, weightInKg } = parseBmiArguments(
      Number(height),
      Number(weight)
    );

    if (isNaN(heightInCm) || isNaN(weightInKg)) {
      return res
        .status(400)
        .send({ error: "Height and weight must be numbers" });
    }

    const bmi = calculateBmi(heightInCm, weightInKg);

    return res.send({
      weight: weightInKg,
      height: heightInCm,
      bmi: bmi,
    });
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    return res.status(400).send(errorMessage);
  }
});

app.post("/exercises", (req, res) => {
  const { dailyExercises, dailyTarget } = req.body;
  if (!dailyExercises || !dailyTarget) {
    return res.status(400).send({ error: "parameters missing" });
  }

  try {
    const { target, dailyExerciseHours } = parseExerciseArguments(
      dailyTarget,
      dailyExercises
    );
    return res.send(calculateExercise(target, dailyExerciseHours));
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    return res.status(400).send(errorMessage);
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
