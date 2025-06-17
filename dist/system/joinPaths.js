import path from 'node:path';
/**
 * Joins all given path segments together using the platform-specific separator,
 * and normalizes the resulting path. This function is a wrapper around Node.js's `path.join()`.
 * It is specific to Node.js environments.
 *
 * Key behaviors of `path.join()`:
 * - Normalizes the path, resolving `..` and `.` segments.
 * - If any segment is an absolute path, all preceding segments are ignored.
 * - Empty string segments are ignored, unless all segments are empty strings or `'.'`, in which case `'.'` is returned.
 * - Trailing slashes are removed unless the path is the root directory.
 *
 * @param {...string} paths - A sequence of path segments to join. Must be strings.
 * @returns {string} A normalized string representing the joined path.
 * @throws {TypeError} Throws a TypeError if any of the `paths` arguments are not strings.
 *
 * @example
 * // Basic joining
 * console.info(joinPaths('/users', 'john', 'docs', 'file.txt')); // '/users/john/docs/file.txt' (on POSIX)
 * console.info(joinPaths('C:\\users', 'jane', 'data'));        // 'C:\\users\\jane\\data' (on Windows)
 *
 * // Normalization
 * console.info(joinPaths('foo', 'bar', '..', 'baz')); // 'foo/baz' (on POSIX)
 *
 * // Absolute path segments
 * console.info(joinPaths('/foo', '/bar/baz', 'quux')); // '/bar/baz/quux' (on POSIX)
 *
 * // Empty string segments
 * console.info(joinPaths('a', '', 'b'));    // 'a/b' (on POSIX)
 * console.info(joinPaths('a', '.', 'b'));   // 'a/b' (on POSIX)
 * console.info(joinPaths('', '', '.'));     // '.'
 * console.info(joinPaths(''));             // '.'
 * console.info(joinPaths());              // '.'
 *
 * // Trailing slashes
 * console.info(joinPaths('/foo/', 'bar/')); // '/foo/bar' (on POSIX)
 * console.info(joinPaths('/', '/'));       // '/' (on POSIX)
 *
 * // Example of TypeError for non-string arguments
 * try {
 *   joinPaths('/valid', 123, 'invalid');
 * } catch (e) {
 *   console.error(e.message); // "Path must be a string. Received 123" or similar
 * }
 */
export function joinPaths(...paths) {
    // path.join() will throw a TypeError if any argument is not a string.
    return path.join(...paths);
}
//# sourceMappingURL=joinPaths.js.map