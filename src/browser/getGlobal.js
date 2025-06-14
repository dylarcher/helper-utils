/**
 * Returns the Node.js global object.
 * @param {object} _options Optional parameter (maintained for backward compatibility)
 * @returns {object} The Node.js global object.
 */
export function getGlobal(_options = {}) {
	return global;
}
