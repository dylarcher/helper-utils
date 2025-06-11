/**
 * Asynchronously reads a file.
 * @param {string} filePath - The path to the file.
 * @param {string} [encoding='utf8'] - The file encoding.
 * @returns {Promise<string>} A promise that resolves with the file content.
 */
export function readFileAsync(
	filePath: string,
	encoding?: string,
): Promise<string>;
