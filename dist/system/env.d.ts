/**
 * Retrieves the value of an environment variable by its key from `process.env`.
 * If the environment variable is not set (i.e., it's `undefined` in `process.env`),
 * this function returns a provided `defaultValue`.
 *
 * This function is specifically designed for Node.js environments, as it relies on the
 * global `process.env` object.
 *
 * **Important Notes on Environment Variables:**
 * - All values stored in `process.env` are strings. If an environment variable represents
 *   a number, boolean, or JSON object, the calling code is responsible for parsing or
 *   coercing the returned string value into the expected type.
 * - An environment variable that is set to an empty string (e.g., `MY_VAR=""` in the shell)
 *   is considered **set**. In this case, `process.env.MY_VAR` will be `""` (an empty string),
 *   and this function will return `""`, not the `defaultValue`.
 * - The `key` for environment variables is typically case-sensitive on POSIX systems (Linux, macOS)
 *   and case-insensitive on Windows, but `process.env` in Node.js often reflects the
 *   case as it was set or as normalized by the OS. It's best practice to use consistent casing.
 *
 * @template T - The type of the `defaultValue`. This allows for typed default values,
 *               though the function primarily returns `string` if the variable is found.
 * @param {string} key - The name (key) of the environment variable to retrieve (e.g., 'NODE_ENV', 'API_PORT').
 * @param {T} [defaultValue] - Optional. The value to return if the environment variable specified by `key`
 *                             is not found (i.e., `process.env[key]` is `undefined`).
 *                             If `defaultValue` is not provided and the variable is not set, this function
 *                             will return `undefined`.
 * @returns {string | T} The value of the environment variable as a string if it is set.
 *                       Otherwise, it returns the `defaultValue`. If `defaultValue` is also `undefined`
 *                       (or not provided) and the variable is not set, then `undefined` is returned.
 *
 * @example
 * // Assume the following environment variables are set in the shell:
 * // export APP_NAME="MyApplication"
 * // export APP_PORT="8080"
 * // export ENABLE_FEATURE_X="true"
 * // export EMPTY_CONFIG_VALUE=""
 *
 * // Example 1: Get an existing environment variable
 * const appName = env('APP_NAME');
 * console.log(appName); // Output: "MyApplication" (string)
 *
 * // Example 2: Get an existing variable, provide a default (default won't be used)
 * const appPortString = env('APP_PORT', '3000');
 * console.log(appPortString); // Output: "8080" (string)
 * // To use as a number:
 * const appPortNumber = parseInt(env('APP_PORT', '3000'), 10);
 * console.log(appPortNumber); // Output: 8080 (number)
 *
 * // Example 3: Get a non-existent variable, use the provided default value
 * const apiKey = env('API_KEY', 'default-key-if-not-set');
 * console.log(apiKey); // Output: "default-key-if-not-set"
 *
 * // Example 4: Get a non-existent variable, no default value provided
 * const dbHost = env('DATABASE_HOST');
 * console.log(dbHost); // Output: undefined
 *
 * // Example 5: Variable is set but is an empty string
 * const emptyConfig = env('EMPTY_CONFIG_VALUE', 'default-for-empty');
 * console.log(emptyConfig); // Output: "" (empty string, because the variable IS set)
 *
 * // Example 6: Handling boolean-like environment variables
 * const featureXEnabledString = env('ENABLE_FEATURE_X', 'false'); // Returns "true" (string)
 * const isFeatureXEnabled = featureXEnabledString === 'true'; // Manual conversion to boolean
 * console.log(isFeatureXEnabled); // Output: true (boolean)
 *
 * // Example 7: Using a number as a default value
 * const timeout = env('REQUEST_TIMEOUT_MS', 5000); // If TIMEOUT_MS is not set, timeout is 5000 (number)
 *                                                 // If TIMEOUT_MS is "10000", timeout is "10000" (string)
 * console.log(typeof timeout); // 'string' if set, 'number' if default is used. Be mindful of type.
 */
export function env<T>(key: string, defaultValue?: T): string | T;
