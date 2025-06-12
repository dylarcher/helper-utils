import fs from "node:fs/promises";

/**
 * Removes a directory.
 * For non-empty directories, set options.recursive to true.
 * @param {string} dirPath - The path of the directory to remove.
 * @param {{recursive?: boolean, force?: boolean}} [options={ recursive: true, force: false }] - Options for rm.
 * @returns {Promise<void>} A promise that resolves when the directory is removed.
 */
export async function removeDirectory(
	dirPath,
	options = { recursive: true, force: false },
) {
	// Check if the path is actually a directory before removing
	try {
		const stats = await fs.stat(dirPath);
		if (!stats.isDirectory()) {
			throw new Error(`Path is not a directory: ${dirPath}`);
		}
	} catch (error) {
		// If force is true, ignore stat errors (path doesn't exist)
		if (!options.force) {
			throw error;
		}
	}
	
	// For directories, we generally need recursive: true to remove them
	// Even empty directories require recursive: true with fs.rm
	const finalOptions = { recursive: true, force: false, ...options };
	
	return fs.rm(dirPath, finalOptions);
}
