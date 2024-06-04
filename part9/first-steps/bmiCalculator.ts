interface BmiValues {
  heightInCm: number;
  weightInKg: number;
}

export const parseBmiArguments = (
  height: number,
  weight: number
): BmiValues => {
  if (!isNaN(height) && !isNaN(weight)) {
    return {
      heightInCm: height,
      weightInKg: weight,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateBmi = (
  heightInCm: number,
  weightInKg: number
): string => {
  const bmi = (weightInKg / (heightInCm * heightInCm)) * 10000;

  if (bmi < 16) {
    return "Underweight (Severe thinness)";
  } else if (bmi >= 16 && bmi < 17) {
    return "Underweight (Moderate thinness)";
  } else if (bmi >= 17 && bmi < 18.5) {
    return "Underweight (Mild thinness)";
  } else if (bmi >= 18.5 && bmi < 25) {
    return "Normal (healthy weight)";
  } else if (bmi >= 25 && bmi < 30) {
    return "Overweight (Pre-obese)";
  } else if (bmi >= 30 && bmi < 35) {
    return "Obese (Class I)";
  } else if (bmi >= 35 && bmi < 40) {
    return "Obese (Class II)";
  } else {
    return "Obese (Class III)";
  }
};

/* try {
  const { heightInCm, weightInKg } = parseBmiArguments(process.argv);
  console.log(calculateBmi(heightInCm, weightInKg));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
} */
