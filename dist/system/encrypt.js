import * as _crypto from 'node:crypto';
const ALGORITHM = 'aes-256-cbc'; // AES-256 uses a 32-byte key and a 16-byte IV.
/**
 * Encrypts text using AES-256-CBC algorithm.
 * The Initialization Vector (IV) used for encryption is prepended to the output ciphertext,
 * with both parts hex-encoded and separated by a colon (':').
 * This is a Node.js specific utility using the `node:crypto` module.
 *
 * **Important Security Considerations:**
 * - **Key Management**: Ensure the `key` is securely managed and is a cryptographically strong key.
 *   It must be exactly 32 bytes for AES-256.
 * - **IV Generation**: A unique, cryptographically random Initialization Vector (IV)
 *   must be used for each encryption operation with the same key. The `iv` parameter
 *   must be exactly 16 bytes for AES-CBC. Do NOT reuse IVs with the same key.
 *
 * @param {string} text - The plaintext string to encrypt (assumed to be UTF-8).
 * @param {Buffer} key - The encryption key: a 32-byte Buffer.
 * @param {Buffer} iv - The Initialization Vector: a 16-byte Buffer.
 *   It is crucial to use a unique, cryptographically random IV for each encryption.
 * @returns {string} The encrypted data in the format "ivHex:encryptedHex".
 *   Both the IV and the ciphertext are hex-encoded. This format is compatible
 *   with the corresponding `decrypt` function.
 * @throws {Error} Throws an error if:
 *   - The key or IV is of incorrect length or invalid type.
 *   - Encryption fails due to other cryptographic errors from `node:crypto` module.
 *
 * @example
 * // import { randomBytes } from 'node:crypto'; // For generating key and IV
 *
 * // Generate a secure 32-byte key (store this securely and do not hardcode in production)
 * // const encryptionKey = randomBytes(32);
 * const exampleKeyHex = '603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4';
 * const encryptionKey = Buffer.from(exampleKeyHex, 'hex');
 *
 * // Generate a unique 16-byte IV for each encryption
 * // const initVector = randomBytes(16);
 * const exampleIvHex = '0123456789abcdef0123456789abcdef'; // In real use, generate randomly
 * const initVector = Buffer.from(exampleIvHex, 'hex');
 *
 * const originalText = 'This is a secret message!';
 *
 * try {
 *   const encryptedOutput = encrypt(originalText, encryptionKey, initVector);
 *   console.info('Encrypted:', encryptedOutput);
 *   // Example output: 0123456789abcdef0123456789abcdef:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   // (ciphertext part will vary)
 *
 *   // This output can be passed to the decrypt function:
 *   // const { decrypt } = require('./decrypt'); // Assuming decrypt.js
 *   // const decryptedText = decrypt(encryptedOutput, encryptionKey);
 *   // console.info('Decrypted:', decryptedText); // "This is a secret message!"
 * } catch (error) {
 *   console.error('Encryption failed:', error.message);
 *   // Example: "Invalid key length" or "Invalid IV length"
 * }
 *
 * // Example of trying to use invalid key/IV length
 * try {
 *   const shortKey = Buffer.from('shortkey');
 *   encrypt(originalText, shortKey, initVector);
 * } catch (error) {
 *   console.error('Error with short key:', error.message); // Error: Invalid key length
 * }
 */
export function encrypt(text, key, iv) {
    // Validate input types
    if (!Buffer.isBuffer(key)) {
        throw new TypeError('Key must be a buffer');
    }
    if (!Buffer.isBuffer(iv)) {
        throw new TypeError('IV must be a buffer');
    }
    // Validate key and IV lengths to provide clearer errors before crypto module does.
    if (key.length !== 32) {
        throw new Error('Invalid key length. Key must be 32 bytes for AES-256-CBC.');
    }
    if (iv.length !== 16) {
        throw new Error('Invalid IV length. IV must be 16 bytes for AES-CBC.');
    }
    const cipher = _crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Prepend IV (hex-encoded) for use in decryption
    return `${iv.toString('hex')}:${encrypted}`;
}
//# sourceMappingURL=encrypt.js.map