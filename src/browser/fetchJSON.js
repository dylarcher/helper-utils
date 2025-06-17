/**
 * @typedef {function(): any} PromiseTryCallback
 * A callback function that can be executed by Promise.try.
 * It can return a synchronous value, a Promise, or throw an error.
 */

/**
 * @typedef {Object} PromiseWithTryMethod
 * Extends the global Promise object with a static `try` method.
 * @property {function(PromiseTryCallback): Promise<any>} try - Executes a function and returns a Promise.
 */

/**
 * Polyfill for `Promise.try`.
 * `Promise.try(callback)` is a way to start a Promise chain with a function that might
 * return a synchronous value, throw a synchronous error, or return a Promise.
 * This ensures that any synchronous errors thrown in the callback are caught and
 * converted into a rejected Promise, and any synchronous return values are wrapped
 * in a resolved Promise. This normalizes the start of a Promise chain.
 *
 * This polyfill checks if `Promise.try` already exists and only defines it if it's missing.
 *
 * @template T - The expected type of the resolution value of the Promise.
 * @param {() => T | Promise<T>} callback - The function to execute. This function can
 *                                         return a value, throw an error, or return a Promise.
 * @returns {Promise<T>} A Promise that resolves with the result of the callback or
 *                       rejects with an error thrown by the callback.
 */
if (!(/** @type {PromiseConstructor & PromiseWithTryMethod} */ (Promise).try)) {
	// Assign the 'try' method to the global Promise constructor.
	/** @type {PromiseConstructor & PromiseWithTryMethod} */ (Promise).try =
		function (/** @type {Function} */ callback) {
			// Return a new Promise that wraps the execution of the callback.
			return new Promise(function (resolve, reject) {
				try {
					// Execute the callback.
					// `resolve(callback())` handles three cases:
					// 1. If `callback()` returns a synchronous value, `resolve` wraps it in a resolved Promise.
					// 2. If `callback()` throws a synchronous error, this try/catch block catches it, and `reject` creates a rejected Promise.
					// 3. If `callback()` returns a Promise, `resolve` assimilates that Promise (i.e., the new Promise
					//    will adopt the state and value/reason of the Promise returned by `callback()`).
					resolve(callback());
				} catch (e) {
					// If the callback throws a synchronous error, reject the new Promise with that error.
					reject(e);
				}
			});
		};
}

/**
 * A utility function for making HTTP requests using the `fetch` API, specifically tailored for JSON responses.
 * It simplifies common tasks such as setting JSON-related headers, stringifying request bodies,
 * and parsing JSON responses. It leverages the `Promise.try` pattern for a cleaner async flow.
 *
 * Key features:
 * - Automatically sets the `Accept` header to `application/json`.
 * - If `options.body` is a plain JavaScript object (and not `FormData`), it automatically:
 *   - Stringifies the body using `JSON.stringify()`.
 *   - Sets the `Content-Type` header to `application/json`.
 * - Throws an `Error` for HTTP error responses (i.e., when `response.ok` is `false`).
 *   The error object includes the HTTP status, status text, and the response body text (if available)
 *   for better debugging.
 * - Correctly handles HTTP 204 (No Content) responses by resolving with `null`.
 * - Returns `null` if the response is successful (e.g. 200 OK) but the `Content-Type` is not `application/json`
 *   or if the response body is empty, preventing errors when `response.json()` would fail.
 *
 * @param {string} url - The URL to fetch. This should be a complete URL or a path relative to the current page.
 * @param {RequestInit & {body?: any}} [options={}] - Optional. Standard `fetch` API options (`RequestInit`).
 *   The `body` property can be of any type. If it's an object (and not `FormData` or other fetch-native body types),
 *   it will be automatically stringified to JSON.
 * @returns {Promise<any|null>} A Promise that resolves with the parsed JSON response data.
 *   - If the server returns a 204 No Content status, the Promise resolves with `null`.
 *   - If the server returns a successful response (e.g., 200 OK) but the content is not JSON
 *     (or the body is empty), the Promise resolves with `null`.
 *   - In case of an HTTP error (e.g., 4xx or 5xx status codes), the Promise rejects with an `Error`.
 * @throws {Error} Throws an error for HTTP errors (when `response.ok` is false). The error message
 *                 is detailed, containing status, status text, and response body.
 *                 Also re-throws errors from `fetch` itself (e.g., network errors, CORS issues).
 *
 * @example
 * // Example 1: Basic GET request
 * async function getUserData(userId) {
 *   try {
 *     const user = await fetchJSON(`/api/users/${userId}`);
 *     if (user) {
 *       console.log('User data:', user);
 *     } else {
 *       console.log('User not found or no data returned.');
 *     }
 *   } catch (error) {
 *     console.error(`Failed to fetch user ${userId}:`, error.message);
 *     // Example error.message: "HTTP error 404: Not Found. Body: User not found"
 *   }
 * }
 *
 * @example
 * // Example 2: POST request with a JSON body
 * async function createNewUser(userData) {
 *   try {
 *     const createdUser = await fetchJSON('/api/users', {
 *       method: 'POST',
 *       body: userData, // `userData` is an object, will be stringified
 *     });
 *     console.log('User created:', createdUser);
 *     return createdUser;
 *   } catch (error) {
 *     console.error('Failed to create user:', error.message);
 *     return null;
 *   }
 * }
 * // createNewUser({ name: 'Jane Doe', email: 'jane@example.com' });
 *
 * @example
 * // Example 3: Handling a DELETE request (often returns 204 No Content)
 * async function deletePost(postId) {
 *   try {
 *     const result = await fetchJSON(`/api/posts/${postId}`, { method: 'DELETE' });
 *     if (result === null) { // Expect null for a 204 response
 *       console.log(`Post ${postId} deleted successfully.`);
 *     } else {
 *       console.log('Delete operation returned unexpected data:', result);
 *     }
 *   } catch (error) *     console.error(`Failed to delete post ${postId}:`, error.message);
 *   }
 * }
 */
