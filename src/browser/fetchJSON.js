/**
 * Simplified fetch utility for JSON requests and responses.
 * Automatically sets 'Accept' header to 'application/json'.
 * If 'options.body' is an object (and not FormData), it stringifies the body
 * and sets 'Content-Type' header to 'application/json'.
 *
 * @param {string} url - The URL to fetch.
 * @param {RequestInit & {body?: any}} [options={}] - Fetch options (standard `RequestInit` options).
 *   The `body` can be any type; if it's an object, it will be JSON.stringify'd.
 * @returns {Promise<any|null>} A promise that resolves with the parsed JSON response.
 *   Returns `null` if the response is HTTP 204 (No Content) or if the response
 *   is not 'application/json' (e.g. an empty response body).
 * @throws {Error} Throws an error for HTTP errors (response.ok is false).
 *   The error message includes the HTTP status, status text, and response body text.
 *
 * @example
 * // GET request
 * async function getUser(userId) {
 *   try {
 *     const userData = await fetchJSON(`/api/users/${userId}`);
 *     console.info(userData);
 *   } catch (error) {
 *     console.error('Failed to fetch user:', error.message);
 *   }
 * }
 *
 * // POST request
 * async function createUser(data) {
 *   try {
 *     const newUser = await fetchJSON('/api/users', {
 *       method: 'POST',
 *       body: data, // Automatically stringified
 *     });
 *     console.info('User created:', newUser);
 *     return newUser;
 *   } catch (error) {
 *     console.error('Failed to create user:', error.message);
 *     return null;
 *   }
 * }
 *
 * // Example with a 204 No Content response
 * async function deleteItem(itemId) {
 *   try {
 *     const result = await fetchJSON(`/api/items/${itemId}`, { method: 'DELETE' });
 *     // result will be null if server returns 204 No Content
 *     if (result === null) {
 *       console.info('Item deleted successfully.');
 *     }
 *   } catch (error) {
 *     console.error('Failed to delete item:', error.message);
 *   }
 * }
 */
export async function fetchJSON(url, options = {}) {
	/** @type {Record<string, string>} */
	const defaultHeaders = {
		Accept: 'application/json',
	};

	if (
		options.body &&
		typeof options.body === 'object' &&
		!(options.body instanceof FormData)
	) {
		options.body = JSON.stringify(options.body);
		defaultHeaders['Content-Type'] = 'application/json';
	}

	options.headers = { ...defaultHeaders, ...(options.headers || {}) };

	const response = await fetch(url, options);

	if (!response.ok) {
		const errorData = await response.text(); // Try to get error text
		throw new Error(
			`HTTP error ${response.status}: ${response.statusText}. Body: ${errorData}`,
		);
	}

	// Handle cases where response might be empty but still OK (e.g., 204 No Content)
	const contentType = response.headers.get('content-type');
	if (
		response.status === 204 ||
		!contentType ||
		!contentType.includes('application/json')
	) {
		return null; // Or response.text() if plain text is expected for some OK statuses
	}
	return response.json();
}
