/**
 * Generates a UUID (v4) using the browser's crypto API.
 * @returns {string} A new UUID.
 * @throws {Error} If crypto.randomUUID is not available.
 */
export function uuid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }
    // Fallback or error for older browsers could be added here if needed.
    throw new Error('crypto.randomUUID is not available in this browser.')
}