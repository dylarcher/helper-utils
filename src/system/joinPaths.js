import path from 'node:path';

/**
 * Joins all given path segments together using the platform-specific separator.
 * @param {...string} paths - A sequence of path segments.
 * @returns {string} The joined path.
 */
export function joinPaths(...paths) {
	return path.join(...paths);
}
