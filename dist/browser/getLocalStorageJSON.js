/**
 * Retrieves an item from the browser's `localStorage` by its key and parses it as JSON.
 *
 * This function handles several scenarios:
 * - If `localStorage` is not available in the current environment (e.g., Node.js, or if
 *   disabled by browser settings), it throws an `Error`.
 * - If the specified `key` is not found in `localStorage`, the function returns `null`.
 * - If the key is found, it attempts to parse the stored string value using `JSON.parse()`.
 *   - If the stored string is a valid JSON representation of `null` (i.e., the string `"null"`),
 *     it will be correctly parsed to the JavaScript `null` value.
 *   - If the stored string is any other valid JSON, it will be parsed into the corresponding
 *     JavaScript object or primitive.
 * - If `JSON.parse()` fails due to malformed JSON (e.g., the string is not valid JSON syntax),
 *   it will throw a `SyntaxError`. This error is not caught by this function and will propagate
 *   to the caller, who should handle it (e.g., with a try-catch block).
 *
 * @param {string} key - The key of the item to retrieve from `localStorage`.
 * @returns {any | null} The parsed JavaScript value from the JSON string if the key exists
 *                       and the content is valid JSON. Returns `null` if the key is not found
 *                       in `localStorage`.
 * @throws {Error} Throws an `Error` if `localStorage` is not available.
 * @throws {SyntaxError} Throws a `SyntaxError` if the retrieved item's string value
 *                       is not valid JSON (and thus cannot be parsed by `JSON.parse`).
 *
 * @example
 * // Setup: Assume the following items are in localStorage:
 * // localStorage.setItem('userProfile', JSON.stringify({ name: "Alice", preferences: { theme: "dark" } }));
 * // localStorage.setItem('sessionData', JSON.stringify(null)); // Stored as the string "null"
 * // localStorage.setItem('featureFlags', JSON.stringify([1, 2, "beta"]));
 * // localStorage.setItem('malformedData', "{ name: 'Bob', age: 40 "); // Missing closing brace
 *
 * // Example 1: Retrieving a valid JSON object
 * try {
 *   const user = getLocalStorageJSON('userProfile');
 *   // user will be: { name: "Alice", preferences: { theme: "dark" } }
 *   console.log(user?.name); // Output: "Alice"
 * } catch (e) {
 *   console.error(e);
 * }
 *
 * // Example 2: Retrieving a stored JSON null value
 * try {
 *   const session = getLocalStorageJSON('sessionData');
 *   // session will be: null (the JavaScript null value)
 *   console.log(session); // Output: null
 * } catch (e) {
 *   console.error(e);
 * }
 *
 * // Example 3: Key not found
 * try {
 *   const nonExistent = getLocalStorageJSON('nonExistentKey');
 *   // nonExistent will be: null
 *   console.log(nonExistent); // Output: null
 * } catch (e) {
 *   console.error(e);
 * }
 *
 * // Example 4: Retrieving malformed JSON (will throw SyntaxError)
 * try {
 *   const malformed = getLocalStorageJSON('malformedData');
 *   // This line will not be reached.
 * } catch (error) {
 *   // error will be a SyntaxError
 *   console.error('Error parsing malformedData:', error.name, error.message);
 *   // Example output: "Error parsing malformedData: SyntaxError Unexpected end of JSON input" (or similar)
 * }
 *
 * // Example 5: localStorage not available (e.g., in a Node.js test environment without DOM emulation)
 * // (To test this, you might temporarily undefine localStorage or run in a different context)
 * // try {
 * //   const result = getLocalStorageJSON('anyKey');
 * // } catch (error) {
 * //   console.error(error.message); // Output: "localStorage is not available in this environment."
 * // }
 */
export function getLocalStorageJSON(key) {
    // Step 1: Check for localStorage availability.
    // `typeof localStorage` ensures `localStorage` itself isn't undefined.
    // `localStorage === null` is a less common check but included for robustness.
    // In some environments or if `localStorage` is polyfilled badly, it might be `null`.
    if (typeof localStorage === 'undefined' || localStorage === null) {
        // If localStorage is not available, throw an error to inform the caller.
        // This prevents runtime errors like "localStorage is not defined".
        throw new Error('localStorage is not available in this environment.');
    }
    // Step 2: Retrieve the item from localStorage using the provided key.
    // `localStorage.getItem(key)` returns:
    // - The string value associated with the key.
    // - `null` if the key does not exist in localStorage.
    const item = localStorage.getItem(key);
    // Step 3: Handle the case where the key is not found.
    // If `item` is `null`, it means the key was not present in localStorage.
    // In this scenario, we return `null` as per the function's contract.
    if (item === null) {
        return null;
    }
    // Step 4: Parse the retrieved string item as JSON.
    // `JSON.parse()` will convert the JSON string into its corresponding JavaScript value.
    // - If `item` is the string "null", `JSON.parse("null")` correctly returns the JavaScript `null` value.
    // - If `item` is any other valid JSON string (e.g., '{"name":"John"}', '["a","b"]', '"hello"', '123', 'true'),
    //   it will be parsed into the equivalent object, array, string, number, or boolean.
    // - If `item` is not a valid JSON string (e.g., "{'foo': 'bar'}" (uses single quotes), or "{foo: 'bar'}" (unquoted key)),
    //   `JSON.parse()` will throw a `SyntaxError`. This error is not caught here and will propagate
    //   to the caller, who is responsible for handling potential parsing failures.
    return JSON.parse(item);
}
//# sourceMappingURL=getLocalStorageJSON.js.map