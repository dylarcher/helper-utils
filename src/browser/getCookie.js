/**
 * Retrieves a browser cookie by its name.
 * This function is designed for client-side execution and will return `null`
 * if `document` or `document.cookie` is not available (e.g., in a Node.js environment without a DOM).
 * Cookie names are typically case-sensitive.
 *
 * @param {string} alias - The name (alias) of the cookie to retrieve.
 * @returns {string|null} The value of the cookie if found. Returns an empty string if the cookie
 * exists but has no value. Returns `null` if the cookie is not found or if not in a browser environment.
 *
 * @example
 * // Assuming a cookie "username=JohnDoe" has been set
 * const userName = getCookie('username'); // "JohnDoe"
 *
 * // Assuming a cookie "session=" has been set (empty value)
 * const session = getCookie('session'); // ""
 *
 * // Cookie not set
 * const nonExistent = getCookie('nonExistentCookie'); // null
 */
export function getCookie(alias) {
	if (typeof document === 'undefined' || !document.cookie || document.cookie === '') {
		return null;
	}

	const cookies = document.cookie.split(';');
	for (const rawCookie of cookies) {
		// Standard parsing: find the first '=', anything before is name, anything after is value.
		// Handles cookies like " name = value ".
		const separatorIndex = rawCookie.indexOf('=');

		// If '=' is not found, or if it's the first char (no name), this cookie part is skipped.
		// A valid cookie name must exist.
		if (separatorIndex <= 0) {
			continue;
		}

		const name = rawCookie.substring(0, separatorIndex).trim();
		if (name === alias) {
			// Value is everything after the first '=', trimmed.
			// Handles cases where the value might also contain '=' if not properly URI encoded,
			// though standard practice is to encode cookie values.
			const value = rawCookie.substring(separatorIndex + 1).trim();
			return value;
		}
	}
	return null;
}
