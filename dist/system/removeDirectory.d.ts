/**
 * Asynchronously removes a directory. This function uses Node.js's `fs.rm()`
 * and includes a preliminary check using `fs.stat()` to ensure the target is a directory.
 * It is specific to Node.js environments.
 *
 * **Behavior Details:**
 * - By default, this function sets `recursive: true` for the underlying `fs.rm` call,
 *   which is necessary for removing directories (even empty ones) with `fs.rm`.
 * - **Pre-check**: Before attempting removal, it verifies if `dirPath` is a directory.
 *   - If `dirPath` is not a directory, an error `Path is not a directory: ${dirPath}` is thrown,
 *     UNLESS `options.force` is `true`.
 *   - If `fs.stat()` fails (e.g., path does not exist) and `options.force` is `true`,
 *     the error from `fs.stat()` is suppressed, and `fs.rm` will proceed (which might
 *     then also ignore non-existence if `force: true`).
 * - The `force` option in `options` is passed to `fs.rm`, meaning if `true`, `fs.rm`
 *   will ignore exceptions if the path does not exist.
 *
 * @param {string} dirPath - The file system path of the directory to remove.
 * @param {import('node:fs').RmOptions & {recursive?: boolean, force?: boolean}} [options] -
 *   Optional. Configuration options for `fs.rm`.
 *   Defaults internally to a base of `{ recursive: true, force: false }` which is then
 *   spread with any provided `options`. So, `recursive` will default to `true` unless
 *   explicitly set to `false` in the passed `options` (though `fs.rm` for directories needs it true).
 * @returns {Promise<void>} A promise that resolves when the directory (and its contents if recursive)
 *   has been successfully removed. The promise does not resolve with any value.
 * @throws {Error} Throws an error if:
 *   - `dirPath` is not a directory (and `options.force` is not `true`).
 *   - `fs.stat` fails for reasons other than non-existence when `options.force` is `false`.
 *   - `fs.rm` fails (e.g., `EACCES` for permission issues, `ENOENT` if path doesn't exist
 *     and `force: false`).
 *
 * @example
 * // Create dummy directory structure for examples:
 * // import { mkdir, writeFile } from 'node:fs/promises';
 * // async function setupExample() {
 * //   await mkdir('./temp_dir_to_remove/subdir', { recursive: true });
 * //   await writeFile('./temp_dir_to_remove/file.txt', 'content');
 * //   await writeFile('./temp_dir_is_file.txt', 'this is a file');
 * // }
 * // async function cleanupExample() { // ... potentially recreate or use different names ... }
 *
 * async function manageDirectories() {
 *   // await setupExample();
 *
 *   // Remove a non-empty directory
 *   try {
 *     await removeDirectory('./temp_dir_to_remove'); // Uses default { recursive: true }
 *     console.log('Directory ./temp_dir_to_remove removed.');
 *   } catch (error) {
 *     console.error('Error removing ./temp_dir_to_remove:', error.message);
 *   }
 *
 *   // Attempt to remove a path that is a file
 *   try {
 *     await removeDirectory('./temp_dir_is_file.txt');
 *   } catch (error) {
 *     console.error('Error (should be "Path is not a directory") for file:', error.message);
 *     // Expected: Path is not a directory: ./temp_dir_is_file.txt
 *   }
 *
 *   // Attempt to remove a non-existent directory with force: true
 *   try {
 *     await removeDirectory('./non_existent_dir_force', { force: true });
 *     console.log('Attempted to remove non_existent_dir_force with force: true (no error expected).');
 *   } catch (error) {
 *     console.error('Error removing non_existent_dir_force with force:', error.message); // Should not happen
 *   }
 *
 *   // Attempt to remove a non-existent directory with force: false (default)
 *   try {
 *     await removeDirectory('./non_existent_dir_default_force');
 *   } catch (error) {
 *     // fs.stat will throw ENOENT, which is re-thrown because options.force defaults to false.
 *     console.error('Error (should be ENOENT) for non_existent_dir_default_force:', error.message);
 *   }
 *
 *   // await cleanupExample(); // Or specific rm calls
 *   // try { await fs.unlink('./temp_dir_is_file.txt'); } catch(e) {}
 * // } // Correctly commented out closing brace for the example function
 *
 * // manageDirectories();
 */
export function removeDirectory(dirPath: string, options?: import("node:fs").RmOptions & {
    recursive?: boolean;
    force?: boolean;
}): Promise<void>;
