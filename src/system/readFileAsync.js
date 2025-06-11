import fs from "node:fs/promises";

/**
 * Asynchronously reads a file.
 * @param {string} filePath - The path to the file.
 * @param {string} [encoding='utf8'] - The file encoding.
 * @returns {Promise<string>} A promise that resolves with the file content.
 */
export async function readFileAsync(filePath, encoding = "utf8") {
	return fs.readFile(filePath, encoding);
}
