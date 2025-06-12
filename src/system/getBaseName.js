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
	
	// Handle root path special case first
	if (p === "/" || p === "\\") {
		return "/";
	}
	
	// For cross-platform Windows path support on Unix systems
	// Only apply special handling when we detect a clear Windows absolute path
	// and we're on a Unix system where Node.js won't handle it properly
	if (process.platform !== "win32" && /^[A-Za-z]:[\\\/]/.test(p)) {
		// This is a Windows path on a Unix system
		const normalizedPath = p.replace(/\\/g, "/");
		return path.basename(normalizedPath, ext);
	}
	
	// Use standard Node.js behavior for all other cases
	return path.basename(p, ext);
}
