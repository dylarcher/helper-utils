import fs from 'node:fs/promises';

/**
 * Checks if a file or directory exists at the given path.
 * @param {string} filePath - The path to check.
 * @returns {Promise<boolean>} True if the path exists, false otherwise.
 */
export async function fileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}
