import fs from 'node:fs/promises';

/**
 * Asynchronously checks if the given file system path corresponds to a directory.
 * This function uses Node.js's `fs.stat()` to retrieve file system information.
 * It is specific to Node.js environments.
 *
 * If the path does not exist, or if any other error occurs during `fs.stat()`
 * (e.g., permission denied), this function will catch the error and return `false`.
 *
 * Note on symbolic links: `fs.stat()` (and therefore this function) operates on the
 * target of a symbolic link, not the link itself. If you need to check if a symlink
 * *itself* is a directory (which is unusual, as symlinks are files pointing to a target),
 * you would use `fs.lstat()`.
 *
 * @param {string} dirPath - The file system path to check.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the path exists
 *   and is a directory. Resolves to `false` if the path does not exist, is not a
 *   directory, or if an error occurs (e.g., permission issues).
 *
 * @example
 * // Create dummy files/dirs for example:
 * // import { mkdir, writeFile, rm } from 'node:fs/promises';
 * // async function setupExamples() {
 * //   await mkdir('./my_test_directory');
 * //   await writeFile('./my_test_file.txt', 'content');
 * // }
 * // async function cleanupExamples() {
 * //   await rm('./my_test_directory', { recursive: true });
 * //   await rm('./my_test_file.txt');
 * // }
 *
 * async function checkPaths() {
 *   // await setupExamples(); // Call if running example standalone
 *
 *   console.info("Is './my_test_directory' a directory?", await isDirectory('./my_test_directory')); // true
 *   console.info("Is './my_test_file.txt' a directory?", await isDirectory('./my_test_file.txt'));   // false
 *   console.info("Is './non_existent_path' a directory?", await isDirectory('./non_existent_path')); // false
 *
 *   // Example with a path that might cause a permission error if not setup correctly
 *   // console.info("Is '/root/some_dir' a directory?", await isDirectory('/root/some_dir')); // false (likely, due to permissions)
 *
 *   // await cleanupExamples(); // Call if running example standalone
 * }
 *
 * // checkPaths();
 */
export async function isDirectory(dirPath) {
	try {
		const stats = await fs.stat(dirPath); // fs.stat follows symbolic links
		return stats.isDirectory();
	} catch (error) {
		// This catch block handles errors like ENOENT (path does not exist),
		// EACCES (permission denied), etc. In all such error cases,
		// the path is effectively not a directory that can be reported as such.
		return false;
	}
}
