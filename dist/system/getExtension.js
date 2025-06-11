import path from 'node:path';
/**
 * Gets the extension of a path.
 * @param {string} p - The path to evaluate.
 * @returns {string} The extension of the path (e.g., '.js').
 */
export function getExtension(p) {
    return path.extname(p);
}
