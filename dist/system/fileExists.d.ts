/**
 * Checks if a file or directory exists at the given path.
 * @param {string} filePath - The path to check.
 * @returns {Promise<boolean>} True if the path exists, false otherwise.
 */
export function fileExists(filePath: string): Promise<boolean>;
