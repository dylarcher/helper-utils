/**
 * Generates a universally unique identifier (UUID v4) using the browser's built-in
 * `crypto.randomUUID()` method.
 *
 * This function relies on a modern browser feature that is typically available in
 * secure contexts (HTTPS).
 *
 * @returns {string} A new UUID v4 string (e.g., 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').
 * @throws {Error} Throws an error with the message 'crypto.randomUUID is not available in this browser.'
 *                 if the `crypto.randomUUID` method is not available in the current browsing environment
 *                 (e.g., older browser, insecure context for some crypto features, or non-browser environment
 *                 where `crypto` object is different or missing).
 *
 * @example
 * try {
 *   const newId = uuid();
 *   console.info('Generated UUID:', newId);
 *   // Example output: Generated UUID: a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d
 * } catch (error) {
 *   console.error('Failed to generate UUID:', error.message);
 *   // Handle the error, e.g., by using a fallback UUID generation method
 *   // or by logging the issue for diagnostics.
 *   // Example output: Failed to generate UUID: crypto.randomUUID is not available in this browser.
 * }
 *
 * // Basic usage if confident about the environment:
 * // const anotherId = uuid();
 * // console.info(anotherId);
 */
export function uuid() {
    if (typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // The existing comment below is a good reminder for potential future enhancements.
    // Fallback or error for older browsers could be added here if needed.
    throw new Error('crypto.randomUUID is not available in this browser.');
}
