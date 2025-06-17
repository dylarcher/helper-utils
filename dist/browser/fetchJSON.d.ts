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
export function fetchJSON(url: string, options?: RequestInit & {
    body?: any;
}): Promise<any | null>;
/**
 * A callback function that can be executed by Promise.try.
 * It can return a synchronous value, a Promise, or throw an error.
 */
export type PromiseTryCallback = () => any;
/**
 * Extends the global Promise object with a static `try` method.
 */
export type PromiseWithTryMethod = {
    /**
     * - Executes a function and returns a Promise.
     */
    try: (arg0: PromiseTryCallback) => Promise<any>;
};
