import fs from 'node:fs/promises'

/**
 * Removes a directory.
 * For non-empty directories, set options.recursive to true.
 * @param {string} dirPath - The path of the directory to remove.
 * @param {{recursive?: boolean, force?: boolean}} [options={ recursive: false, force: false }] - Options for rm.
 * @returns {Promise<void>} A promise that resolves when the directory is removed.
 */
export async function removeDirectory(dirPath, options = { recursive: false, force: false }) {
    return fs.rm(dirPath, options)
}