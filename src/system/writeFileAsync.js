import fs from 'node:fs/promises';

/**
 * Asynchronously writes data to a file, replacing the file if it already exists.
 * This function is a wrapper around Node.js's `fs.writeFile()`.
 * It is specific to Node.js environments.
 *
 * If `data` is a string, it is written using the specified `encoding` (defaults to 'utf8').
 * If `data` is a Buffer, the `encoding` parameter is ignored.
 * The function will create the file if it does not exist, or overwrite it if it does.
 * Intermediate directories in `filePath` must exist, otherwise an `ENOENT` error will occur.
 *
 * @param {string} filePath - The path to the file where data will be written.
 * @param {string | Buffer} data - The data to write to the file. Can be a string or a Buffer.
 * @param {'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex'} [encoding='utf8'] - Optional. The character encoding to use
 *   if `data` is a string. This parameter is ignored if `data` is a Buffer.
 * @returns {Promise<void>} A promise that resolves when the file has been successfully written.
 *   The promise does not resolve with any value.
 * @throws {Error} Throws an error if `fs.writeFile` fails. Common reasons include:
 *   - `ENOENT`: A directory component in `filePath` does not exist, or the file itself
 *               is a directory and cannot be overwritten as a file.
 *   - `EISDIR`: The `filePath` refers to a directory on some systems when attempting to write.
 *   - `EACCES`: Permission denied to write to the file at `filePath`.
 *   - Errors related to invalid encoding names if `data` is a string.
 *
 * @example
 * // import { Buffer } from 'node:buffer';
 * // import { rm } from 'node:fs/promises'; // For cleanup in standalone example
 *
 * async function manageMyFile() {
 *   const textFilePath = './example_write.txt';
 *   const bufferFilePath = './example_write_buffer.bin';
 *
 *   // Write a string to a file
 *   try {
 *     await writeFileAsync(textFilePath, 'Hello, Node.js from writeFileAsync!');
 *     console.log(`Successfully wrote to ${textFilePath}`);
 *
 *     // Overwrite the file
 *     await writeFileAsync(textFilePath, 'Overwritten content.', 'utf16le');
 *     console.log(`Successfully overwrote ${textFilePath} with new content and encoding.`);
 *   } catch (error) {
 *     console.error(`Error writing to ${textFilePath}:`, error.message);
 *   }
 *
 *   // Write Buffer data to a file
 *   try {
 *     const bufferData = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
 *     await writeFileAsync(bufferFilePath, bufferData);
 *     console.log(`Successfully wrote Buffer to ${bufferFilePath}`);
 *   } catch (error) {
 *     console.error(`Error writing to ${bufferFilePath}:`, error.message);
 *   }
 *
 *   // Example of an error (e.g., trying to write to a path where a directory doesn't exist)
 *   const badPath = './non_existent_dir/output.txt';
 *   try {
 *     await writeFileAsync(badPath, 'Test data');
 *   } catch (error) {
 *     console.error(`Error writing to "${badPath}":`, error.message);
 *     // Expected: ENOENT: no such file or directory...
 *   }
 *
 *   // Cleanup (optional, for standalone execution)
 *   // try { await rm(textFilePath); await rm(bufferFilePath); } catch(e) {}
 * }
 *
 * // manageMyFile();
 */
export async function writeFileAsync(filePath, data, encoding = 'utf8') {
	// fs.writeFile will overwrite the file if it already exists.
	// If `data` is a Buffer, the encoding option is ignored.
	// If `data` is a string, it will be encoded using the specified encoding (default 'utf8').
	return fs.writeFile(filePath, data, { encoding });
}
