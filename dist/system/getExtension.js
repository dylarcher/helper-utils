// Import the 'path' module from Node.js.
// This module provides utilities for working with file and directory paths.
import path from 'node:path';
/**
 * Gets the extension of a file path, including the leading dot (e.g., '.js', '.txt').
 * This function is a wrapper around Node.js's `path.extname()` method and is
 * intended for use in Node.js environments.
 *
 * `path.extname(p)` extracts the extension from the last occurrence of a period (`.`)
 * to the end of the string in the last component of the path.
 *
 * Key behaviors of `path.extname()`:
 * - If there is no period in the last component of the path, an empty string (`''`) is returned.
 * - If the last component of the path starts with a period (e.g., a "dotfile" like `.bashrc`),
 *   and there are no other periods, an empty string (`''`) is returned.
 * - If the path ends with a period (e.g., `archive.tar.`), the period itself (`.`) is returned.
 * - For paths representing directories (e.g., `/path/to/dir/` or `/path/to/dir`), it typically
 *   returns an empty string (`''`) as directories usually don't have extensions in this context.
 *
 * This wrapper adds a guard clause: if the provided path `p` is not a string or is an
 * empty string, this function returns an empty string, aligning with `path.extname('')`.
 *
 * @param {string | Buffer} p - The file path to evaluate. While `path.extname` can accept a Buffer,
 *                      this wrapper's guard clause currently expects `p` to be a string.
 *                      If `p` is not a string or is an empty string, the function returns `''`.
 * @returns {string} The extension of the path (e.g., '.html', '.gz', '.').
 *                   Returns an empty string (`''`) if:
 *                   - `p` is not a valid non-empty string (due to the wrapper's guard).
 *                   - The path has no period in its last component.
 *                   - The last component starts with a period and contains no other periods (e.g., '.config').
 *                   - The path represents a directory.
 *
 * @example
 * // Example 1: Basic file extensions
 * console.log(getExtension('document.pdf'));         // Output: '.pdf'
 * console.log(getExtension('image.JPEG'));           // Output: '.JPEG' (case is preserved)
 * console.log(getExtension('/usr/local/bin/script.sh')); // Output: '.sh'
 *
 * // Example 2: Files with multiple dots in their name
 * console.log(getExtension('backup.archive.tar.gz'));  // Output: '.gz'
 * console.log(getExtension('my.new.component.vue')); // Output: '.vue'
 *
 * // Example 3: Files starting with a dot ("hidden" or "dotfiles")
 * console.log(getExtension('.bash_profile'));        // Output: '' (basename is '.bash_profile', no further extension)
 * console.log(getExtension('.env.local'));           // Output: '.local' (basename is '.env.local', extension is '.local')
 * console.log(getExtension('..hidden.config'));      // Output: '.config'
 *
 * // Example 4: Paths with no extension
 * console.log(getExtension('Makefile'));               // Output: ''
 * console.log(getExtension('/etc/hostname'));          // Output: ''
 *
 * // Example 5: Paths ending with a dot
 * console.log(getExtension('file.ending.with.dot.')); // Output: '.'
 * console.log(getExtension('nodotextension.'));       // Output: '.'
 *
 * // Example 6: Directory paths
 * console.log(getExtension('/path/to/some_directory/')); // Output: ''
 * console.log(getExtension('/path/to/another_dir'));   // Output: ''
 * console.log(getExtension('assets'));                 // Output: ''
 *
 * // Example 7: Invalid or empty inputs (handled by the wrapper)
 * console.log(getExtension(''));                      // Output: ''
 * console.log(getExtension(null));                   // Output: ''
 * console.log(getExtension(undefined));              // Output: ''
 * console.log(getExtension(123));                    // Output: '' (as 123 is not a string)
 */
export function getExtension(p) {
    // Step 1: Validate the input path `p`.
    // Ensure `p` is provided and is a string. If not, or if it's an empty string,
    // return an empty string. This aligns with `path.extname('')` which also returns `''`.
    if (!p || typeof p !== 'string') {
        return '';
    }
    // Step 2: Call `path.extname()` from Node.js's path module.
    // `path.extname(p)` returns the extension of the path `p`.
    // The extension is the substring from the last occurrence of the . (period) character
    // to the end of the string in the last portion of the path.
    //
    // Key behaviors:
    // - If there is no '.' in the last portion of the path, or if the path is a
    //   dotfile and the '.' is the first character of the basename (e.g., '.bashrc'),
    //   it returns an empty string.
    // - If the path ends with a '.', that '.' is returned (e.g., 'file.' -> '.').
    // - For directory paths, it usually returns an empty string.
    return path.extname(p);
}
//# sourceMappingURL=getExtension.js.map