/**
 * Asynchronously checks if a file system entry (e.g., a file, directory, or symbolic link)
 * exists at the specified `filePath`.
 *
 * This function utilizes `fs.promises.access()` with the default mode `fs.constants.F_OK`.
 * `fs.access(path, fs.constants.F_OK)` tests for the existence of the path. It does not
 * check for read, write, or execute permissions, only whether something (a file, directory, etc.)
 * exists at that path and is accessible to the current process.
 *
 * If `fs.access()` resolves successfully (meaning the path exists and is accessible for an
 * existence check), this function returns `true`.
 * If `fs.access()` throws an error (most commonly an `ENOENT` error, indicating the path
 * does not exist), this function catches the error and returns `false`.
 * Other less common errors from `fs.access` (e.g., `EACCES` if a component of the path
 * denies search permission, though this is rare for a simple existence check) will also
 * result in `false`.
 *
 * This is a Node.js specific utility.
 *
 * @async
 * @param {string} filePath - The absolute or relative path to the file system entry to check.
 * @returns {Promise<boolean>} A Promise that resolves to:
 *   - `true`: If a file system entry exists at `filePath` and is accessible.
 *   - `false`: If no file system entry exists at `filePath`, or if it's inaccessible
 *              in a way that `fs.access` with `F_OK` would throw (e.g., permission issue
 *              on a parent directory preventing path resolution, though `ENOENT` is most common for non-existence).
 *
 * @example
 * // For these examples to run, you might need to create dummy files/directories.
 * // import { writeFile, mkdir, rm } from 'node:fs/promises';
 * // async function setupExampleFileSystem() {
 * //   try { await writeFile('./temp-file.txt', 'content'); } catch(e) {}
 * //   try { await mkdir('./temp-dir'); } catch(e) {}
 * // }
 * // async function cleanupExampleFileSystem() {
 * //   try { await rm('./temp-file.txt'); } catch(e) {}
 * //   try { await rm('./temp-dir', { recursive: true }); } catch(e) {}
 * // }
 *
 * async function demonstrateFileExists() {
 *   // await setupExampleFileSystem(); // Run this if you want to test locally
 *
 *   const existingFile = './temp-file.txt'; // Assume this file has been created
 *   const existingDir = './temp-dir';     // Assume this directory has been created
 *   const nonExistent = './i-do-not-exist.dat';
 *   const pathWithNoAccess = '/root/restricted-file'; // Assuming no access here
 *
 *   console.log(`Checking for "${existingFile}":`, await fileExists(existingFile)); // Expected: true
 *   console.log(`Checking for "${existingDir}":`, await fileExists(existingDir));   // Expected: true
 *   console.log(`Checking for "${nonExistent}":`, await fileExists(nonExistent)); // Expected: false
 *
 *   // Note: For `pathWithNoAccess`, the result depends on OS permissions.
 *   // If the path itself cannot be resolved due to permissions on parent dirs, it might
 *   // also result in an error caught by fs.access, leading to `false`.
 *   // console.log(`Checking for "${pathWithNoAccess}":`, await fileExists(pathWithNoAccess)); // Likely false
 *
 *   // await cleanupExampleFileSystem(); // Clean up dummy files/dirs
 * }
 *
 * // demonstrateFileExists();
 *
 * @example
 * // Using with conditional logic
 * async function processFile(filePath) {
 *   if (await fileExists(filePath)) {
 *     console.log(`File "${filePath}" exists. Proceeding with processing.`);
 *     // const content = await fs.readFile(filePath, 'utf8');
 *     // console.log(content.substring(0, 50) + "...");
 *   } else {
 *     console.warn(`File "${filePath}" does not exist. Skipping.`);
 *   }
 * }
 * // processFile('./temp-file.txt');
 * // processFile('./another-file.log');
 */
export function fileExists(filePath: string): Promise<boolean>;
