import fs from 'node:fs/promises';

/**
 * Asynchronously lists the contents (files and directories) of a given directory using an async generator.
 * This function is a wrapper around Node.js's `fs.readdir()` that yields each item one by one,
 * making it memory-efficient for large directories. It is specific to Node.js environments.
 *
 * The generator yields the names of the files and directories within the
 * specified `dirPath`, excluding '.' and '..'. The order is not guaranteed.
 *
 * @param {string} dirPath - The file system path to the directory whose contents are to be listed.
 * @yields {string} The name of a file or subdirectory within the specified directory.
 * @throws {Error} Throws an error if `fs.readdir` fails. Common reasons include:
 *   - `ENOENT`: The path specified in `dirPath` does not exist.
 *   - `ENOTDIR`: The path specified in `dirPath` is a file, not a directory.
 *   - `EACCES`: Permission denied to read the directory.
 * @returns {AsyncGenerator<string, void, undefined>} An async generator that yields the names of files and subdirectories.
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
 *     const contents = [];
 *     for await (const item of listDirectoryContents(targetDirectory)) {
 *       contents.push(item);
 *     }
 *     console.info(`Contents of "${targetDirectory}":`, contents.sort());
 *     // Example output: Contents of "./example_list_dir": [ 'file1.txt', 'file2.js', 'subdir' ]
 *   } catch (error) {
 *     console.error(`Error listing directory "${targetDirectory}":`, error.message);
 *   }
 *
 *   const nonExistentDir = './non_existent_directory';
 *   try {
 *     for await (const item of listDirectoryContents(nonExistentDir)) {
 *       console.info(item); // This won't execute due to error
 *     }
 *   } catch (error) {
 *     console.error(`Error listing directory "${nonExistentDir}":`, error.message);
 *     // Example output: Error listing directory "./non_existent_directory": ENOENT: no such file or directory...
 *   }
 *
 *   const aFile = './example_list_dir/file1.txt'; // Assuming this exists and is a file
 *   try {
 *     for await (const item of listDirectoryContents(aFile)) {
 *       console.info(item); // This won't execute due to error
 *     }
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
export async function* listDirectoryContents(dirPath) {
	// fs.readdir() resolves with an array of names of the files in the directory
	// (excluding '.' and '..').
	const items = await fs.readdir(dirPath);
	for (const item of items) {
		yield item;
	}
}
