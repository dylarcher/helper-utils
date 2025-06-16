import * as _crypto from 'node:crypto';
/**
 * Generates a cryptographic hash of a given string using the specified algorithm and encoding.
 * This function is specific to Node.js environments as it utilizes the `node:crypto` module.
 *
 * The input `data` is assumed to be a UTF-8 string. For other input encodings,
 * pre-processing or direct Buffer input (not supported by this function directly) would be needed.
 *
 * @param {string} data - The string data to hash.
 * @param {string} [algorithm='sha256'] - Optional. The hashing algorithm to use.
 *   Common values include 'sha256', 'sha512', 'md5' (MD5 is generally not recommended
 *   for security purposes but can be used for non-cryptographic checksums).
 *   A list of supported algorithms can be obtained via `crypto.getHashes()`.
 * @param {'hex' | 'base64' | 'latin1'} [encoding='hex'] - Optional. The encoding for the output hash string.
 *   Valid options are 'hex', 'base64', or 'latin1'.
 * @returns {string} The generated hash string in the specified encoding.
 * @throws {Error} Throws an error if the specified `algorithm` is not supported by
 *   the `node:crypto` module (e.g., `TypeError: Digest method not supported`).
 *
 * @example
 * // Default usage: SHA256 with hex encoding
 * const sha256HexHash = generateHash('Hello, world!');
 * console.info('SHA256 (hex):', sha256HexHash);
 * // e.g., SHA256 (hex): 315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3
 *
 * // Using SHA512 with base64 encoding
 * const sha512Base64Hash = generateHash('Hello, world!', 'sha512', 'base64');
 * console.info('SHA512 (base64):', sha512Base64Hash);
 * // e.g., SHA512 (base64): MZZgH4g4Fj/usUvL9L6L0ZldVmnStHzVJFmH8AhjM3z0x9oWOT8SMh8HkfFh3S0mJp6/JzBOVfLqYubUoNglcA==
 *
 * // Using MD5 with hex encoding (for checksums, not security)
 * const md5HexHash = generateHash('Important file content', 'md5', 'hex');
 * console.info('MD5 (hex):', md5HexHash);
 * // e.g., MD5 (hex): d8902458204515411991916188507968
 *
 * // Hashing an empty string
 * const hashOfEmpty = generateHash('');
 * console.info('SHA256 of empty string (hex):', hashOfEmpty);
 * // e.g., SHA256 of empty string (hex): e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
 *
 * // Example of an unsupported algorithm (would throw an error)
 * try {
 *   generateHash('test', 'unsupportedAlgorithm');
 * } catch (error) {
 *   console.error('Hashing error:', error.message); // e.g., Hashing error: Digest method not supported
 * }
 */
export function generateHash(data, algorithm = 'sha256', encoding = 'hex') {
    // The `encoding` type in `digest()` can be `crypto.BinaryToTextEncoding`
    // which includes 'hex', 'base64', 'latin1'. The JSDoc reflects this.
    // The `any` cast in the original code is acceptable if we trust the JSDoc's stricter type.
    return _crypto
        .createHash(algorithm)
        .update(data) // Assumes 'utf8' for string input by default
        .digest(/** @type {_crypto.BinaryToTextEncoding} */ (encoding));
}
