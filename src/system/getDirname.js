import path from "node:path";

/**
 * Gets the directory name of a path.
 * @param {string} p - The path to evaluate.
 * @returns {string} The directory name.
 */
export function getDirname(p) {
	if (!p || typeof p !== "string") {
		return ".";
	}
	
	// For cross-platform Windows path support on Unix systems
	// Only apply special handling when we detect a clear Windows absolute path
	// and we're on a Unix system where Node.js won't handle it properly
	if (process.platform !== "win32" && /^[A-Za-z]:[\\\/]/.test(p)) {
		// This is a Windows path on a Unix system
		const segments = p.split(/[\\\/]+/);
		if (segments.length <= 2) {
			// For paths like "C:\file.txt", return "C:\"
			return segments[0] + "\\";
		}
		// Remove the last segment and join with backslashes
		segments.pop();
		return segments.join("\\");
	}
	
	// Use standard Node.js behavior for all other cases
	return path.dirname(p);
}
