/**
 * Parses a URL query string into an object of key-value pairs.
 * By default, it uses the current browser window's `window.location.search` if no
 * query string is provided. If `window` or `window.location` is not available
 * (e.g., in non-browser environments), the `queryString` parameter must be supplied.
 *
 * The parsing is handled by the `URLSearchParams` API.
 * - If a key appears multiple times in the query string (e.g., `key=val1&key=val2`),
 *   the last occurrence of the value for that key will be stored in the resulting object
 *   when iterating with `params.entries()`. This is standard behavior for `URLSearchParams`
 *   when constructing an object this way. (Correction: `URLSearchParams.entries()` yields all pairs,
 *   but direct assignment `result[key] = value` will overwrite, effectively keeping the last one).
 * - Values are automatically URL-decoded.
 *
 * @param {string} [queryString] - Optional. The query string to parse (e.g., '?foo=bar&baz=qux').
 *   Defaults to `window.location.search` if in a browser context and `queryString` is undefined.
 * @returns {Record<string, string>} An object where keys are parameter names and values are their
 *   corresponding string values. Returns an empty object if the query string is empty or has no parameters.
 *
 * @example
 * // Assuming window.location.search is '?name=John%20Doe&age=30&city=New+York'
 * // const queryParams = parseQueryParams();
 * // console.info(queryParams);
 * // Output: { name: 'John Doe', age: '30', city: 'New York' }
 *
 * // Providing a custom query string
 * const customQuery = '?item=book&category=fiction&item=pen';
 * const paramsFromCustom = parseQueryParams(customQuery);
 * console.info(paramsFromCustom);
 * // Output: { item: 'pen', category: 'fiction' } (item will be 'pen' due to overwrite)
 *
 * // Empty query string
 * console.info(parseQueryParams('')); // {}
 * console.info(parseQueryParams('?')); // {}
 *
 * // Query string with no parameters
 * console.info(parseQueryParams('?noParams')); // { noParams: '' }
 *
 * // Query string with special characters
 * const specialCharsQuery = '?message=Hello%2C%20World%21&path=%2Ftest';
 * const paramsWithSpecial = parseQueryParams(specialCharsQuery);
 * console.info(paramsWithSpecial);
 * // Output: { message: 'Hello, World!', path: '/test' }
 *
 * // Behavior in Node.js or environment without window.location:
 * // parseQueryParams(); // Would throw error if window.location.search is accessed and window is undefined.
 * // To use in such environments, always provide the queryString argument:
 * // const nodeParams = parseQueryParams('?id=123&source=api');
 * // console.info(nodeParams); // { id: '123', source: 'api' }
 */
export function parseQueryParams(queryString) {
    let effectiveQueryString = queryString;
    if (typeof queryString === 'undefined') {
        if (typeof window !== 'undefined' &&
            typeof window.location !== 'undefined') {
            effectiveQueryString = window.location.search;
        }
        else {
            // In non-browser environment or if window.location is somehow unavailable,
            // and no queryString is provided, default to an empty string.
            // Alternatively, could throw an error if queryString is mandatory in such cases.
            effectiveQueryString = '';
        }
    }
    const params = new URLSearchParams(effectiveQueryString);
    // URLSearchParams is directly iterable and works with Object.fromEntries.
    // If there are duplicate keys, the last one wins, which matches the previous loop's behavior.
    return Object.fromEntries(params);
}
