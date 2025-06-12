/**
 * Retrieves a browser cookie by name.
 * @param {string} alias - The name of the cookie.
 * @returns {string|null} The cookie value, or null if not found.
 */
export function getCookie(alias) {
	if (typeof document === "undefined" || !document.cookie) {
		return null;
	}

	const nameEQ = `${alias}=`;
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		const c = ca[i].trimStart();
		if (c.startsWith(nameEQ)) {
			return c.substring(nameEQ.length, c.length);
		}
	}
	return null;
}
