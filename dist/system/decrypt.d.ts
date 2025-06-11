/**
 * Decrypts text encrypted with AES-256-CBC.
 * Assumes the IV is prepended to the ciphertext, separated by a colon.
 * @param {string} encryptedTextWithIv - The encrypted text in hex format, prefixed with the IV in hex (e.g., "ivHex:encryptedHex").
 * @param {Buffer} key - The encryption key (must be 32 bytes for AES-256).
 * @returns {string} The decrypted text.
 */
export function decrypt(encryptedTextWithIv: string, key: Buffer): string;
