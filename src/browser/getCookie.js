/**
 * Retrieves a browser cookie by name.
 * @param {string} alias - The name of the cookie.
 * @returns {string|null} The cookie value, or null if not found.
 */
export function getCookie(alias) {
	if (typeof document === 'undefined' || !document.cookie) {
		return null;
	}

	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		const c = ca[i].trimStart();
		// Handle spaces around equals sign
		if (c.includes('=')) {
			const parts = c.split('=');
			const cookieName = parts[0].trim();
			const cookieValue = parts.slice(1).join('=').trim();
			if (cookieName === alias) {
				return cookieValue;
			}
		}
	}
	return null;
}
