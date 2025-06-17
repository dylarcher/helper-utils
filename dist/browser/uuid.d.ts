/**
 * Generates a universally unique identifier (UUID) version 4 using the browser's
 * built-in `crypto.randomUUID()` method.
 *
 * UUID v4 identifiers are randomly generated and are designed to be unique across
 * space and time with an extremely low probability of collision. They are suitable
 * for generating unique IDs for database records, DOM elements, transaction identifiers, etc.
 * The format is typically `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`, where `x` is a
 * random hexadecimal digit and `y` is one of `8`, `9`, `a`, or `b`.
 *
 * This function relies on the `crypto.randomUUID()` method, which is part of the Web
 * Cryptography API. Key considerations for its use:
 * - **Browser Support**: It is available in modern browsers (Chrome 92+, Firefox 90+, Safari 15.4+, Edge 92+).
 * - **Secure Context**: While often available in insecure contexts (`http://localhost`),
 *   the Web Cryptography API's features, including `crypto.randomUUID()`, are generally
 *   guaranteed and most reliable in secure contexts (HTTPS). Some browser features or
 *   stricter security policies might restrict its availability in insecure contexts.
 * - **Cryptographically Strong**: The generated UUIDs are cryptographically strong,
 *   meaning they are suitable for use cases where unpredictability is important.
 *
 * If `crypto.randomUUID()` is not available in the current browsing environment
 * (e.g., due to an older browser, a non-browser environment that doesn't polyfill it,
 * or a context where the crypto API is restricted), this function will throw an `Error`.
 * Callers should be prepared to handle this error, for instance, by using a fallback
 * UUID generation method if necessary for broader compatibility.
 *
 * @returns {string} A new UUID v4 string (e.g., 'f47ac10b-58cc-4372-a567-0e02b2c3d479').
 * @throws {Error} Throws an `Error` with the message 'crypto.randomUUID is not available in this browser.'
 *                 if the `crypto.randomUUID` method cannot be found or accessed.
 *
 * @example
 * // Example 1: Successful UUID generation
 * try {
 *   const newId = uuid();
 *   console.log('Generated UUID:', newId);
 *   // Example output: Generated UUID: a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d
 *   // (Actual UUID will vary with each call)
 *   if (newId.length === 36 && newId.charAt(14) === '4') {
 *     console.log('Format appears to be a valid UUID v4.');
 *   }
 * } catch (error) {
 *   console.error('UUID Generation Failed:', error.message);
 *   // This block would execute in older browsers or unsupported environments.
 *   // Implement fallback logic here if needed:
 *   // const fallbackId = generateFallbackUUID();
 *   // console.log('Using fallback UUID:', fallbackId);
 * }
 *
 * // Example 2: Direct usage (if confident about the environment's support)
 * // const anotherUniqueId = uuid();
 * // console.log('Another ID:', anotherUniqueId);
 *
 * // Example 3: Using in a loop to generate multiple IDs
 * // const idList = [];
 * // try {
 * //   for (let i = 0; i < 3; i++) {
 * //     idList.push(uuid());
 * //   }
 * //   console.log('Generated IDs:', idList);
 * // } catch (e) {
 * //   console.error("Could not generate all UUIDs due to environment error:", e.message);
 * // }
 */
export function uuid(): string;
