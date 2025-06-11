/**
 * Generates a UUID (v4) using the browser's crypto API.
 * @returns {string} A new UUID.
 * @throws {Error} If crypto.randomUUID is not available.
 */
export function uuid(): string;
