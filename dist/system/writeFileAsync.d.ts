/**
 * Asynchronously writes data to a file.
 * @param {string} filePath - The path to the file.
 * @param {string|Buffer} data - The data to write.
 * @param {string} [encoding='utf8'] - The file encoding.
 * @returns {Promise<void>} A promise that resolves when the file has been written.
 */
export function writeFileAsync(filePath: string, data: string | Buffer, encoding?: string): Promise<void>;
