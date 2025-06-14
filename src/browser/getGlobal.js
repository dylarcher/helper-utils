/**
 * Returns the global `this` object.
 * In browsers, this is typically `window`. In Node.js, it's `global`.
 * In Web Workers, it's `self`.
 * This function attempts to return the correct global object based on the environment.
 *
 * @param {object} [options={}] - Optional parameter, currently unused but maintained for backward compatibility.
 * @returns {typeof globalThis | Window | object} The global object. In a browser environment, this will be the `Window` object.
 *   In Node.js, it will be the `global` object. In other environments like Web Workers, it could be `self`.
 *   Returns a generic `object` as a fallback if no specific global can be identified.
 *
 * @example
 * const globalObj = getGlobal();
 *
 * // In a browser:
 * // if (globalObj instanceof Window) {
 * //   console.info('Running in a browser window.');
 * //   globalObj.setTimeout(() => console.info('Hello from global timeout!'), 100);
 * // }
 *
 * // To access a global variable (though direct access or `globalThis` is often preferred if available):
 * // globalObj.myGlobalVar = 'test';
 * // console.info(globalObj.myGlobalVar);
 */
export function getGlobal(options = {}) {
	// Modern standard: globalThis
	if (typeof globalThis !== 'undefined') {
		return globalThis;
	}

	// Fallbacks for older environments or specific contexts
	if (typeof self !== 'undefined') {
		// self is standard in workers and newer browser window contexts
		return self;
	}
	if (typeof window !== 'undefined') {
		// window is standard in browser environments
		return window;
	}
	if (typeof global !== 'undefined') {
		// global is standard in Node.js
		return global;
	}

	// Last resort fallback, may have Content Security Policy (CSP) issues.
	// This is less reliable and might not be what's expected in some strict environments.
	try {
		return Function('return this')();
	} catch (e) {
		// If Function('return this')() is disallowed or fails.
		console.error('Unable to determine global object reliably.', e);
		// Returning a plain object as a final fallback, though its utility is limited.
		// Depending on the use case, throwing an error or returning null might be preferred.
		return {};
	}
}
