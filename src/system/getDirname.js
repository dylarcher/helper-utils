import path from 'node:path';

/**
 * Gets the directory name of a path.
 * @param {string} p - The path to evaluate.
 * @returns {string} The directory name.
 */
export function getDirname(p) {
	if (!p || typeof p !== 'string') {
		return '.';
	}

	// For cross-platform path handling, always use the Node.js implementation
	// which is thoroughly tested and handles all edge cases correctly
	return path.dirname(p);
}
