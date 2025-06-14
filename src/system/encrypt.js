import * as _crypto from 'node:crypto';

const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypts text using AES-256-CBC.
 * @param {string} text - The text to encrypt.
 * @param {Buffer} key - The encryption key (must be 32 bytes for AES-256).
 * @param {Buffer} iv - The initialization vector (must be 16 bytes for AES-CBC).
 * @returns {string} The encrypted text in hex format, prefixed with the IV in hex.
 */
export function encrypt(text, key, iv) {
	// Validate input types
	if (!Buffer.isBuffer(key)) {
		throw new TypeError('Key must be a buffer');
	}
	if (!Buffer.isBuffer(iv)) {
		throw new TypeError('IV must be a buffer');
	}

	// Validate key length
	if (key.length !== 32) {
		throw new RangeError('Invalid key length');
	}

	// Validate IV length
	if (iv.length !== 16) {
		throw new TypeError('Invalid IV length');
	}

	const cipher = _crypto.createCipheriv(ALGORITHM, key, iv);
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	// Prepend IV for use in decryption
	return `${iv.toString('hex')}:${encrypted}`;
}
