import fs from 'node:fs/promises';

/**
 * Checks if a path is a directory.
 * @param {string} dirPath - The path to check.
 * @returns {Promise<boolean>} True if the path is a directory, false otherwise.
 */
export async function isDirectory(dirPath) {
	try {
		const stats = await fs.stat(dirPath);
		return stats.isDirectory();
	} catch {
		return false; // Path does not exist or other error
	}
}
