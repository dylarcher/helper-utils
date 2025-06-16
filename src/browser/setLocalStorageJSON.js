/**
 * Stringifies a JavaScript value and stores it in localStorage under the given key.
 * Handles cases where `JSON.stringify` might return `undefined` (e.g., for `undefined` itself
 * or functions), by storing the string 'null' instead. This ensures that the key is always set.
 * If any error occurs during stringification or storage, the error is re-thrown.
 *
 * @param {string} key - The key under which to store the value in localStorage.
 * @param {any} value - The JavaScript value to stringify and store.
 *   If `value` is `undefined` or a function, it will be stored as the string 'null'.
 * @returns {true} Returns `true` if the value was successfully stringified and stored.
 * @throws {Error} Throws an error if `localStorage` is not available, if `JSON.stringify` fails (rare),
 *   or if `localStorage.setItem` fails (e.g., `QuotaExceededError`). The specific error
 *   object from the underlying operation is re-thrown.
 *
 * @example
 * // Basic usage
 * const user = { name: "John", preferences: { theme: "dark" } };
 * try {
 *   setLocalStorageJSON('userProfile', user);
 *   console.info('User profile saved.'); // localStorage will have 'userProfile':'{"name":"John","preferences":{"theme":"dark"}}'
 * } catch (e) {
 *   console.error('Could not save user profile:', e.message);
 * }
 *
 * // Storing a number
 * try {
 *   setLocalStorageJSON('visitCount', 10); // localStorage will have 'visitCount':'10'
 * } catch (e) {
 *   console.error('Could not save visit count:', e.message);
 * }
 *
 * // Storing null
 * try {
 *   setLocalStorageJSON('lastItem', null); // localStorage will have 'lastItem':'null'
 * } catch (e) {
 *   console.error('Could not save last item:', e.message);
 * }
 *
 * // Storing undefined - will be stored as 'null'
 * try {
 *   setLocalStorageJSON('optionalSetting', undefined);
 *   // localStorage will have 'optionalSetting':'null'
 * } catch (e) {
 *   console.error('Could not save optional setting:', e.message);
 * }
 *
 * // Example of a potential error (e.g., if localStorage is full)
 * // const largeObject = { ... }; // a very large object
 * // try {
 * //   setLocalStorageJSON('largeData', largeObject);
 * // } catch (error) {
 * //   console.error('Failed to save large data:', error.name, error.message); // e.g., QuotaExceededError
 * // }
 */
export function setLocalStorageJSON(key, value) {
	// Ensure localStorage is available before trying to use it.
	if (typeof localStorage === 'undefined' || localStorage === null) {
		throw new Error('localStorage is not available in this environment.');
	}

	// JSON.stringify converts undefined and functions to undefined.
	// To avoid issues with localStorage.setItem (which might stringify undefined differently
	// or throw errors in some implementations if passed undefined directly),
	// we explicitly convert such cases to the string 'null'.
	const stringified = JSON.stringify(value);
	const finalValue = stringified === undefined ? 'null' : stringified;
	localStorage.setItem(key, finalValue);
	return true;
}
