import * as _crypto from 'node:crypto';
const ALGORITHM = 'aes-256-cbc'; // AES-256 uses a 32-byte key and a 16-byte IV.
/**
 * Decrypts text that was encrypted using AES-256-CBC.
 * This function assumes the initialization vector (IV) is prepended to the ciphertext,
 * with both parts hex-encoded and separated by a colon (':').
 * This is a Node.js specific utility using the `node:crypto` module.
 *
 * **Important:** Secure key management is critical. Ensure keys are handled appropriately.
 *
 * @param {string} encryptedTextWithIv - The encrypted data in the format "ivHex:encryptedHex".
 *   Both the IV and the encrypted text are expected to be in hexadecimal format.
 *   The IV should be 16 bytes (32 hex characters).
 * @param {Buffer | string} key - The encryption key. This must be a 32-byte Buffer
 *   for AES-256. If a string is provided, it should be a hex-encoded string representing
 *   32 bytes, or a string that directly converts to 32 bytes (though using a Buffer is safer).
 *   Using a key of incorrect length will result in an error.
 * @returns {string} The decrypted text, decoded as UTF-8.
 * @throws {Error} Throws an error if:
 *   - The `encryptedTextWithIv` is not in the expected "ivHex:encryptedHex" format.
 *   - The IV, key, or ciphertext is invalid (e.g., incorrect length, bad hex encoding).
 *   - Decryption fails due to issues like incorrect key, corrupted ciphertext (resulting in bad padding),
 *     or other cryptographic errors. The error message will typically be prefixed with "Decryption failed:".
 *
 * @example
 * // Key should be a 32-byte Buffer. Example: from a hex string
 * const keyHex = '603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4';
 * const encryptionKey = Buffer.from(keyHex, 'hex'); // 32 bytes
 *
 * // Example encrypted data (IV_hex:Ciphertext_hex)
 * // This would typically come from a corresponding encrypt function.
 * const encryptedData = '0123456789abcdef0123456789abcdef:abcdef0123456789abcdef0123456789'; // Replace with actual encrypted data
 *
 * try {
 *   // const decryptedText = decrypt(encryptedData, encryptionKey);
 *   // console.info('Decrypted:', decryptedText);
 *
 *   // Example with a known encrypted value (assuming 'encrypt' function is compatible)
 *   // const originalText = 'Hello, world!';
 *   // const { encrypt } = require('./encrypt'); // Assuming encrypt.js is in the same directory
 *   // const anEncryptedValue = encrypt(originalText, encryptionKey);
 *   // console.info('Encrypted for test:', anEncryptedValue);
 *   // const decryptedOutput = decrypt(anEncryptedValue, encryptionKey);
 *   // console.info('Decrypted output should be "Hello, world!":', decryptedOutput); // "Hello, world!"
 *
 * } catch (error) {
 *   console.error('Decryption error:', error.message);
 *   // Handle errors, e.g., if the key is wrong or data is corrupt.
 *   // Example: "Decryption failed: Invalid key length" or "Decryption failed: Bad input string"
 *   // or "Decryption failed: error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt"
 * }
 *
 * // Example of incorrect format
 * try {
 *   decrypt('invalidformat', encryptionKey);
 * } catch (error) {
 *   console.error(error.message); // "Invalid encrypted text format. Expected ivHex:encryptedHex"
 * }
 */
export function decrypt(encryptedTextWithIv, key) {
    const [ivHex, encryptedText] = encryptedTextWithIv.split(':');
    if (!ivHex || !encryptedText) {
        throw new Error('Invalid encrypted text format. Expected ivHex:encryptedHex');
    }
    try {
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = _crypto.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch ( /** @type {any} */error) {
        // Rethrow any crypto errors, which would include wrong key errors
        let message = 'Unknown error';
        if (error && error.message) {
            message = error.message;
        }
        throw new Error(`Decryption failed: ${message}`);
    }
}
//# sourceMappingURL=decrypt.js.map