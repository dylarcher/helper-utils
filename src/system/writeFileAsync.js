import fs from 'node:fs/promises';

/**
 * Asynchronously writes data to a file.
 * @param {string} filePath - The path to the file.
 * @param {string|Buffer} data - The data to write.
 * @param {BufferEncoding} [encoding='utf8'] - The file encoding.
 * @returns {Promise<void>} A promise that resolves when the file has been written.
 */
export async function writeFileAsync(filePath, data, encoding = 'utf8') {
	return fs.writeFile(filePath, data, { encoding });
}
