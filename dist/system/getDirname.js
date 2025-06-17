// Import the 'path' module from Node.js.
// This module provides utilities for working with file and directory paths in a way
// that is consistent across different operating systems.
import path from 'node:path';
/**
 * Gets the directory name of a given file path, similar to the Unix `dirname` command.
 * This function is a wrapper around Node.js's `path.dirname()` method and is intended
 * for use in Node.js environments.
 *
 * `path.dirname(p)` returns the directory portion of a path `p`, discarding any trailing
 * path separators and the last component of the path (e.g., filename or last directory).
 *
 * Key behaviors of `path.dirname()`:
 * - For a path like `/foo/bar/file.txt`, it returns `/foo/bar`.
 * - For a path like `/foo/bar/` (directory with trailing slash), it returns `/foo`.
 * - For a path with no directory component (e.g., `file.txt` in the current directory),
 *   it returns `.` (representing the current directory).
 * - For a root path like `/` on POSIX or `C:\` on Windows, it returns the root path itself.
 *
 * This wrapper function adds a specific behavior for invalid inputs:
 * - If the provided path `p` is not a string, or if it's an empty string, this wrapper
 *   returns `.` (current directory) instead of potentially throwing an error or returning
 *   what `path.dirname` would for such inputs (e.g., `path.dirname('')` is '.').
 *
 * @param {string | Buffer} p - The path to evaluate. While `path.dirname` can accept a Buffer,
 *                      this wrapper's guard clause currently expects `p` to be a non-empty string.
 *                      If `p` is empty, `null`, `undefined`, or not a string, this function returns '.'.
 * @returns {string} The directory part of the path.
 *                   - Returns `.` if `p` is an empty string, `null`, `undefined`, or not a string (due to the wrapper's guard).
 *                   - Returns `.` if `p` has no directory component (e.g., "filename.txt").
 *                   - For root paths (e.g., "/" or "C:/"), the root itself is returned.
 *
 * @example
 * // Example 1: Absolute paths
 * console.log(getDirname('/usr/local/bin/my-script.sh')); // Output: '/usr/local/bin'
 * console.log(getDirname('C:\\Program Files\\App\\utility.exe')); // Output: 'C:\\Program Files\\App'
 *
 * // Example 2: Relative paths
 * console.log(getDirname('src/modules/utils.js'));      // Output: 'src/modules'
 * console.log(getDirname('./config/settings.json'));    // Output: './config'
 * console.log(getDirname('../project/lib/helper.js')); // Output: '../project/lib'
 *
 * // Example 3: Paths with no directory component (returns '.')
 * console.log(getDirname('package.json'));              // Output: '.'
 * console.log(getDirname('standalone-file'));           // Output: '.'
 *
 * // Example 4: Paths ending with a directory separator
 * console.log(getDirname('/etc/conf.d/'));              // Output: '/etc' (trailing separator effectively makes 'conf.d' the part to be removed)
 * console.log(getDirname('my-folder/sub-folder/'));     // Output: 'my-folder'
 *
 * // Example 5: Root paths
 * console.log(getDirname('/'));                         // Output: '/'
 * console.log(getDirname('D:\\'));                      // Output: 'D:\\'
 *
 * // Example 6: Invalid or empty inputs (handled by the wrapper)
 * console.log(getDirname(''));                         // Output: '.'
 * console.log(getDirname(null));                      // Output: '.'
 * console.log(getDirname(undefined));                 // Output: '.'
 * console.log(getDirname(123));                       // Output: '.' (as 123 is not a string)
 *
 * // Example 7: Path that is just a directory name
 * console.log(getDirname('myDir')); // Output: '.'
 * console.log(getDirname('./myDir')); // Output: '.'
 */
export function getDirname(p) {
    // Step 1: Validate the input path `p`.
    // If `p` is falsy (e.g., null, undefined, empty string) or not a string,
    // this wrapper function returns '.' (representing the current directory).
    // This provides a default behavior for invalid inputs, which might differ from
    // how `path.dirname` itself would handle them (e.g., `path.dirname('')` is '.',
    // but `path.dirname(null)` would throw).
    if (!p || typeof p !== 'string') {
        return '.';
    }
    // Step 2: Call `path.dirname()` from Node.js's path module.
    // `path.dirname(p)` processes the path string `p` and returns its directory name.
    // Key behaviors of `path.dirname()`:
    // - It ignores trailing directory separators. For example, for `/foo/bar/`, the directory
    //   is `/foo`, because `bar` is considered the last component.
    // - If the path has no directory components (e.g., "file.txt"), it returns ".".
    // - For root paths (e.g., "/" on POSIX, "C:\\" on Windows), it returns the root itself.
    // - It handles both POSIX (/) and Windows (\) path separators appropriately for the
    //   platform where Node.js is running, but generally understands both for parsing.
    return path.dirname(p);
}
//# sourceMappingURL=getDirname.js.map