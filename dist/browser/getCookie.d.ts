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
export function getCookie(alias: string): string | null;
