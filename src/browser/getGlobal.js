/**
 * Returns the Node.js global object.
 * @param {object} options Optional parameter (maintained for backward compatibility)
 * @returns {object} The Node.js global object.
 */
export function getGlobal(options = {}) {
    return global
}
