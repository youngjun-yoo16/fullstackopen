interface ExerciseValues {
  target: number;
  dailyExerciseHours: Array<number>;
}

interface AverageValues {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const parseExerciseArguments = (
  target: number,
  dailyExerciseHours: Array<number>
): ExerciseValues => {
  if (!isNaN(target) && !dailyExerciseHours.some(isNaN)) {
    return {
      target: target,
      dailyExerciseHours: dailyExerciseHours,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateExercise = (
  target: number,
  dailyExerciseHours: Array<number>
): AverageValues => {
  const periodLength = dailyExerciseHours.length;
  const trainingDays = dailyExerciseHours.filter((day) => day !== 0).length;
  const average = dailyExerciseHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target ? true : false;

  let rating;
  let ratingDescription;

  if (average < target) {
    rating = 1;
    ratingDescription = "not too bad but could be better";
  } else if (average === target) {
    rating = 2;
    ratingDescription = "good";
  } else {
    rating = 3;
    ratingDescription = "very good";
  }

  return {
    periodLength: periodLength,
    trainingDays: trainingDays,
    success: success,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: average,
  };
};

/* try {
  const { target, dailyExerciseHours } = parseExerciseArguments(process.argv);
  console.log(calculateExercise(target, dailyExerciseHours));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += "Error: " + error.message;
  }
  console.log(errorMessage);
} */
