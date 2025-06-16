import fs from 'node:fs/promises';
/**
 * Asynchronously creates a directory. This function is a wrapper around Node.js's `fs.mkdir`.
 *
 * By default, it creates directories recursively (`options.recursive = true`).
 *
 * @param {string} dirPath - The file system path of the directory to create.
 * @param {import('node:fs').MakeDirectoryOptions & {recursive?: boolean}} [options={ recursive: true }] -
 *   Optional. Configuration options for `fs.mkdir`. Defaults to `{ recursive: true }`.
 *   Common options include `recursive` (boolean) and `mode` (number).
 * @returns {Promise<string | undefined>} A promise that resolves when the directory is created.
 *   - If `options.recursive` is `true`, the promise resolves with the path of the first
 *     directory created, or `undefined` if no new directory was created (e.g., path already existed).
 *   - If `options.recursive` is `false` (or not set and the default is changed), the promise
 *     resolves with `undefined`.
 * @throws {Error} Throws an error if `fs.mkdir` fails. Common reasons include:
 *   - `EACCES`: Permission denied.
 *   - `EEXIST`: Path already exists and is not a directory (and `recursive` is `false`).
 *               Note: if path exists and is a directory, `fs.mkdir` with `recursive: true`
 *               does not throw an error.
 *   - `ENOENT`: A component of the path prefix does not exist (and `recursive` is `false`).
 *   - `EINVAL`: Invalid path or options.
 *
 * @example
 * // Basic usage (recursive by default)
 * async function manageMyDirectory() {
 *   try {
 *     const newDirPath = await createDirectory('./my-app/new-folder');
 *     if (newDirPath) {
 *       console.info(`Directory created at: ${newDirPath}`);
 *     } else {
 *       console.info('Directory already existed or no new directory path returned.');
 *     }
 *
 *     // Create a directory with specific mode (non-recursive)
 *     // First ensure './my-app' exists if using non-recursive for a subfolder
 *     await createDirectory('./my-app'); // Ensure parent exists
 *     await createDirectory('./my-app/another-folder', { recursive: false, mode: 0o755 });
 *     console.info('Another folder created with specific mode.');
 *
 *   } catch (error) {
 *     console.error(`Failed to create directory: ${error.message}`);
 *     // Handle specific error codes if necessary
 *     if (error.code === 'EEXIST') {
 *       console.warn('Path already exists and is not a directory, or recursive is false.');
 *     }
 *   }
 * }
 *
 * // manageMyDirectory();
 */
export async function createDirectory(dirPath, options = { recursive: true }) {
	// fs.mkdir with recursive: true by default will not throw if the directory already exists.
	// It returns the first directory path created, or undefined if all paths already existed.
	return fs.mkdir(dirPath, options);
}
//# sourceMappingURL=createDirectory.js.map
