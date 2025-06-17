/**
 * Retrieves the value of a browser cookie by its specified name.
 * This function is intended for client-side JavaScript execution within a web browser
 * that has access to `document.cookie`.
 *
 * It parses the `document.cookie` string, which is a semicolon-separated list of
 * `name=value` pairs. The function correctly handles leading/trailing whitespace
 * around cookie names and values.
 *
 * Note: Cookie names are generally case-sensitive as per RFC specifications,
 * though some server-side technologies might handle them case-insensitively.
 * This function performs a case-sensitive match for the cookie name.
 * The cookie values are returned as they are stored; no URI decoding is performed by this function.
 * If a cookie is found, its value is returned. If the cookie name exists but has no value
 * (e.g., "myCookie="), an empty string is returned.
 *
 * @param {string} cookieName - The name of the cookie to retrieve.
 * @returns {string | null} The value of the cookie if found.
 *                          Returns an empty string (`""`) if the cookie exists but has no assigned value.
 *                          Returns `null` if the cookie with the specified name is not found,
 *                          or if the function is executed in an environment without access
 *                          to `document.cookie` (e.g., Node.js without a DOM emulation).
 *
 * @example
 * // Scenario 1: Cookie "username=JohnDoe" exists
 * const userName = getCookie('username');
 * console.log(userName); // Output: "JohnDoe"
 *
 * @example
 * // Scenario 2: Cookie "sessionToken=abc123xyz789; otherCookie=test" exists
 * const token = getCookie('sessionToken');
 * console.log(token); // Output: "abc123xyz789"
 *
 * @example
 * // Scenario 3: Cookie "darkMode=" (empty value) exists
 * const darkMode = getCookie('darkMode');
 * console.log(darkMode); // Output: ""
 *
 * @example
 * // Scenario 4: Cookie "nonExistentCookie" does not exist
 * const nonExistent = getCookie('nonExistentCookie');
 * console.log(nonExistent); // Output: null
 *
 * @example
 * // Scenario 5: Cookie "  spacedCookie  =  spacedValue  " exists
 * // (Assuming it was set with spaces, though usually trimmed by browsers/server)
 * const spaced = getCookie('spacedCookie');
 * console.log(spaced); // Output: "spacedValue" (if set and retrieved this way)
 * // Note: `document.cookie` parsing in this function handles trimming.
 *
 * @example
 * // Scenario 6: In a Node.js environment (no document.cookie)
 * // const nodeCookie = getCookie('anyCookie');
 * // console.log(nodeCookie); // Output: null
 */
/**
 * @param {string} cookieName
 */
export function getCookie(cookieName: string): string | null;
