/**
 * Get and parse JSON from localStorage.
 * @param {string} key - The key in localStorage.
 * @returns {*|null} The parsed JSON object, or null if key not found or parsing fails.
 */
export function getLocalStorageJSON(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    catch (error) {
        console.error(`Error getting JSON from localStorage for key "${key}":`, error);
        return null;
    }
}
