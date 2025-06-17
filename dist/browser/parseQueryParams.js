/**
 * Parses a URL query string into an object of key-value pairs.
 *
 * This function utilizes the `URLSearchParams` API for robust parsing of query strings.
 * It can accept a query string directly, or by default, it will attempt to use
 * `window.location.search` from the current browser environment.
 *
 * Key behaviors:
 * - URL Decoding: Values are automatically decoded (e.g., '%20' or '+' become spaces).
 * - Duplicate Keys: If a key appears multiple times in the query string (e.g., `key=val1&key=val2`),
 *   the `URLSearchParams` object will internally store all values. However, when this function
 *   converts the `URLSearchParams` to a plain JavaScript object using `Object.fromEntries()`,
 *   the **last occurrence** of the value for that key will be the one present in the resulting object.
 *   For example, for `?tag=a&tag=b`, the result will be `{ tag: 'b' }`.
 * - Empty Parameters: Parameters without a value (e.g., `?flag`) will be parsed as `key: ''` (empty string).
 * - No Query String: If the effective query string is empty (e.g., `""`, `"?"`), an empty object `{}` is returned.
 *
 * If `window` or `window.location` is not available (e.g., in Node.js or other non-browser
 * environments) and no `queryString` argument is provided, the function defaults to parsing
 * an empty string, resulting in an empty object. It does not throw an error in this case.
 *
 * @param {string} [queryString] - Optional. The query string to parse (e.g., '?foo=bar&baz=qux' or 'foo=bar&baz=qux').
 *   If omitted, it defaults to `window.location.search` if available in a browser context.
 *   The leading '?' is optional and will be handled correctly.
 * @returns {Record<string, string>} An object where keys are parameter names and values are their
 *   corresponding string values. Returns an empty object if the query string is empty or contains no parameters.
 *
 * @example
 * // Scenario 1: Using window.location.search (in a browser)
 * // Assuming window.location.search is '?name=John%20Doe&age=30&city=New+York'
 * // const queryParams = parseQueryParams();
 * // console.log(queryParams);
 * // Output: { name: 'John Doe', age: '30', city: 'New York' }
 *
 * // Scenario 2: Providing a custom query string
 * const customQuery1 = '?item=book&category=fiction&item=pen';
 * const params1 = parseQueryParams(customQuery1);
 * console.log(params1);
 * // Output: { item: 'pen', category: 'fiction' } (item is 'pen' because it's the last one)
 *
 * // Scenario 3: Query string without leading '?'
 * const customQuery2 = 'id=123&name=widget';
 * const params2 = parseQueryParams(customQuery2);
 * console.log(params2);
 * // Output: { id: '123', name: 'widget' }
 *
 * // Scenario 4: Empty or minimal query strings
 * console.log(parseQueryParams(''));   // Output: {}
 * console.log(parseQueryParams('?'));  // Output: {}
 *
 * // Scenario 5: Parameter without a value
 * console.log(parseQueryParams('?flag1&name=value&flag2='));
 * // Output: { flag1: '', name: 'value', flag2: '' }
 *
 * // Scenario 6: Query string with special characters that need decoding
 * const specialCharsQuery = '?message=Hello%2C%20World%21&path=%2Ftest%2Fpath';
 * const paramsSpecial = parseQueryParams(specialCharsQuery);
 * console.log(paramsSpecial);
 * // Output: { message: 'Hello, World!', path: '/test/path' }
 *
 * // Scenario 7: In Node.js or environment without window.location
 * // parseQueryParams(); // This would result in {} because window.location.search is not found.
 * const nodeParams = parseQueryParams('id=789&source=api&mode=test');
 * console.log(nodeParams); // Output: { id: '789', source: 'api', mode: 'test' }
 */
export function parseQueryParams(queryString) {
    // Step 1: Determine the effective query string to parse.
    let effectiveQueryString = queryString;
    // If no `queryString` argument is provided, try to use `window.location.search`.
    if (typeof queryString === 'undefined') {
        if (typeof window !== 'undefined' && // Check if `window` object exists
            typeof window.location !== 'undefined' // Check if `window.location` object exists
        ) {
            effectiveQueryString = window.location.search; // Use the browser's current query string.
        }
        else {
            // If not in a browser or `window.location` is unavailable,
            // and no `queryString` was passed, default to an empty string.
            // This ensures the function doesn't throw an error in non-browser environments
            // if called without arguments.
            effectiveQueryString = '';
        }
    }
    // Step 2: Create a URLSearchParams object.
    // The `URLSearchParams` constructor correctly handles:
    // - Optional leading '?' character (e.g., "?foo=bar" or "foo=bar").
    // - URL decoding of parameter names and values (e.g., '%20' becomes a space).
    // - Parsing of `&` separated key-value pairs.
    const params = new URLSearchParams(effectiveQueryString);
    // Step 3: Convert the URLSearchParams object to a plain JavaScript object.
    // `URLSearchParams` is an iterable that yields `[key, value]` pairs.
    // `Object.fromEntries()` takes such an iterable and converts it into an object.
    //
    // Important behavior for duplicate keys:
    // If the query string has duplicate keys (e.g., "foo=1&foo=2"), `URLSearchParams`
    // stores all values for that key. `params.getAll('foo')` would return `['1', '2']`.
    // However, `Object.fromEntries(params)` iterates through the entries.
    // For `URLSearchParams`, iterating directly (which `Object.fromEntries` does)
    // yields each key-value pair. If duplicate keys exist, they appear multiple times in the iteration.
    // When `Object.fromEntries` assigns properties to the new object, if a key appears
    // multiple times, the *last* value encountered for that key will overwrite previous ones.
    // For example, `new URLSearchParams('foo=1&bar=A&foo=2')` when passed to `Object.fromEntries`
    // will result in `{ foo: '2', bar: 'A' }`.
    return Object.fromEntries(params);
}
//# sourceMappingURL=parseQueryParams.js.map