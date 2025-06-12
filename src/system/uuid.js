import * as _crypto from "node:crypto";

/**
 * Generates a UUID (v4).
 * If forceLetterStart is true, the function will ensure the UUID starts with a letter
 * which is useful for HTML/CSS compatibility where IDs should start with a letter.
 * 
 * @param {boolean} [forceLetterStart=true] - Whether to ensure the UUID starts with a letter
 * @returns {string} A new UUID.
 */
export function uuid(forceLetterStart = true) {
    let result = _crypto.randomUUID();
    
    // If we need to ensure the UUID starts with a letter and it currently starts with a number
    if (forceLetterStart && /^[0-9]/.test(result)) {
        // Replace the first character with a letter (a-f)
        const letters = 'abcdef';
        const randomIndex = Math.floor(Math.random() * letters.length);
        result = letters[randomIndex] + result.substring(1);
    }
    
    return result;
}
