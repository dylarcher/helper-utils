/**
 * Removes a directory.
 * For non-empty directories, set options.recursive to true.
 * @param {string} dirPath - The path of the directory to remove.
 * @param {{recursive?: boolean, force?: boolean}} [options={ recursive: false, force: false }] - Options for rm.
 * @returns {Promise<void>} A promise that resolves when the directory is removed.
 */
export function removeDirectory(dirPath: string, options?: {
    recursive?: boolean;
    force?: boolean;
}): Promise<void>;
