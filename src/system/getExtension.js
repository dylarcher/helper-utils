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
	
	// If path ends with a separator, it's a directory - return empty extension
	// This is our custom behavior, different from Node.js path.extname
	if (p.endsWith("/") || p.endsWith("\\")) {
		return "";
	}
	
	return path.extname(p);
}
