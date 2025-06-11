/**
 * Lists the contents of a directory.
 * @param {string} dirPath - The path of the directory.
 * @returns {Promise<string[]>} A promise that resolves with an array of filenames.
 */
export function listDirectoryContents(dirPath: string): Promise<string[]>;
