/**
 * Returns the global object for the Node.js environment.
 * @returns {object} The global object (global).
 */
export function getGlobal() {
    return global ?? globalThis ?? self ?? window ?? this
}