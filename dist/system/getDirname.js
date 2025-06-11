import path from 'node:path';
/**
 * Gets the directory name of a path.
 * @param {string} p - The path to evaluate.
 * @returns {string} The directory name.
 */
export function getDirname(p) {
    return path.dirname(p);
}
