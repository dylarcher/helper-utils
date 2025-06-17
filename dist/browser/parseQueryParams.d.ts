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
export function parseQueryParams(queryString?: string): Record<string, string>;
