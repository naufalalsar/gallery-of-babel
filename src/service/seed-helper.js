import seedrandom from 'seedrandom';

/**
 * Creates a function that generates a repeatable sequence of random integers.
 * @param {string | number} seed - The seed for the random number generator.
 * @returns {function(number, number): number} A function that takes a min and max, and returns a random integer.
 */
export function createIntegerGenerator(seed) {
  const rng = seedrandom(seed);
  return function(min, max) {
    const randomFloat = rng(); 
    return Math.floor(randomFloat * (max - min + 1)) + min;
  };
}

/**
 * Converts a decimal number into a string. If the number is larger than 65535,
 * it is encoded into multiple characters.
 * @param {number} decimal - The decimal number to convert.
 * @returns {string} The resulting string.
 */
export function getStringSeed(decimal) {
  const BASE_SIZE = 65536; // The number of unique characters (0 to 65535)
  const MAX_CODE = BASE_SIZE - 1; // Represents one "full set"
  const codes = [];

  if (decimal < 0) {
    return ''; // Or handle negative numbers as you see fit
  }

  if (decimal === 0) {
    return String.fromCodePoint(0);
  }

  const numFullSets = Math.floor(decimal / BASE_SIZE);
  const remainder = decimal % BASE_SIZE;

  // Add a "full set" character for each multiple of BASE_SIZE
  for (let i = 0; i < numFullSets; i++) {
    codes.push(MAX_CODE);
  }

  // Add the final remainder
  codes.push(remainder);

  // Convert all the generated codes into a single string
  return String.fromCodePoint(...codes);
}

// Creator commentary : the getStringSeed method are there to cover all possible string given an integer number.
// i do this because if the seed itself doesn't contain all possible combination, is it really going to cover all possible RGB values and alphabet values?
// for example, let's say i just map a number directly to a seed, with the number being 26734142, the seed will be the string "26734142" not the number 26734142.
// furthering this point, if i decided to just use this method, with the seed 26734142 and the next seed will be 26734143 for integer number.
// but the problem is, since seedrandom convert the number to string, you can't say that the next seed of 26734142 will be 26734143.
// hence why, i first convert it first to UTF-16 codes so that all possible UTF-16 combination of seed will be covered given a number.
