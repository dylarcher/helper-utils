import path from 'node:path';

/**
 * Gets the directory name of a file path, similar to the Unix `dirname` command.
 * This function is a wrapper around Node.js's `path.dirname()`.
 * It is specific to Node.js environments.
 *
 * If the provided path `p` is not a string or is an empty string, this function
 * returns '.' (representing the current directory).
 *
 * @param {string} p - The path to evaluate.
 * @returns {string} The directory part of the path. Returns '.' if `p` is an empty
 *   string or not a string. For root paths like '/' or 'C:/', the root itself is returned.
 *   If the path has no directory component (e.g., 'file.txt'), '.' is returned by `path.dirname`.
 *
 * @example
 * // Basic usage
 * console.info(getDirname('/foo/bar/baz/asdf/quux.html')); // '/foo/bar/baz/asdf'
 * console.info(getDirname('C:\\temp\\folder\\myfile.txt')); // 'C:\\temp\\folder'
 *
 * // Path with no directory component
 * console.info(getDirname('myfile.txt')); // '.'
 * console.info(getDirname('')); // '.' (due to guard clause)
 * console.info(getDirname(null)); // '.' (due to guard clause)
 *
 * // Root paths
 * console.info(getDirname('/')); // '/'
 * console.info(getDirname('/foo')); // '/'
 * console.info(getDirname('C:\\')); // 'C:\\' (or 'C:' depending on Node version/OS for `path.dirname` with drive letters)
 *                                     // Node's path.dirname('C:\\') is 'C:\\'
 * console.info(getDirname('C:\\foo')); // 'C:\\'
 *
 * // Relative paths
 * console.info(getDirname('./my/file.js')); // './my'
 * console.info(getDirname('../another/path')); // '../another'
 *
 * // Paths with trailing slashes
 * console.info(getDirname('/foo/bar/')); // '/foo'
 * console.info(getDirname('file/')); // 'file'
 */
export function getDirname(p) {
	if (!p || typeof p !== 'string') {
		// If p is null, undefined, empty string, or not a string, return '.'
		return '.';
	}

	// Node.js path.dirname is robust for cross-platform directory name resolution.
	return path.dirname(p);
}
