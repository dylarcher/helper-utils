import * as _crypto from 'node:crypto';

/**
 * Generate a hash of a string.
 * @param {string} data - The string to hash.
 * @param {string} [algorithm='sha256'] - The hashing algorithm (e.g., 'sha256', 'md5').
 * @param {'hex'|'base64'|'latin1'} [encoding='hex'] - The output encoding ('hex', 'base64', 'latin1').
 * @returns {string} The generated hash.
 */
export function generateHash(data, algorithm = 'sha256', encoding = 'hex') {
	return _crypto
		.createHash(algorithm)
		.update(data)
		.digest(/** @type {any} */ (encoding));
}
