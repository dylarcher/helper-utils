import fs from "node:fs/promises";
/**
 * Creates a directory.
 * @param {string} dirPath - The path of the directory to create.
 * @param {{recursive?: boolean}} [options={ recursive: true }] - Options for mkdir (e.g., recursive).
 * @returns {Promise<string | undefined>} A promise that resolves with the first directory path created if recursive, or undefined.
 */
export async function createDirectory(dirPath, options = { recursive: true }) {
	return fs.mkdir(dirPath, options);
}
