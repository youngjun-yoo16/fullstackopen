interface DivideValues {
	value1: number;
	value2: number;
}

const parseArguments = (args: string[]): DivideValues => {
  	if (args.length < 4) throw new Error('Not enough arguments');
  	if (args.length > 4) throw new Error('Too many arguments');
	
	if(!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
		return {
			value1: Number(args[2]),
			value2: Number(args[3])
		}
	} else {
		throw new Error('Provided values were not numbers!');
	}
}

const calculateBmi = (height: number, weight: number) => {
	let category:string;
	const bmi:number = weight / Math.pow((height / 100), 2);
	
	if (bmi < 16.0) {
		category = "Underweight (Severe thinness)";
	} else if (bmi >= 16.0 && bmi < 17.0) {
		category = "Underweight (Moderate thinness)";
	} else if (bmi >= 17.0 && bmi < 18.5) {
		category = "Underweight (Mild thinness)";
	} else if (bmi >= 18.5 && bmi < 25.0) {
		category = "Normal (healthy weight)";
	} else if (bmi >= 25.0 && bmi < 30.0) {
		category = "Overweight (Pre-obese)";
	} else if (bmi >= 30.0 && bmi < 35.0) {
		category = "Overweight (Class I)";
	} else if (bmi >= 35.0 && bmi < 40.0) {
		category = "Overweight (Class II)";
	} else {
		category = "Overweight (Class III)";
	}
	
	console.log(category);
}

try {
	const { value1, value2 } = parseArguments(process.argv);
  	calculateBmi(value1, value2);
} catch (error: unknown) {
	let errorMessage = 'Something bad happened.';
  	if (error instanceof Error) {
		errorMessage += ' Error: ' + error.message;
  	}
  	console.log(errorMessage);
}