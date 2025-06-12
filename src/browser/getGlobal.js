/**
 * Returns the global object for the current environment.
 * @returns {object} The global object (global, globalThis, self, window, or this).
 */
export function getGlobal() {
	// Check each global reference and return the first truthy one
	if (typeof global !== "undefined" && global) {
		return global;
	}
	if (typeof globalThis !== "undefined" && globalThis) {
		return globalThis;
	}
	if (typeof self !== "undefined" && self) {
		return self;
	}
	if (typeof window !== "undefined" && window) {
		return window;
	}
	return this;
}
