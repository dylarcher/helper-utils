/**
 * Simplified `fetch` for JSON requests/responses.
 * @param {string} url - The URL to fetch.
 * @param {object} [options={}] - Fetch options (method, headers, body, etc.).
 *                                 If body is an object, it's stringified and Content-Type is set to application/json.
 * @returns {Promise<*>} A promise that resolves with the parsed JSON response.
 */
export async function fetchJSON(url, options = {}) {
	const defaultHeaders = {
		Accept: "application/json",
	};
	if (
		options.body &&
		typeof options.body === "object" &&
		!(options.body instanceof FormData)
	) {
		options.body = JSON.stringify(options.body);
		defaultHeaders["Content-Type"] = "application/json";
	}
	options.headers = { ...defaultHeaders, ...options.headers };
	const response = await fetch(url, options);
	if (!response.ok) {
		const errorData = await response.text(); // Try to get error text
		throw new Error(
			`HTTP error ${response.status}: ${response.statusText}. Body: ${errorData}`,
		);
	}
	// Handle cases where response might be empty but still OK (e.g., 204 No Content)
	const contentType = response.headers.get("content-type");
	if (
		response.status === 204 ||
		!contentType ||
		!contentType.includes("application/json")
	) {
		return null; // Or response.text() if plain text is expected for some OK statuses
	}
	return response.json();
}
