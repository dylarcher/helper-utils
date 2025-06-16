import path from 'node:path';
/**
 * Resolves a sequence of paths or path segments into an absolute path.
 * This function is a wrapper around Node.js's `path.resolve()`.
 * It is specific to Node.js environments.
 *
 * **Key behaviors of `path.resolve()`:**
 * - Processes path segments from right to left, prepending each segment until an
 *   absolute path is constructed.
 * - If, after processing all given path segments, an absolute path has not yet been
 *   generated, the current working directory is used as the starting point.
 * - If no path segments are provided, `path.resolve()` returns the absolute path of
 *   the current working directory.
 * - Zero-length path segments are ignored.
 * - The resulting path is normalized (e.g., `.` and `..` are resolved, multiple
 *   slashes are replaced by a single one, and trailing slashes are removed unless
 *   the path is the root directory).
 *
 * @param {...string} paths - A sequence of path segments. These must be strings.
 *   If no segments are provided, the path resolves to the current working directory.
 * @returns {string} An absolute path string.
 * @throws {TypeError} Throws a TypeError if any of the `paths` arguments are not strings.
 *
 * @example
 * // Assuming current working directory is '/users/me/projects/my-app' (on POSIX)
 *
 * // Basic resolving
 * console.log(resolvePath('/foo/bar', './baz'));    // '/foo/bar/baz'
 * console.log(resolvePath('tmp', 'data', 'file.txt')); // '/users/me/projects/my-app/tmp/data/file.txt'
 *
 * // Rightmost absolute path takes precedence
 * console.log(resolvePath('/foo/bar', '/tmp/file/')); // '/tmp/file'
 * console.log(resolvePath('wwwroot', '/static_files/png/', '../gif/image.gif')); // '/static_files/gif/image.gif'
 *
 * // No arguments (resolves to current working directory)
 * console.log(resolvePath()); // '/users/me/projects/my-app'
 *
 * // Resolving with '..' and '.'
 * console.log(resolvePath('a', '..', 'b', '.', 'c.txt')); // '/users/me/projects/my-app/b/c.txt'
 *
 * // Zero-length segments are ignored
 * console.log(resolvePath('', '/one', '', '/two', '')); // '/two'
 *
 * // Example of TypeError for non-string arguments
 * try {
 *   resolvePath('/valid', 123, 'invalid');
 * } catch (e) {
 *   console.error(e.message); // "Path must be a string. Received 123" or similar
 * }
 */
export function resolvePath(...paths) {
	// path.resolve() will throw a TypeError if any argument is not a string.
	return path.resolve(...paths);
}
//# sourceMappingURL=resolvePath.js.map
