import path from 'node:path';

/**
 * Resolves a sequence of paths or path segments into an absolute path.
 * @param {...string} paths - A sequence of paths or path segments.
 * @returns {string} The resolved absolute path.
 */
export function resolvePath(...paths) {
	return path.resolve(...paths);
}
