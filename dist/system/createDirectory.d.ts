/**
 * Asynchronously creates a directory at the specified `dirPath`.
 * This function is essentially a wrapper around the Node.js `fs.promises.mkdir()` method,
 * providing a convenient default for recursive directory creation.
 *
 * By default, this function will create directories recursively (i.e., if parent directories
 * in the path do not exist, they will be created). This is controlled by the `recursive: true`
 * option, which is enabled by default.
 *
 * If `recursive: true` (the default):
 *   - If the directory already exists, the Promise resolves successfully, and no error is thrown.
 *     The resolved value will be `undefined` in this case (or the path of the first
 *     directory actually created if some part of the path was new).
 *   - It creates parent directories as needed.
 *
 * If `recursive: false` is passed in options:
 *   - The function will throw an error if any parent directory in the path does not exist.
 *   - It will also throw an error (typically `EEXIST`) if the target `dirPath` itself already exists.
 *
 * @async
 * @param {string} dirPath - The file system path of the directory to be created.
 *                           This path should conform to the conventions of the underlying operating system.
 * @param {import('node:fs').MakeDirectoryOptions & {recursive?: boolean}} [options={ recursive: true }] -
 *   Optional. Configuration options for `fs.promises.mkdir()`.
 *   Defaults to `{ recursive: true }`, enabling recursive directory creation.
 *   Other common options include `mode` (permission string or number, e.g., `0o755`).
 * @returns {Promise<string | undefined>} A Promise that resolves when the directory (and any
 *   necessary parents, if `recursive: true`) has been created.
 *   - If `options.recursive` is `true` (the default): The Promise resolves with the path of the
 *     first directory that had to be created. If all parts of the path already existed,
 *     it resolves with `undefined`.
 *   - If `options.recursive` is `false`: The Promise resolves with `undefined` upon successful
 *     creation of the non-recursively specified directory.
 * @throws {Error} Throws an error if `fs.promises.mkdir()` fails. Common error codes include:
 *   - `EACCES`: Permission denied (user does not have permission to create the directory).
 *   - `EEXIST`: Path already exists and is not a directory (only if `recursive` is `false`),
 *               or path already exists as a file.
 *   - `ENOENT`: A component of the path prefix does not exist (only if `recursive` is `false`).
 *   - `EINVAL`: Invalid path or options provided.
 *   - Other file system errors.
 *
 * @example
 * // Example 1: Basic recursive directory creation
 * async function setupAppDirectories() {
 *   try {
 *     const logsPath = await createDirectory('./app-data/logs');
 *     if (logsPath) {
 *       console.log(`Logs directory created at: ${logsPath}`);
 *     } else {
 *       console.log('Logs directory already existed or no specific path returned.');
 *     }
 *
 *     const assetsPath = await createDirectory('./app-data/assets/images', { mode: 0o775 });
 *     if (assetsPath) {
 *       console.log(`Assets images directory created at: ${assetsPath} with mode 0775`);
 *     }
 *   } catch (error) {
 *     console.error(`Failed to set up app directories: ${error.message}`);
 *   }
 * }
 * // setupAppDirectories();
 *
 * @example
 * // Example 2: Non-recursive directory creation (requires parent to exist)
 * async function createSpecificFolder() {
 *   try {
 *     // First, ensure the parent directory exists (can use createDirectory itself)
 *     await createDirectory('./app-data'); // Recursive by default, ensures './app-data' exists
 *
 *     // Now, create a subfolder non-recursively
 *     await createDirectory('./app-data/config', { recursive: false });
 *     console.log('Config folder created successfully (non-recursively).');
 *   } catch (error) {
 *     console.error(`Error in createSpecificFolder: ${error.message}`);
 *     if (error.code === 'EEXIST') {
 *       console.warn('Config folder already exists.');
 *     } else if (error.code === 'ENOENT') {
 *       console.warn('Parent directory for config folder does not exist.');
 *     }
 *   }
 * }
 * // createSpecificFolder();
 *
 * @example
 * // Example 3: Directory already exists with recursive: true (no error)
 * async function createExisting() {
 *   try {
 *     await createDirectory('./app-data'); // First call (might create)
 *     const result = await createDirectory('./app-data'); // Second call (already exists)
 *     console.log('Attempted to create existing directory:', result === undefined ? 'No new path created' : result);
 *   } catch (error) {
 *     console.error('This should not happen if recursive is true and path is a directory:', error);
 *   }
 * }
 * // createExisting();
 */
export function createDirectory(dirPath: string, options?: import("node:fs").MakeDirectoryOptions & {
    recursive?: boolean;
}): Promise<string | undefined>;
