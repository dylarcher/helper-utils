import * as _crypto from 'node:crypto';
const ALGORITHM = 'aes-256-cbc';

/**
 * Decrypts text encrypted with AES-256-CBC.
 * Assumes the IV is prepended to the ciphertext, separated by a colon.
 * @param {string} encryptedTextWithIv - The encrypted text in hex format, prefixed with the IV in hex (e.g., "ivHex:encryptedHex").
 * @param {Buffer|string} key - The encryption key (must be 32 bytes for AES-256).
 * @returns {string} The decrypted text.
 */
export function decrypt(encryptedTextWithIv, key) {
	const [ivHex, encryptedText] = encryptedTextWithIv.split(':');
	if (!ivHex || !encryptedText) {
		throw new Error(
			'Invalid encrypted text format. Expected ivHex:encryptedHex',
		);
	}

	try {
		const iv = Buffer.from(ivHex, 'hex');
		const decipher = _crypto.createDecipheriv(ALGORITHM, key, iv);
		let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	} catch (/** @type {any} */ error) {
		// Rethrow any crypto errors, which would include wrong key errors
		let message = 'Unknown error';
		if (error && error.message) {
			message = error.message;
		}
		throw new Error(`Decryption failed: ${message}`);
	}
}
