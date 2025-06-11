import crypto from 'node:crypto';
const ALGORITHM = 'aes-256-cbc';
/**
 * Encrypts text using AES-256-CBC.
 * @param {string} text - The text to encrypt.
 * @param {Buffer} key - The encryption key (must be 32 bytes for AES-256).
 * @param {Buffer} iv - The initialization vector (must be 16 bytes for AES-CBC).
 * @returns {string} The encrypted text in hex format, prefixed with the IV in hex.
 */
export function encrypt(text, key, iv) {
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Prepend IV for use in decryption
    return `${iv.toString('hex')}:${encrypted}`;
}
