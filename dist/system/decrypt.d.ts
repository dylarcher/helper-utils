/**
 * Decrypts text that was previously encrypted using the AES-256-CBC algorithm.
 * This function is designed for Node.js environments, utilizing the `node:crypto` module.
 *
 * It expects the input `encryptedTextWithIv` to be a string where:
 * 1. The Initialization Vector (IV), hex-encoded, is prepended to the actual ciphertext.
 * 2. The IV and ciphertext are separated by a colon (':').
 *    Format: `"ivInHexFormat:ciphertextInHexFormat"`
 *
 * **Security Critical:**
 * - The `key` used for decryption must be the exact same 32-byte key used during encryption.
 * - Secure management and handling of encryption keys are paramount. Keys should be stored
 *   and transmitted securely, ideally not hardcoded directly in application source code for
 *   production systems. Consider using environment variables or dedicated secret management services.
 *
 * @param {string} encryptedTextWithIv - The encrypted data string, formatted as "ivHex:encryptedHex".
 *   - `ivHex`: The 16-byte Initialization Vector, encoded as a 32-character hexadecimal string.
 *   - `encryptedHex`: The encrypted ciphertext, also hex-encoded.
 * @param {Buffer | string} key - The secret encryption key used for decryption.
 *   This **must** be a 32-byte (256-bit) Buffer for AES-256.
 *   If a string is provided, it should ideally be a 64-character hex-encoded string representing
 *   32 bytes of data. Other string encodings might lead to unexpected key lengths or values.
 *   Using a Buffer created from a secure source is strongly recommended.
 * @returns {string} The decrypted text, decoded as a UTF-8 string.
 * @throws {Error} Throws an error under various conditions:
 *   - If `encryptedTextWithIv` is not in the expected "ivHex:encryptedHex" format.
 *   - If the IV derived from `ivHex` is not the correct length (16 bytes for AES-CBC).
 *   - If the `key` is not the correct length (32 bytes for AES-256).
 *   - If decryption fails due to an incorrect key, corrupted ciphertext (leading to padding errors),
 *     or other cryptographic issues. The error message will typically be prefixed with "Decryption failed:".
 *     Common underlying crypto errors include "Invalid key length", "Invalid IV length",
 *     or "error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt" (often indicates wrong key or corrupted data).
 *
 * @example
 * // Ensure the key is a 32-byte Buffer.
 * // Example: creating a key from a secure random source or a pre-shared hex string.
 * const keyHex = 'YOUR_SECURE_32_BYTE_KEY_IN_HEX_FORMAT_64_CHARS_LONG'; // Replace with your actual key
 * // const encryptionKey = Buffer.from(keyHex, 'hex');
 * // For testing, you can use a fixed key, but for production, generate and store securely:
 * const testKey = _crypto.scryptSync('password', 'salt', 32); // Example key derivation
 *
 * // This encryptedData would typically come from the `encrypt` function.
 * // Format: "ivHex:encryptedHex"
 * const exampleEncryptedData = "c7a47a087f3e9d2b8c6f1a0d3b5e8c4f:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"; // Replace with actual data
 *
 * try {
 *   // Assume `exampleEncryptedData` was produced by the corresponding `encrypt` function using `testKey`
 *   // const originalText = "This is a secret message.";
 *   // const encryptedForTest = encrypt(originalText, testKey); // from your encrypt function
 *   // console.log(`Encrypted: ${encryptedForTest}`);
 *   // const decryptedText = decrypt(encryptedForTest, testKey);
 *   // console.log('Decrypted Text:', decryptedText); // Should be "This is a secret message."
 * } catch (error) {
 *   console.error('Decryption Process Error:', error.message);
 *   // Example errors:
 *   // "Invalid encrypted text format. Expected ivHex:encryptedHex"
 *   // "Decryption failed: Invalid key length"
 *   // "Decryption failed: error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt"
 * }
 *
 * // Example demonstrating an invalid format error:
 * try {
 *   decrypt('thisisnotvalidformat', testKey);
 * } catch (error) {
 *   console.error('Format Error Example:', error.message);
 *   // Output: "Format Error Example: Invalid encrypted text format. Expected ivHex:encryptedHex"
 * }
 */
export function decrypt(encryptedTextWithIv: string, key: Buffer | string): string;
