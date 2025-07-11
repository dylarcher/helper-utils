// Import the 'path' module from Node.js.
// The 'path' module provides utilities for working with file and directory paths.
// It's essential for cross-platform path manipulation.
import path from 'node:path';

/**
 * Gets the filename part of a file path, with an option to remove a trailing extension.
 * This function is a wrapper around Node.js's `path.basename()` method and is intended
 * for use in Node.js environments.
 *
 * `path.basename` behavior:
 * - Returns the last portion of a path, similar to the Unix `basename` command.
 * - Trailing directory separators are ignored (e.g., `getBasename('/foo/bar/')` is 'bar').
 * - If the path is just a filename, it returns the filename.
 * - If the path is a directory (e.g. `/foo/bar`), it returns the last directory name (`bar`).
 * - If the path is the root (`/`), it returns `/`.
 *
 * The optional `ext` parameter:
 * - If provided, and if the determined basename ends with `ext` (case-sensitive comparison),
 *   then `ext` is removed from the end of the returned string.
 * - If `ext` does not match the end of the basename, the basename is returned as is.
 *
 * This wrapper adds a guard clause to return an empty string if the input path `p`
 * is not a non-empty string, providing a consistent return for such invalid inputs.
 *
 * @param {string | Buffer} p - The path to evaluate. While `path.basename` can accept a Buffer,
 *                      this wrapper's guard clause currently expects `p` to be a string.
 *                      If `p` is not a string or is an empty string, the function returns `''`.
 * @param {string} [ext] - Optional. A file extension (e.g., '.txt', '.js') to remove
 *                         from the end of the result if present. Must be a string if provided.
 * @returns {string} The basename of the path. Returns an empty string if `p` is not a
 *                   valid non-empty string.
 * @throws {TypeError} If `ext` is provided and is not a string (this error comes from
 *                     the underlying `path.basename` call).
 *
 * @example
 * // Basic usage:
 * console.log(getBasename('/usr/local/bin/script.sh')); // Output: 'script.sh'
 * console.log(getBasename('C:\\Users\\Public\\file.docx'));  // Output: 'file.docx'
 *
 * // With extension removal:
 * console.log(getBasename('/var/log/app.log', '.log'));    // Output: 'app'
 * console.log(getBasename('archive.tar.gz', '.gz'));      // Output: 'archive.tar'
 * console.log(getBasename('image.jpeg', '.jpg'));         // Output: 'image.jpeg' (ext doesn't match)
 * console.log(getBasename('component.jsx.js', '.js'));    // Output: 'component.jsx' (only last matching ext removed)
 *
 * // Edge cases for paths:
 * console.log(getBasename('/some/directory/')); // Output: 'directory' (trailing slash ignored)
 * console.log(getBasename('filename'));         // Output: 'filename'
 * console.log(getBasename('.configfile'));      // Output: '.configfile'
 * console.log(getBasename('/'));                // Output: '/' (or '' on Windows for root, path.basename behavior)
 * console.log(getBasename('C:/'));              // Output: 'C:' (on Windows, or '' depending on Node version/OS)
 *
 * // Invalid input for path `p`:
 * console.log(getBasename(''));                 // Output: '' (due to guard clause)
 * console.log(getBasename(null));               // Output: '' (due to guard clause)
 * console.log(getBasename(undefined));          // Output: '' (due to guard clause)
 *
 * // Invalid input for extension `ext` (throws TypeError):
 * try {
 *   console.log(getBasename('document.pdf', 123)); // ext is not a string
 * } catch (e) {
 *   console.error(`Error: ${e.message}`);
 *   // Example output: "Error: The "ext" argument must be of type string. Received type number (123)"
 * }
 */
export function getBasename(p, ext) {
	// Step 1: Validate the input path `p`.
	// Ensure `p` is provided and is a string. If not, or if it's an empty string,
	// return an empty string for consistent behavior with invalid path inputs.
	// `path.basename` itself might handle some non-string inputs by coercing or throwing,
	// but this guard provides a predictable outcome for empty or non-string paths.
	if (!p || typeof p !== 'string') {
		return '';
	}

	// Step 2: Call `path.basename()` from Node.js's path module.
	// - `p`: The path string.
	// - `ext` (optional): If provided, and if the basename of `p` ends with this string,
	//   `ext` will be removed from the result. The comparison is case-sensitive.
	//
	// `path.basename` correctly handles platform-specific path separators (e.g., `/` on POSIX, `` on Windows)
	// and various edge cases:
	// - `path.basename('/foo/bar/baz.txt')` returns 'baz.txt'.
	// - `path.basename('/foo/bar/baz.txt', '.txt')` returns 'baz'.
	// - `path.basename('/foo/bar/')` returns 'bar' (trailing separators are ignored).
	// - `path.basename('/')` returns '/' on POSIX, '' or drive letter on Windows for root.
	// - `path.basename('~/.bashrc')` returns '.bashrc'.
	//
	// If `ext` is provided but is not a string, `path.basename` will throw a TypeError.
	// This wrapper function allows that TypeError to propagate.
	return path.basename(p, ext);
}
