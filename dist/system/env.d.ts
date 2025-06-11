/**
 * Access environment variables with a fallback default value.
 * @param {string} key - The environment variable key.
 * @param {*} [defaultValue] - The default value if the environment variable is not set.
 * @returns {*} The value of the environment variable or the default value.
 */
export function env(key: string, defaultValue?: any): any;
