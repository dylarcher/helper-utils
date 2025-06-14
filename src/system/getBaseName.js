import path from 'node:path';

/**
 * Gets the filename part of a file path. This function is a wrapper around
 * Node.js's `path.basename()`. It is specific to Node.js environments.
 *
 * If the provided path `p` is not a string or is an empty string, this function
 * returns an empty string.
 *
 * @param {string} p - The path to evaluate.
 * @param {string} [ext] - Optional. A file extension to remove from the result.
 *   If provided, and the basename ends with `ext`, `ext` will be removed.
 * @returns {string} The basename of the path. Returns an empty string if `p` is
 *   not a valid non-empty string.
 * @throws {TypeError} If `ext` is provided and is not a string, `path.basename` will throw a TypeError.
 *
 * @example
 * // Basic usage
 * console.info(getBasename('/foo/bar/baz/asdf/quux.html')); // 'quux.html'
 * console.info(getBasename('/foo/bar/baz/asdf/quux.html', '.html')); // 'quux'
 *
 * // Works with Windows-like paths too (though Node's path module normalizes)
 * console.info(getBasename('C:\\temp\\myfile.txt')); // 'myfile.txt'
 *
 * // With extension removal
 * console.info(getBasename('index.js', '.js')); // 'index'
 * console.info(getBasename('index.coffee', '.js')); // 'index.coffee' (ext doesn't match)
 * console.info(getBasename('index.js.js', '.js')); // 'index.js' (only last one removed if matching)
 *
 * // Edge cases
 * console.info(getBasename('/some/path/')); // 'path'
 * console.info(getBasename('file')); // 'file'
 * console.info(getBasename('.bashrc')); // '.bashrc'
 * console.info(getBasename('/')); // '/'
 *
 * // Invalid input for p
 * console.info(getBasename('')); // '' (due to guard clause)
 * console.info(getBasename(null)); // '' (due to guard clause)
 *
 * // Invalid input for ext (throws TypeError)
 * try {
 *   console.info(getBasename('file.txt', 123));
 * } catch (e) {
 *   console.error(e.message); // "The "ext" argument must be of type string. Received type number (123)"
 * }
 */
export function getBasename(p, ext) {
	if (!p || typeof p !== 'string') {
		// Guard against non-string or empty string input for 'p'
		return '';
	}

	// For cross-platform path handling, Node.js path.basename is robust.
	// It handles various edge cases like trailing slashes correctly.
	// For example, path.basename('/foo/bar/') returns 'bar'.
	// path.basename('/') returns '/'.
	return path.basename(p, ext);
}
