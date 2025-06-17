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
export function getCookie(cookieName) {
    // Check if the function is running in a browser environment with access to document.cookie.
    // `typeof document === 'undefined'` handles server-side rendering or Node.js environments.
    // `!document.cookie` handles cases where `document` exists but `cookie` property is not available or empty.
    // An empty `document.cookie` string means no cookies are set.
    if (typeof document === 'undefined' ||
        !document.cookie ||
        document.cookie === '') {
        return null; // No cookies available or not in a browser context.
    }
    // `document.cookie` returns a single string containing all cookies,
    // separated by semicolons and a space (e.g., "name1=value1; name2=value2").
    // Split this string into an array of individual cookie strings.
    const cookies = document.cookie.split(';');
    // Iterate over each cookie string in the array.
    for (const rawCookie of cookies) {
        // Remove any leading whitespace from the cookie string.
        // e.g., " name=value" becomes "name=value".
        const trimmedCookie = rawCookie.trimStart();
        // Check if the cookie string contains an equals sign ('='),
        // which separates the cookie name from its value.
        if (trimmedCookie.includes('=')) {
            const separatorIndex = trimmedCookie.indexOf('=');
            // If '=' is not found (should not happen if includes('=') is true, but as a safeguard)
            // or if '=' is the first character (meaning the cookie name is missing, e.g., "=value"),
            // this part of the cookie string is malformed or not what we're looking for. Skip it.
            if (separatorIndex <= 0) {
                continue; // Move to the next cookie string.
            }
            // Extract the cookie name. It's the part of the string before the first '='.
            // Trim any whitespace around the extracted name.
            const currentCookieName = trimmedCookie
                .substring(0, separatorIndex)
                .trim();
            // Compare the extracted cookie name with the requested `cookieName`.
            // This comparison is case-sensitive.
            if (currentCookieName === cookieName) {
                // If the names match, extract the cookie value.
                // The value is everything after the first '='.
                // Trim any whitespace around the extracted value.
                // This correctly handles cases where the cookie value itself might contain '='
                // (e.g., "prefs=user=admin&theme=dark"), though such values should ideally be URI encoded.
                const cookieValue = trimmedCookie.substring(separatorIndex + 1).trim();
                return cookieValue; // Return the found cookie value.
            }
        }
        // If a cookie part doesn't contain '=', it might be a flag-like cookie without a value,
        // or just a malformed part. This function specifically looks for "name=value" pairs.
        // If the requested `name` matches a cookie part that has no '=', it won't be found by this logic.
        // For a cookie like "isEnabled" (no '='), this function would require `getCookie("isEnabled")`
        // and it wouldn't match if the cookie string part is just "isEnabled".
        // Standard cookies are usually `name=value`.
    }
    // If the loop completes without finding a matching cookie name,
    // the requested cookie is not present. Return null.
    return null;
}
//# sourceMappingURL=getCookie.js.map