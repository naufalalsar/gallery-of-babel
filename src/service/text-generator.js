import {createIntegerGenerator} from "./seed-helper.js"

const characterMap = {
    0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h', 8: 'i',
    9: 'j', 10: 'k', 11: 'l', 12: 'm', 13: 'n', 14: 'o', 15: 'p', 16: 'q',
    17: 'r', 18: 's', 19: 't', 20: 'u', 21: 'v', 22: 'w', 23: 'x', 24: 'y',
    25: 'z', 26: ' ', 27: ',', 28: '.'
};

/**
 * Generates a random string of text using a seeded generator.
 * @param {function} getSeededInt - The seeded integer generator function.
 * @param {number} minLength - The minimum length of the text.
 * @param {number} maxLength - The maximum length of the text.
 * @returns {string} The generated random string.
 */
function generateText(getSeededInt, minLength, maxLength) {
    const length = getSeededInt(minLength, maxLength);
    const maxCharIndex = Object.keys(characterMap).length - 1;
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = getSeededInt(0, maxCharIndex);
        result += characterMap[randomIndex];
    }
    return result;
}

// --- Main Service Logic ---

/**
 * Generates details for a piece of artwork based on a seed.
 * @param {string | number} [seed=0] - The seed to use for generation. Defaults to 0 if not provided.
 * @returns {{artistName: string, title: string, description: string}} An object with the generated details.
 */
export function generateArtworkDetails(seed = 0) {
    console.log(`\n--- Generating artwork details with seed: ${seed} ---`);
    const getSeededInt = createIntegerGenerator(seed);

    const artistName = generateText(getSeededInt, 1, 70);
    const title = generateText(getSeededInt, 1, 70);
    const description = generateText(getSeededInt, 1, 600);

    return {
        artistName,
        title,
        description
    };
}

// Creator commentary : for the charather map, i just follow how it works on library of babel but with the modification of using the standard alphabet instead of 23 in the original library of babel.
// i decided that given a picture it should have : artist name, title, description.
// source of my decision above : https://learn.ncartmuseum.org/resources/exhibition-planning-and-label-writing-101-top-tips/ and https://thepracticalartworld.com/2021/06/18/examples-of-artwork-labels/
// for the artist name, i decided to have the max charathers of 70.
// source of my decision above : https://archive.datadictionary.nhs.uk/DD%20Release%20March%202025/data_elements/person_full_name.html
// i guess, for the title i will treat as artist name because it's works kinda like a name?
// as for description, i will set it as 120 words with the charather equivalent of 120 * 5 = 600.
// i got 120 words from : https://learn.ncartmuseum.org/resources/exhibition-planning-and-label-writing-101-top-tips/
// i got 1 words = 5 charathers from various forum on internet saying the same thing, i tried to find a credible source but unable to do so.
// tried to make the same number of combination for the text and the image, the image are too big to contain, for example, 1 aspect ratio are this big = (256)^3^(1920x1080)
