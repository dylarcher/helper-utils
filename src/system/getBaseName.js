import path from "node:path";

/**
 * Gets the filename part of a path.
 * @param {string} p - The path to evaluate.
 * @param {string} [ext] - An optional extension to remove from the result.
 * @returns {string} The basename of the path.
 */
export function getBasename(p, ext) {
	return path.basename(p, ext);
}
