/**
 * Simplified `fetch` for JSON requests/responses.
 * @param {string} url - The URL to fetch.
 * @param {object} [options={}] - Fetch options (method, headers, body, etc.).
 *                                 If body is an object, it's stringified and Content-Type is set to application/json.
 * @returns {Promise<*>} A promise that resolves with the parsed JSON response.
 */
export function fetchJSON(url: string, options?: object): Promise<any>;
