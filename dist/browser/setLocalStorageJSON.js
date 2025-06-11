/**
 * Stringify and store JSON in localStorage.
 * @param {string} key - The key in localStorage.
 * @param {*} value - The value to stringify and store.
 * @returns {boolean} True if successful, false otherwise.
 */
export function setLocalStorageJSON(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (error) {
		console.error(
			`Error setting JSON in localStorage for key "${key}":`,
			error,
		);
		return false;
	}
}
