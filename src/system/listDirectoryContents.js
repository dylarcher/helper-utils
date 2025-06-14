import fs from 'node:fs/promises';

/**
 * Asynchronously lists the contents (files and directories) of a given directory.
 * This function is a wrapper around Node.js's `fs.readdir()`.
 * It is specific to Node.js environments.
 *
 * The returned array contains the names of the files and directories within the
 * specified `dirPath`, excluding '.' and '..'. The order is not guaranteed.
 *
 * @param {string} dirPath - The file system path to the directory whose contents are to be listed.
 * @returns {Promise<string[]>} A promise that resolves to an array of strings, where each
 *   string is the name of a file or directory within `dirPath`.
 * @throws {Error} Throws an error if `fs.readdir` fails. Common reasons include:
 *   - `ENOENT`: The path specified in `dirPath` does not exist.
 *   - `ENOTDIR`: The path specified in `dirPath` is a file, not a directory.
 *   - `EACCES`: Permission denied to read the directory.
 *
 * @example
 * // Create a dummy directory structure for example:
 * // import { mkdir, writeFile, rm } from 'node:fs/promises';
 * // async function setupExampleDir() {
 * //   await mkdir('./example_list_dir/subdir', { recursive: true });
 * //   await writeFile('./example_list_dir/file1.txt', 'content1');
 * //   await writeFile('./example_list_dir/file2.js', 'content2');
 * //   await writeFile('./example_list_dir/subdir/nestedfile.txt', 'nested');
 * // }
 * // async function cleanupExampleDir() {
 * //   await rm('./example_list_dir', { recursive: true, force: true });
 * // }
 *
 * async function showDirectoryContents() {
 *   // await setupExampleDir(); // Call if running example standalone
 *
 *   const targetDirectory = './example_list_dir';
 *   try {
 *     const contents = await listDirectoryContents(targetDirectory);
 *     console.info(`Contents of "${targetDirectory}":`, contents.sort());
 *     // Example output: Contents of "./example_list_dir": [ 'file1.txt', 'file2.js', 'subdir' ]
 *   } catch (error) {
 *     console.error(`Error listing directory "${targetDirectory}":`, error.message);
 *   }
 *
 *   const nonExistentDir = './non_existent_directory';
 *   try {
 *     await listDirectoryContents(nonExistentDir);
 *   } catch (error) {
 *     console.error(`Error listing directory "${nonExistentDir}":`, error.message);
 *     // Example output: Error listing directory "./non_existent_directory": ENOENT: no such file or directory...
 *   }
 *
 *   const aFile = './example_list_dir/file1.txt'; // Assuming this exists and is a file
 *   try {
 *     await listDirectoryContents(aFile);
 *   } catch (error) {
 *     console.error(`Error listing directory (path is a file) "${aFile}":`, error.message);
 *     // Example output: Error listing directory (path is a file) "...": ENOTDIR: not a directory...
 *   }
 *
 *   // await cleanupExampleDir(); // Call if running example standalone
 * }
 *
 * // showDirectoryContents();
 */
export async function listDirectoryContents(dirPath) {
	// fs.readdir() resolves with an array of names of the files in the directory
	// (excluding '.' and '..').
	return fs.readdir(dirPath);
}
