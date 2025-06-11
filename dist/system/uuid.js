import crypto from "node:crypto";
/**
 * Generates a UUID (v4).
 * @returns {string} A new UUID.
 */
export function uuid() {
	return crypto.randomUUID();
}
