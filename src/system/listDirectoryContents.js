import fs from 'node:fs/promises';

/**
 * Asynchronously lists the contents of a directory, yielding each item one by one.
 * @param {string} dirPath - The path of the directory.
 * @yields {string} The name of a file or subdirectory within the specified directory.
 * @throws {Error} If the directory cannot be read (e.g., path does not exist, permissions error).
 * @returns {AsyncGenerator<string, void, undefined>} An async generator that yields the names of files and subdirectories.
 */
export async function* listDirectoryContents(dirPath) {
	const items = await fs.readdir(dirPath);
	for (const item of items) {
		yield item;
	}
}
