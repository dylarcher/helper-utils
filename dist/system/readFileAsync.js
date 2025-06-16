import fs from 'node:fs/promises';
/**
 * Asynchronously reads the entire contents of a file.
 * This function is a wrapper around Node.js's `fs.readFile()`.
 * It is specific to Node.js environments.
 *
 * The file content is returned as a string, decoded using the specified encoding
 * (defaults to 'utf8').
 *
 * @param {string} filePath - The file system path to the file to be read.
 * @param {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} [encoding='utf8'] - Optional. The character encoding to use
 *   for decoding the file. Common values include 'utf8', 'ascii', 'base64'.
 *   If an encoding is provided, the promise resolves with a string; otherwise,
 *   Node.js's `fs.readFile` without an encoding option would resolve with a Buffer.
 *   However, this wrapper always specifies an encoding (defaulting to 'utf8'),
 *   so it always resolves with a string.
 * @returns {Promise<string>} A promise that resolves to a string containing the
 *   content of the file, decoded with the specified encoding.
 * @throws {Error} Throws an error if `fs.readFile` fails. Common reasons include:
 *   - `ENOENT`: The path specified in `filePath` does not exist.
 *   - `EISDIR`: The path specified in `filePath` is a directory.
 *   - `EACCES`: Permission denied to read the file.
 *   - Errors related to invalid encoding names.
 *
 * @example
 * // Create a dummy file for example:
 * // import { writeFile, rm } from 'node:fs/promises';
 * // async function setupExampleFile() {
 * //   await writeFile('./example_read.txt', 'Hello, Node.js world!', 'utf8');
 * // }
 * // async function cleanupExampleFile() {
 * //   await rm('./example_read.txt');
 * // }
 *
 * async function readMyFile() {
 *   // await setupExampleFile(); // Call if running example standalone
 *
 *   const pathToFile = './example_read.txt';
 *   try {
 *     const content = await readFileAsync(pathToFile);
 *     console.info(`Content of "${pathToFile}":\n${content}`);
 *     // Expected output: Content of "./example_read.txt":
 *     // Hello, Node.js world!
 *   } catch (error) {
 *     console.error(`Error reading file "${pathToFile}":`, error.message);
 *   }
 *
 *   const nonExistentFile = './non_existent_file.txt';
 *   try {
 *     await readFileAsync(nonExistentFile);
 *   } catch (error) {
 *     console.error(`Error reading file "${nonExistentFile}":`, error.message);
 *     // Expected output: Error reading file "./non_existent_file.txt": ENOENT: no such file or directory...
 *   }
 *
 *   // await cleanupExampleFile(); // Call if running example standalone
 * }
 *
 * // readMyFile();
 */
export async function readFileAsync(filePath, encoding = 'utf8') {
    // fs.readFile with an encoding option returns a string.
    // If encoding option was omitted or null, it would return a Buffer.
    // This implementation always provides an encoding, defaulting to 'utf8'.
    return /** @type {Promise<string>} */ (fs.readFile(filePath, { encoding }));
}