export function fetchJSON(url, options = {}) {
	// Use Promise.try to ensure that any synchronous errors during option processing
	// or the initial fetch call are caught and lead to a rejected Promise.
	return /** @type {PromiseConstructor & PromiseWithTryMethod} */ (Promise).try(
		async () => {
			// Define default headers for JSON requests.
			/** @type {Record<string, string>} */
			const defaultHeaders = {
				Accept: 'application/json', // We expect a JSON response from the server.
			};

			// Create a mutable copy of the provided options to avoid modifying the original object.
			// This allows us to safely add or modify headers and body.
			const processedOptions = { ...options };

			// Check if a body is provided, if it's an object, and if it's not FormData.
			// FormData is handled natively by fetch and should not be stringified.
			// Other object types are assumed to be intended as JSON payloads.
			if (
				processedOptions.body &&
				typeof processedOptions.body === 'object' &&
				!(processedOptions.body instanceof FormData) // FormData is passed as-is
			) {
				// Stringify the body to JSON format.
				processedOptions.body = JSON.stringify(processedOptions.body);
				// Set the Content-Type header to application/json.
				// Merge with existing defaultHeaders and any headers already in processedOptions.
				// User-provided headers in `options.headers` will override `defaultHeaders` if keys conflict,
				// and `Content-Type` here will override any user-provided `Content-Type`.
				processedOptions.headers = {
					'Content-Type': 'application/json',
					...defaultHeaders,
					...(processedOptions.headers || {}), // Spread existing headers from options
				};
			} else {
				// If no body processing is needed, just merge default headers with any existing ones.
				processedOptions.headers = {
					...defaultHeaders,
					...(processedOptions.headers || {}),
				};
			}

			// Perform the actual fetch request using the URL and processed options.
			// This can throw errors for network issues (e.g., DNS failure, server unreachable) or CORS problems.
			const response = await fetch(url, processedOptions);

			// Check if the response status indicates an HTTP error (e.g., 4xx or 5xx).
			// `response.ok` is true for statuses in the range 200-299.
			if (!response.ok) {
				let errorData = '';
				try {
					// Attempt to read the response body as text, as it might contain error details.
					errorData = await response.text();
				} catch (_e) {
					// If reading the body fails, use a placeholder.
					errorData = '[Could not read error response body]';
				}
				// Construct a detailed error message and throw an error to reject the Promise.
				throw new Error(
					`HTTP error ${response.status}: ${response.statusText}. Body: ${errorData}`,
				);
			}

			// Handle successful responses.

			// Check for HTTP 204 No Content. In this case, there's no body to parse.
			if (response.status === 204) {
				return null; // Resolve with null for 204 responses.
			}

			// Get the Content-Type header from the response.
			const contentType = response.headers.get('content-type');

			// Check if the response includes a Content-Type header and if it indicates JSON.
			// If not JSON, or if Content-Type is missing, or if body is likely empty,
			// trying to parse as JSON would error or result in unexpected behavior.
			if (!contentType || !contentType.includes('application/json')) {
				// Consider if `response.text()` should be returned or if `null` is always appropriate here.
				// For a strict JSON fetch utility, `null` is safer if non-JSON is received.
				// An empty response body after a 200 OK would also fail .json(), this check helps.
				// If `response.text()` was small, it might have been already consumed by error check if `response.ok` was false
				// but here `response.ok` is true.
				// If response.text() could be large, it's better to avoid reading it if not JSON.
				return null;
			}

			// If the response is OK (and not 204) and Content-Type is JSON, parse the body as JSON.
			// `response.json()` returns a Promise that resolves with the parsed JSON object.
			// This can throw an error if the body is not valid JSON.
			try {
				return await response.json();
			} catch (jsonError) {
				// If response.json() fails (e.g. body is valid JSON but malformed, or empty string for some reason)
				console.error('Failed to parse JSON response:', jsonError);
				// Re-throw the original error to preserve error type (e.g., SyntaxError)
				throw jsonError;
			}
		},
	);
}
