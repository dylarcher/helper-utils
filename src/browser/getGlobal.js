/**
 * Returns the global object for the current JavaScript environment in a cross-platform manner.
 * This function is essential for writing universal JavaScript code that can run in various
 * environments (e.g., web browsers, web workers, Node.js) without knowing the specific
 * global object's name in advance.
 *
 * The function prioritizes:
 * 1. `globalThis`: The standard way to access the global object across all environments
 *    that support ECMAScript 2020 or later.
 * 2. `self`: Commonly available in web workers and browser window contexts.
 * 3. `window`: The traditional global object in browser environments.
 * 4. `global`: The global object in Node.js environments.
 * 5. If none of the above are found (highly unlikely in standard JS environments),
 *    it falls back to `this` (which might be undefined in strict mode modules) or an empty object.
 *
 * @param {object} [_options={}] - Optional parameter, currently unused.
 *                                 Maintained for potential future extensions or backward compatibility.
 * @returns {typeof globalThis | Window | global | object} The global object of the current JavaScript environment.
 *          This could be `window` (browsers), `self` (workers/browsers), `global` (Node.js),
 *          or the standard `globalThis`. In very unusual or restricted environments, it might
 *          return a plain object as a last resort.
 *
 * @example
 * // Basic usage:
 * const globalObject = getGlobal();
 *
 * // Example 1: Setting a global variable (use with caution)
 * // globalObject.myAppNamespace = { version: '1.0.0' };
 * // console.log(globalObject.myAppNamespace.version); // '1.0.0'
 *
 * // Example 2: Checking for features or environment
 * if (typeof globalObject.document !== 'undefined') {
 *   console.log("This environment has a DOM (likely a browser).");
 * } else if (typeof globalObject.process !== 'undefined' && globalObject.process.versions && globalObject.process.versions.node) {
 *   console.log("This environment is Node.js.");
 * } else if (typeof globalObject.importScripts === 'function') {
 *   console.log("This environment is likely a Web Worker.");
 * }
 *
 * // Example 3: Accessing global constructors or functions
 * const MyPromise = globalObject.Promise;
 * const newPromise = new MyPromise((resolve, reject) => {
 *   // ...
 * });
 *
 * // Example 4: In a browser
 * // const browserGlobal = getGlobal();
 * // console.log(browserGlobal === window); // true
 * // console.log(browserGlobal === self);   // true
 * // console.log(browserGlobal === globalThis); // true (in modern browsers)
 *
 * // Example 5: In Node.js
 * // const nodeGlobal = getGlobal();
 * // console.log(nodeGlobal === global); // true
 * // console.log(nodeGlobal === globalThis); // true (in modern Node.js)
 *
 * // Example 6: In a Web Worker
 * // const workerGlobal = getGlobal();
 * // console.log(workerGlobal === self); // true
 * // console.log(workerGlobal.importScripts); // function
 */
export function getGlobal(_options = {}) {
	// 1. `globalThis` (ES2020 standard)
	// This is the most modern and preferred way to get the global object.
	// It's universally available in environments that support recent ECMAScript standards.
	if (typeof globalThis !== 'undefined') {
		return globalThis;
	}

	// 2. `self`
	// Commonly available in browser window contexts and Web Workers.
	// In window context, `self` is usually identical to `window`.
	// In Web Workers, `self` is the global scope.
	if (typeof self !== 'undefined') {
		return self;
	}

	// 3. `window`
	// The traditional global object in browser environments.
	if (typeof window !== 'undefined') {
		return window;
	}

	// 4. `global`
	// The global object in Node.js environments.
	// The `typeof global !== 'undefined'` check is crucial to prevent a ReferenceError
	// in environments where `global` is not defined (like browsers).
	if (typeof global !== 'undefined') {
		return global;
	}

	// 5. Fallback (Highly unlikely to be reached in standard environments)
	// If none of the above are defined, this attempts to return the current `this` context.
	// In the global scope of a script (non-module, non-strict mode), `this` can refer to the global object.
	// However, in modules or strict mode, `this` at the top level might be `undefined`.
	// As a very last resort, return an empty object to prevent returning `undefined` if possible,
	// though the utility of such an object would be limited.
	// Note: The original code `(typeof global !== 'undefined' ? global : null) ?? globalThis;`
	// was more concise but didn't explicitly check for `self` or `window` before `globalThis`.
	// This more verbose version provides a clearer hierarchy of checks.
	// For maximum safety in truly unknown environments, one might even construct an object:
	// return new Function('return this')() || {};
	// However, the sequence above covers virtually all standard JavaScript execution contexts.
	// If `this` is undefined (e.g. in a module's top scope in strict mode), this could return undefined.
	// A more robust fallback might be `({})`, but that implies a "failed" attempt to get the true global.
	try {
		// This can be problematic. In strict mode modules, `this` is undefined at the top level.
		// In a non-strict function called globally, `this` would be the global object.
		// This line is kept for trying to capture a 'this' that might be global, but with caveats.
		if (typeof this !== 'undefined') {
			return this;
		}
	} catch (e) {
		// If 'this' is restricted (e.g. due to strict mode or context), catch error.
	}

	// Final fallback: if all else fails, return an empty object.
	// This ensures the function always returns an object, though it might not be the true global.
	return {};
}
