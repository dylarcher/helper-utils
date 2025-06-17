/**
 * Serializes a JavaScript value to a JSON string and stores it in the browser's
 * `localStorage` under the specified key.
 *
 * This function handles a specific behavior of `JSON.stringify()`:
 * - If `JSON.stringify()` is called with `undefined`, a function, or a Symbol as the direct value,
 *   it returns `undefined`. To ensure that a key is always explicitly set in `localStorage`
 *   and to represent these "empty" or "unserializable" states consistently, this function
 *   converts such `undefined` stringification results into the literal string `"null"`.
 *   This means `getLocalStorageJSON(key)` would later parse this back to `null`.
 *
 * If any error occurs during the stringification process (e.g., circular references) or
 * during storage in `localStorage` (e.g., quota exceeded, `localStorage` unavailable),
 * the error is re-thrown and must be handled by the caller.
 *
 * @param {string} key - The key under which the stringified value will be stored in `localStorage`.
 * @param {any} value - The JavaScript value to be serialized to JSON and stored.
 *                      Can be any value that `JSON.stringify()` can process (objects, arrays,
 *                      primitives). Functions and Symbols will effectively be stored as `"null"`.
 * @returns {true} Returns `true` if the value was successfully stringified and stored in `localStorage`.
 *                 This return value primarily indicates successful execution up to the `setItem` call;
 *                 it doesn't guarantee the data wasn't immediately evicted or that `localStorage`
 *                 isn't full if an error wasn't thrown synchronously.
 * @throws {Error} Throws an `Error` if `localStorage` is not available in the current environment.
 * @throws {TypeError} Can throw a `TypeError` from `JSON.stringify` if it encounters circular references
 *                     in the `value` (e.g., `obj.self = obj`).
 * @throws {DOMException | Error} Can throw an error (often a `DOMException` like `QuotaExceededError`)
 *                     from `localStorage.setItem` if the storage quota is exceeded or if `localStorage`
 *                     is disabled or otherwise inaccessible.
 *
 * @example
 * // Example 1: Storing a simple object
 * const userSettings = { theme: 'dark', notifications: true, volume: 75 };
 * try {
 *   if (setLocalStorageJSON('userSettings', userSettings)) {
 *     console.log('User settings saved.');
 *     // localStorage will contain: 'userSettings' -> '{"theme":"dark","notifications":true,"volume":75}'
 *   }
 * } catch (e) {
 *   console.error('Failed to save user settings:', e.message);
 * }
 *
 * // Example 2: Storing an array
 * const recentSearches = ['JavaScript utilities', 'CSS frameworks', 'localStorage guide'];
 * try {
 *   setLocalStorageJSON('recentSearches', recentSearches);
 *   // localStorage: 'recentSearches' -> '["JavaScript utilities","CSS frameworks","localStorage guide"]'
 * } catch (e) {
 *   console.error(e);
 * }
 *
 * // Example 3: Storing null
 * try {
 *   setLocalStorageJSON('activeUser', null);
 *   // localStorage: 'activeUser' -> 'null' (the string "null")
 * } catch (e) {
 *   console.error(e);
 * }
 *
 * // Example 4: Storing undefined (will be stored as the string "null")
 * try {
 *   setLocalStorageJSON('optionalFeature', undefined);
 *   // localStorage: 'optionalFeature' -> 'null'
 *   // console.log(localStorage.getItem('optionalFeature')); // "null"
 * } catch (e) {
 *   console.error(e);
 * }
 *
 * // Example 5: Storing a function (will be stored as the string "null")
 * try {
 *   setLocalStorageJSON('myFunction', () => console.log('hello'));
 *   // localStorage: 'myFunction' -> 'null'
 * } catch (e) {
 *   console.error(e);
 * }
 *
 * // Example 6: Potential QuotaExceededError (if `largeData` is too big)
 * // const largeData = Array(1024 * 1024).fill('a').join(''); // Approx 1MB string
 * // try {
 * //   setLocalStorageJSON('bigData', largeData);
 * // } catch (error) {
 * //   console.error(`Error storing large data: ${error.name} - ${error.message}`);
 * //   // Might be: "QuotaExceededError - Failed to execute 'setItem' on 'Storage': Setting the value of 'bigData' exceeded the quota."
 * // }
 */
export function setLocalStorageJSON(key: string, value: any): true;
