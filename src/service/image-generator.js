// display-service.js
import { createIntegerGenerator } from './seed-helper.js';

// --- Configuration ---
const aspectRatios = {
  '16:9': [1920, 1080],
  '9:16': [1080, 1920],
  '4:5': [1080, 1350],
  '1:1': [1080, 1080],
  '3:2': [1620, 1080],
  '4:3': [1440, 1080]
};

const aspectRatiosIndex = {
  0: '16:9',
  1: '9:16',
  2: '4:5',
  3: '1:1',
  4: '3:2',
  5: '4:3'
};

// Creator commentary : honestly, i just use gemini and ask it what is the most common aspect ratio are and it gave me this.
// 16:9 and 9:16 are pretty self explanatory as most of phone or computer use this aspect ratios.
// 4:5 is from instagram feed vertical format 
// 3:2 and 4:3 are the traditional photography ratios
// i use 1080 as the smaller number to make it consistent for all aspect ratio, as why i choose this is because i have 1920:1080 monitor xd.
// well i used to think that i just let the pseudo rng to calculate the width and height of the picture, but it will be too random to my liking.
// honestly, for this part i need your feedback, feel free to contact me if you have compiling argument on how to decide the weight and height of the picture.

// --- Client-Side Image Generation with Canvas API ---
/**
 * Generates a random image based on a seed using HTML Canvas API and returns it as a Base64 data URL.
 * This runs entirely client-side.
 * @param {string | number} [seed=0] - The seed to use for generation. Defaults to 0 if not provided.
 * @returns {Promise<string|null>} A Promise that resolves with the image Base64 data URL, or null if an error occurs.
 */
export async function generateImage(seed = 0) {
    try {
        console.log(`\n--- Generating client-side image with seed: ${seed} ---`);
        const getSeededInt = createIntegerGenerator(seed);

        // 1. Determine image dimensions randomly based on the seed
        const randomRatioName = aspectRatiosIndex[getSeededInt(0, 5)];
        const [width, height] = aspectRatios[randomRatioName];
        console.log(`Selected Aspect Ratio: ${randomRatioName} -> [${width}x${height}]`);

        // 2. Create an off-screen canvas element
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error("Could not get 2D rendering context from canvas.");
        }

        // 3. Create ImageData and fill with random pixel colors
        console.log('Generating pixel data...');
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data; // This is a Uint8ClampedArray

        for (let i = 0; i < data.length; i += 4) {
            data[i]     = getSeededInt(0, 255); // Red
            data[i + 1] = getSeededInt(0, 255); // Green
            data[i + 2] = getSeededInt(0, 255); // Blue
            data[i + 3] = 255;                  // Alpha (fully opaque)
        }

        // 4. Put the pixel data onto the canvas
        ctx.putImageData(imageData, 0, 0);

        // 5. Export canvas content as a PNG Data URL
        console.log('Encoding image data to PNG Data URL...');
        const imageUrl = canvas.toDataURL('image/png'); // Default is image/png
        
        console.log('Image Data URL created successfully.');
        return imageUrl;

    } catch (error) {
        console.error("An error occurred during client-side image generation:", error);
        return null; // Return null on error
    }
}