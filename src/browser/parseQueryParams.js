/**
 * Parse URL query string into an object.
 * Uses `window.location.search` by default.
 * @param {string} [queryString=window.location.search] - The query string to parse.
 * @returns {Record<string, string>} An object representation of the query parameters.
 */
export function parseQueryParams(queryString = window.location.search) {
	const params = new URLSearchParams(queryString);
	/** @type {Record<string, string>} */
	const result = {};
	for (const [key, value] of params.entries()) {
		result[key] = value;
	}
	return result;
}
