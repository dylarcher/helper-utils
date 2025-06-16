import * as _crypto from 'node:crypto';
/**
 * Generates a UUID (Universally Unique Identifier) v4.
 * This function is specific to Node.js environments as it uses `node:crypto.randomUUID()`.
 *
 * By default, it ensures the generated UUID starts with a letter ('a' through 'f').
 * This is useful for compatibility with HTML/CSS identifiers (IDs) that often require
 * starting with a letter. If this modification occurs, the resulting string is a
 * v4-derived UUID, not a standard v4 UUID.
 *
 * @param {boolean} [forceLetterStart=true] - Optional. If `true` (default), and the initially
 *   generated UUID starts with a digit (0-9), the first character will be replaced with a
 *   randomly selected letter from 'a' to 'f'. If `false`, the UUID is returned as generated
 *   by `crypto.randomUUID()`.
 * @returns {string} A UUID v4 string. If `forceLetterStart` is true and the original UUID
 *   started with a number, the first character will be a letter ('a'-'f'). Otherwise,
 *   it's a standard UUID v4.
 *
 * @example
 * // Default behavior: ensure UUID starts with a letter
 * const id1 = uuid();
 * console.log('UUID (starts with letter):', id1);
 * // Example: if crypto.randomUUID() returned "0a1b2c..." -> id1 could be "a" + "a1b2c..."
 * // Example: if crypto.randomUUID() returned "fa1b2c..." -> id1 would be "fa1b2c..."
 *
 * // Get a standard UUID v4 without modification
 * const id2 = uuid(false);
 * console.log('UUID (standard v4):', id2);
 * // Example: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx" (can start with number or letter a-f)
 *
 * // Another example with forceLetterStart (default)
 * for (let i = 0; i < 5; i++) {
 *   // console.log(`Forced letter start attempt ${i + 1}: ${uuid()}`);
 * }
 *
 * // Another example with forceLetterStart=false
 * for (let i = 0; i < 5; i++) {
 *   // console.log(`Standard UUID attempt ${i + 1}: ${uuid(false)}`);
 * }
 */
export function uuid(forceLetterStart = true) {
	let result = _crypto.randomUUID(); // Generates a standard v4 UUID
	// If forceLetterStart is true and the UUID begins with a digit (0-9)
	if (forceLetterStart && /^[0-9]/.test(result)) {
		// Replace the first character with a random letter from 'a' to 'f'.
		// This makes the ID more compatible with CSS selectors or HTML IDs
		// that might have restrictions on starting with a number, while keeping it hex-like.
		const letters = 'abcdef'; // Available letters for replacement
		const randomIndex = Math.floor(Math.random() * letters.length);
		result = letters[randomIndex] + result.substring(1);
	}
	return result;
}
//# sourceMappingURL=uuid.js.map
