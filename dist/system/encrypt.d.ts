/**
 * Encrypts text using AES-256-CBC.
 * @param {string} text - The text to encrypt.
 * @param {Buffer} key - The encryption key (must be 32 bytes for AES-256).
 * @param {Buffer} iv - The initialization vector (must be 16 bytes for AES-CBC).
 * @returns {string} The encrypted text in hex format, prefixed with the IV in hex.
 */
export function encrypt(text: string, key: Buffer, iv: Buffer): string;
