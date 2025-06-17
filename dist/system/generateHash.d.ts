/**
 * Generates a cryptographic hash (digest) of a given string using a specified algorithm
 * and output encoding. This function is specific to Node.js environments as it leverages
 * the `node:crypto` module.
 *
 * The input `data` string is hashed using UTF-8 encoding by default when passed to
 * the `hash.update()` method.
 *
 * It's important to choose an algorithm appropriate for the use case:
 * - For security purposes (e.g., password hashing - though salting and key stretching via
 *   `crypto.scrypt` or `crypto.pbkdf2` is recommended for passwords, not direct hashing),
 *   strong algorithms like 'sha256' or 'sha512' should be used.
 * - For non-cryptographic purposes like checksums or simple data integrity checks,
 *   faster (but less secure) algorithms like 'md5' might be acceptable, though MD5
 *   is considered cryptographically broken and should not be used for security.
 *
 * @param {string} data - The string data to be hashed. It's treated as UTF-8.
 * @param {string} [algorithm='sha256'] - Optional. The hashing algorithm to use.
 *   Examples: 'sha256' (default), 'sha512', 'sha1', 'md5'.
 *   To get a list of all supported algorithms on the current Node.js version,
 *   you can use `crypto.getHashes()`.
 * @param {'hex' | 'base64' | 'latin1'} [encoding='hex'] - Optional. The encoding for the
 *   returned hash string.
 *   - `'hex'`: Represents bytes as a sequence of hexadecimal characters (0-9, a-f).
 *   - `'base64'`: Base64 encoding.
 *   - `'latin1'`: Interprets each byte of the hash as a Latin-1 character (binary string).
 * @returns {string} The generated cryptographic hash as a string, formatted according
 *                   to the specified `encoding`.
 * @throws {Error} Throws an error if the specified `algorithm` is not supported by
 *   the `node:crypto` module (e.g., a `TypeError` with a message like "Digest method not supported").
 *   It may also throw errors for other crypto-related issues.
 *
 * @example
 * // Example 1: Default usage (SHA256 algorithm, hex encoding)
 * const text1 = "Hello, secure world!";
 * const hash1 = generateHash(text1);
 * console.log(`SHA256 (hex) of "${text1}": ${hash1}`);
 * // Example output: ... (a 64-character hex string)
 *
 * // Example 2: Using SHA512 algorithm and base64 encoding
 * const text2 = "Another piece of data.";
 * const hash2 = generateHash(text2, 'sha512', 'base64');
 * console.log(`SHA512 (base64) of "${text2}": ${hash2}`);
 * // Example output: ... (a base64 encoded string)
 *
 * // Example 3: Using MD5 algorithm (typically for non-security checksums)
 * const fileContent = "This could be the content of a file.";
 * const md5Checksum = generateHash(fileContent, 'md5', 'hex');
 * console.log(`MD5 (hex) checksum for content: ${md5Checksum}`);
 * // Example output: ... (a 32-character hex string)
 *
 * // Example 4: Hashing an empty string
 * const hashOfEmptyString = generateHash('');
 * console.log('SHA256 (hex) of empty string:', hashOfEmptyString);
 * // Output: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
 *
 * // Example 5: Attempting to use an unsupported algorithm (will throw an error)
 * try {
 *   const invalidHash = generateHash('test data', 'nonExistentAlgorithm');
 *   console.log(invalidHash); // This line will not be reached.
 * } catch (error) {
 *   console.error(`Error during hashing: ${error.message}`);
 *   // Example output: "Error during hashing: Digest method not supported"
 * }
 */
export function generateHash(data: string, algorithm?: string, encoding?: "hex" | "base64" | "latin1"): string;
