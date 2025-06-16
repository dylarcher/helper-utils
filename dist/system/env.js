/**
 * Accesses an environment variable by its key and returns its value.
 * If the environment variable is not set, a provided default value is returned.
 * This function is specific to Node.js environments as it uses `process.env`.
 *
 * Note: All environment variables are inherently strings. If an environment variable
 * is found, this function returns it as a string. If a `defaultValue` is returned,
 * it is returned as-is, without type coercion. If you expect a non-string type
 * (e.g., number, boolean), you'll need to parse or coerce the result.
 *
 * @template T
 * @param {string} key - The key (name) of the environment variable to retrieve.
 * @param {T} [defaultValue] - Optional. The value to return if the environment
 *   variable specified by `key` is not found in `process.env`.
 * @returns {string | T} The string value of the environment variable if it is set,
 *   otherwise `defaultValue`. If `defaultValue` is not provided and the variable
 *   is not set, returns `undefined`.
 *
 * @example
 * // Assuming environment variables are set like:
 * // USERNAME=john_doe
 * // PORT=8080
 * // DEBUG_MODE=true
 * // EMPTY_VAR=
 *
 * // Get an existing environment variable
 * const user = env('USERNAME'); // "john_doe"
 * console.info(user);
 *
 * // Get an existing variable, provide a default (default won't be used)
 * const port = env('PORT', 3000); // "8080" (as string)
 * console.info(port);
 *
 * // Get a non-existent variable, use provided default
 * const apiKey = env('API_KEY', 'default_api_key_12345'); // "default_api_key_12345"
 * console.info(apiKey);
 *
 * // Get a non-existent variable, no default provided
 * const dbHost = env('DB_HOST'); // undefined
 * console.info(dbHost);
 *
 * // Variable is set but is an empty string
 * const emptyVar = env('EMPTY_VAR', 'was_not_set'); // "" (empty string)
 * console.info(emptyVar);
 *
 * // Demonstrating need for type coercion for non-string types
 * const debugMode = env('DEBUG_MODE', false); // "true" (string)
 * if (debugMode === 'true') { // Manual coercion needed
 *   console.info('Debug mode is on');
 * }
 *
 * const numericPort = parseInt(env('PORT', '3000'), 10); // Coerce to number
 * console.info(numericPort + 1); // 8081
 */
export function env(key, defaultValue) {
    const value = process.env[key];
    // Check if the environment variable is defined.
    // An environment variable set to an empty string (e.g., MY_VAR=) is considered defined.
    if (value === undefined) {
        // @ts-ignore
        return defaultValue;
    }
    return value; // Environment variables are always strings.
}
//# sourceMappingURL=env.js.map