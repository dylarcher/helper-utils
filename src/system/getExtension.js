import path from "node:path";

/**
 * Gets the extension of a path.
 * @param {string} p - The path to evaluate.
 * @returns {string} The extension of the path (e.g., '.js').
 */
export function getExtension(p) {
	if (!p || typeof p !== "string") {
		return "";
	}
	
	// Match Node.js behavior exactly for consistent results
	// Node.js returns the last extension even in paths that end with a separator
	// This ensures our function returns identical results to path.extname
	return path.extname(p);
}
