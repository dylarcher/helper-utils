/**
 * Parse URL query string into an object.
 * Uses `window.location.search` by default.
 * @param {string} [queryString=window.location.search] - The query string to parse.
 * @returns {object} An object representation of the query parameters.
 */
export function parseQueryParams(queryString?: string): object;
