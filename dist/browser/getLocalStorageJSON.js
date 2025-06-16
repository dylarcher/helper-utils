/**
 * Retrieves an item from localStorage and parses it as JSON.
 * - If the key is not found in localStorage, this function returns `null`.
 * - If the item is found, it attempts to parse it as JSON.
 *   - If the stored value is the literal string 'null', it will be parsed to `null`.
 * - Errors during localStorage access (e.g., `localStorage` not available) or
 *   JSON parsing (e.g., malformed JSON) will be re-thrown.
 *
 * @param {string} key - The key of the item to retrieve from localStorage.
 * @returns {any|null} The parsed JSON value if the key exists and the content is valid JSON.
 *   Returns `null` if the key is not found in localStorage.
 * @throws {Error} Throws an error if `localStorage` is not available,
 *   or if `JSON.parse` fails due to malformed JSON. This could be a `SyntaxError`
 *   or other errors related to `localStorage` access.
 *
 * @example
 * // Assuming localStorage contains:
 * // 'user': '{"name":"John", "age":30}'
 * // 'settings': '{"theme":"dark"}'
 * // 'empty': 'null'
 * // 'malformed': '[{invalidJSON]'
 *
 * try {
 *   const user = getLocalStorageJSON('user'); // { name: "John", age: 30 }
 *   console.info(user);
 *
 *   const settings = getLocalStorageJSON('settings'); // { theme: "dark" }
 *   console.info(settings);
 *
 *   const emptyValue = getLocalStorageJSON('empty'); // null (from string 'null')
 *   console.info(emptyValue);
 *
 *   const nonExistent = getLocalStorageJSON('nonExistentKey'); // null (key not found)
 *   console.info(nonExistent);
 *
 *   // const malformed = getLocalStorageJSON('malformed'); // This would throw a SyntaxError
 * } catch (error) {
 *   console.error('Error retrieving from localStorage:', error.name, error.message);
 *   // Example: "SyntaxError: Unexpected token i in JSON at position 2" for malformed JSON
 *   // Example: "Error: localStorage is not available in this environment."
 * }
 */
export function getLocalStorageJSON(key) {
    // Ensure localStorage is available before trying to use it.
    if (typeof localStorage === 'undefined' || localStorage === null) {
        throw new Error('localStorage is not available in this environment.');
    }
    const item = localStorage.getItem(key);
    // If the item does not exist in localStorage, getItem returns null.
    // This is a valid case, distinct from stored JSON 'null' or parsing errors.
    if (item === null) {
        return null;
    }
    // Attempt to parse. If item is 'null' (string), JSON.parse will return null.
    // If item is malformed JSON, JSON.parse will throw a SyntaxError.
    return JSON.parse(item);
}
