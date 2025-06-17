// Import the full 'crypto' module from Node.js, aliasing it as `_crypto`.
import * as _crypto from 'node:crypto';
// Define the encryption algorithm to be used.
// 'aes-256-cbc' specifies:
// - AES (Advanced Encryption Standard)
// - 256: Using a 256-bit (32-byte) encryption key.
// - CBC (Cipher Block Chaining): A mode of operation that requires an Initialization Vector (IV).
// For AES, the block size is 128 bits (16 bytes), so the IV must also be 16 bytes.
const ALGORITHM = 'aes-256-cbc';
/**
 * Encrypts a given plaintext string using the AES-256-CBC algorithm.
 * This function is designed for Node.js environments, utilizing the `node:crypto` module.
 *
 * The resulting output string includes the Initialization Vector (IV) used for encryption,
 * prepended to the ciphertext. Both the IV and the ciphertext are hex-encoded and
 * separated by a colon (':'). Format: `"ivInHexFormat:ciphertextInHexFormat"`.
 * This format is designed to be compatible with the corresponding `decrypt` function.
 *
 * **Security Critical:**
 * - **Key (`key`)**: Must be a securely generated, 32-byte (256-bit) Buffer. Strong key management
 *   practices are essential. Do not hardcode production keys.
 * - **Initialization Vector (`iv`)**: Must be a 16-byte (128-bit) Buffer. For CBC mode,
 *   it is **critical** that a unique, cryptographically random IV is used for **every**
 *   encryption operation performed with the same key. Reusing an IV with the same key
 *   severely undermines the security of the encryption. The caller is responsible for
 *   generating this unique IV (e.g., using `crypto.randomBytes(16)`).
 *
 * @param {string} text - The plaintext string to be encrypted. It is assumed to be UTF-8 encoded.
 * @param {Buffer} key - The secret encryption key. **Must be a 32-byte Buffer** for AES-256.
 * @param {Buffer} iv - The Initialization Vector. **Must be a 16-byte Buffer** for AES-CBC.
 *                      This IV must be unique and cryptographically random for each encryption
 *                      operation with the same key.
 * @returns {string} A string containing the hex-encoded IV and the hex-encoded ciphertext,
 *                   concatenated with a colon (e.g., "ivHex:ciphertextHex").
 * @throws {TypeError} If `key` or `iv` is not a Buffer.
 * @throws {Error} If `key` is not 32 bytes long or `iv` is not 16 bytes long.
 *                 Also throws errors from the underlying `node:crypto` module for other
 *                 cryptographic issues (e.g., if `crypto.createCipheriv` fails).
 *
 * @example
 * // Import randomBytes for generating secure key and IV in real applications
 * // import { randomBytes } from 'node:crypto';
 *
 * // For demonstration, using fixed hex strings for key and IV.
 * // In production, `encryptionKey` should be securely managed, and `initVector`
 * // should be newly generated for each encryption using `_crypto.randomBytes(16)`.
 * const exampleKeyHex = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'; // 64 hex chars = 32 bytes
 * const encryptionKey = Buffer.from(exampleKeyHex, 'hex');
 *
 * const exampleIvHex = '00112233445566778899aabbccddeeff'; // 32 hex chars = 16 bytes
 * const initVector = Buffer.from(exampleIvHex, 'hex'); // In real use: _crypto.randomBytes(16)
 *
 * const originalText = "This is a secret message to be encrypted!";
 *
 * try {
 *   const encryptedOutput = encrypt(originalText, encryptionKey, initVector);
 *   console.log('Encrypted Data:', encryptedOutput);
 *   // Example output (ciphertext part will vary if IV is random):
 *   // Encrypted Data: 00112233445566778899aabbccddeeff:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *
 *   // This `encryptedOutput` can then be passed to the `decrypt` function
 *   // along with the same `encryptionKey`.
 *   // const decryptedText = decrypt(encryptedOutput, encryptionKey);
 *   // console.log('Decrypted Text:', decryptedText); // Should match originalText
 * } catch (error) {
 *   console.error('Encryption Process Error:', error.message);
 *   // Example errors:
 *   // "Key must be a buffer"
 *   // "Invalid key length. Key must be 32 bytes for AES-256-CBC."
 *   // "Invalid IV length. IV must be 16 bytes for AES-CBC."
 * }
 *
 * // Example of generating a unique IV for each encryption:
 * // const text1 = "First message";
 * // const iv1 = _crypto.randomBytes(16);
 * // const encrypted1 = encrypt(text1, encryptionKey, iv1);
 * // console.log(`Encrypted 1: ${encrypted1}`);
 *
 * // const text2 = "Second message";
 * // const iv2 = _crypto.randomBytes(16); // Crucially, a NEW IV
 * // const encrypted2 = encrypt(text2, encryptionKey, iv2);
 * // console.log(`Encrypted 2: ${encrypted2}`);
 */
export function encrypt(text, key, iv) {
    // Step 1: Validate the types of the key and IV.
    // They must be Node.js Buffer objects.
    if (!Buffer.isBuffer(key)) {
        throw new TypeError('Key must be a buffer');
    }
    if (!Buffer.isBuffer(iv)) {
        throw new TypeError('IV must be a buffer');
    }
    // Step 2: Validate the lengths of the key and IV.
    // For AES-256-CBC:
    // - The key must be 32 bytes (256 bits).
    // - The IV must be 16 bytes (128 bits, matching the AES block size).
    // Providing these checks before calling crypto functions gives clearer error messages.
    if (key.length !== 32) {
        throw new Error('Invalid key length. Key must be 32 bytes for AES-256-CBC.');
    }
    if (iv.length !== 16) {
        throw new Error('Invalid IV length. IV must be 16 bytes for AES-CBC.');
    }
    // Step 3: Create a Cipher instance.
    // `_crypto.createCipheriv()` initializes the cipher object with:
    // - `ALGORITHM`: The encryption algorithm (e.g., 'aes-256-cbc').
    // - `key`: The secret encryption key (Buffer).
    // - `iv`: The Initialization Vector (Buffer).
    // This function can throw errors if, for example, the algorithm is not supported
    // or if key/IV lengths are incorrect despite prior checks (though unlikely if checks are correct).
    const cipher = _crypto.createCipheriv(ALGORITHM, key, iv);
    // Step 4: Encrypt the plaintext.
    // `cipher.update()` processes chunks of the plaintext.
    // - `text`: The plaintext string to encrypt.
    // - `'utf8'`: Specifies that the input `text` is UTF-8 encoded.
    // - `'hex'`: Specifies that the encrypted output should be hex-encoded.
    // This can be called multiple times if the data is being streamed.
    let encrypted = cipher.update(text, 'utf8', 'hex');
    // `cipher.final()` finalizes the encryption process. It encrypts any remaining
    // buffered data and applies necessary padding (PKCS#7 padding is standard for AES-CBC).
    // The argument `'hex'` specifies the encoding for the final output block.
    encrypted += cipher.final('hex');
    // Step 5: Format and return the output.
    // The IV (converted to a hex string) is prepended to the hex-encoded ciphertext,
    // separated by a colon. This allows the `decrypt` function to easily extract the IV
    // needed for decryption.
    return `${iv.toString('hex')}:${encrypted}`;
}
//# sourceMappingURL=encrypt.js.map