import path from "node:path";

/**
 * Gets the filename part of a path.
 * @param {string} p - The path to evaluate.
 * @param {string} [ext] - An optional extension to remove from the result.
 * @returns {string} The basename of the path.
 */
export function getBasename(p, ext) {
	if (!p || typeof p !== "string") {
		return "";
	}

	// For cross-platform path handling, always use the Node.js implementation
	// which is thoroughly tested and handles all edge cases correctly
	return path.basename(p, ext);
}
