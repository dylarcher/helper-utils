import path from 'node:path';
/**
 * Gets the extension of a file path, including the leading dot (e.g., '.js', '.txt').
 * This function is a wrapper around Node.js's `path.extname()`.
 * It is specific to Node.js environments.
 *
 * If the provided path `p` is not a string or is an empty string, this function
 * returns an empty string. If the path does not have an extension, an empty
 * string is returned.
 *
 * @param {string} p - The file path to evaluate.
 * @returns {string} The extension of the path (e.g., '.html', '.md'). Returns an
 *   empty string if `p` is not a valid non-empty string, or if the path has no extension,
 *   or if the path is a directory path ending with a separator (in some cases, consult Node.js path.extname docs for specifics on directory paths).
 *
 * @example
 * // Basic usage
 * console.info(getExtension('index.html'));         // '.html'
 * console.info(getExtension('image.jpeg'));         // '.jpeg'
 * console.info(getExtension('/path/to/file.txt'));  // '.txt'
 *
 * // Files with multiple dots
 * console.info(getExtension('archive.tar.gz'));     // '.gz'
 * console.info(getExtension('app.component.ts'));   // '.ts'
 *
 * // Files starting with a dot (hidden files)
 * console.info(getExtension('.bashrc'));            // '' (no extension, .bashrc is the filename)
 * console.info(getExtension('.env.example'));       // '.example'
 *
 * // Paths with no extension
 * console.info(getExtension('README'));             // ''
 * console.info(getExtension('/path/to/directory')); // ''
 *
 * // Paths ending with a dot
 * console.info(getExtension('file.'));              // '.'
 *
 * // Invalid input
 * console.info(getExtension(''));                  // '' (due to guard clause)
 * console.info(getExtension(null));               // '' (due to guard clause)
 *
 * // Directory paths (behavior of path.extname)
 * console.info(getExtension('some/directory/'));    // ''
 * console.info(getExtension('some/directory'));     // ''
 */
export function getExtension(p) {
	if (!p || typeof p !== 'string') {
		// Guard against non-string or empty string input for 'p'
		return '';
	}
	// Node.js path.extname is robust for extracting file extensions.
	// It returns the extension from the last occurrence of the . (period)
	// to the end of string in the last portion of the path.
	// If there is no . in the last portion of the path, or if the first character
	// of the basename is . (dot), then it returns an empty string.
	return path.extname(p);
}
//# sourceMappingURL=getExtension.js.map
