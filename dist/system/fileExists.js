import fs from 'node:fs/promises';
/**
 * Asynchronously checks if a file system entry (file, directory, symlink, etc.)
 * exists at the given path.
 * This function uses `fs.access()` with the default mode (F_OK) to check for the
 * existence of the path. It does not distinguish between files and directories,
 * only whether something exists at the path.
 * This is a Node.js specific utility.
 *
 * @param {string} filePath - The absolute or relative path to the file system entry to check.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the path exists,
 *   and `false` if the path does not exist or is inaccessible. Note that errors other
 *   than "not found" (e.g. permission errors that prevent even checking existence,
 *   though rare for F_OK) could theoretically lead to the catch block and a `false` return.
 *
 * @example
 * // Create dummy files/dirs for example:
 * // import { writeFile, mkdir, rm } from 'node:fs/promises';
 * // async function setupExamples() {
 * //   await writeFile('./example.txt', 'Hello content!');
 * //   await mkdir('./example_dir');
 * // }
 * // async function cleanupExamples() {
 * //   await rm('./example.txt');
 * //   await rm('./example_dir', { recursive: true });
 * // }
 *
 * async function checkMyFiles() {
 *   // await setupExamples(); // Call this if running the example standalone
 *
 *   const existingFilePath = './example.txt'; // Assume this file exists
 *   const existingDirPath = './example_dir';   // Assume this directory exists
 *   const nonExistentPath = './non_existent_file.txt';
 *
 *   console.info(`Does "${existingFilePath}" exist?`, await fileExists(existingFilePath)); // true
 *   console.info(`Does "${existingDirPath}" exist?`, await fileExists(existingDirPath));   // true
 *   console.info(`Does "${nonExistentPath}" exist?`, await fileExists(nonExistentPath)); // false
 *
 *   // Example with an invalid path (e.g., containing null byte) might lead to fs.access throwing
 *   // try {
 *   //   console.info(await fileExists('path\0with_null_byte')); // false, fs.access throws
 *   // } catch(e) { // This function's catch handles it
 *   // }
 *
 *   // await cleanupExamples(); // Call this if running the example standalone
 * }
 *
 * // checkMyFiles();
 */
export async function fileExists(filePath) {
	try {
		// fs.access with no mode defaults to F_OK (check for existence)
		await fs.access(filePath);
		return true; // Path exists and is accessible
	} catch (_error) {
		// fs.access throws an error if any accessibility checks fail (e.g., ENOENT if not found)
		// For fileExists, we primarily expect errors when the file doesn't exist.
		return false; // Path does not exist or is not accessible
	}
}
//# sourceMappingURL=fileExists.js.map
