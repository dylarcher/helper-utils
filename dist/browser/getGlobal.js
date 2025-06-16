/**
 * Returns the global object for the current JavaScript environment.
 *
 * This function provides a cross-environment way to access the global object:
 * - In Node.js environments where `global` is available, it returns `global`
 * - In other environments (browsers, workers, etc.), it falls back to `globalThis`
 *
 * The function uses a safe approach to check for the `global` variable without
 * causing ReferenceError in environments where it doesn't exist, then uses the
 * nullish coalescing operator (`??`) to fall back to `globalThis`.
 *
 * @param {object} [_options={}] - Optional parameter, currently unused but maintained for backward compatibility.
 * @returns {typeof global | typeof globalThis} The global object for the current environment.
 *   Returns `global` if available (Node.js), otherwise returns `globalThis`.
 *
 * @example
 * // Basic usage
 * const globalObj = getGlobal();
 *
 * // Access global variables:
 * globalObj.myGlobalVar = 'test';
 * console.log(globalObj.myGlobalVar); // 'test'
 *
 * // Check environment:
 * if (typeof global !== 'undefined' && globalObj === global) {
 *   console.log('Running in Node.js environment');
 * } else {
 *   console.log('Running in browser or other environment');
 * }
 *
 * // In Node.js, global and globalThis refer to the same object
 * console.log(globalObj === (typeof global !== 'undefined' ? global : globalThis)); // true
 *
 * // In browsers, you get access to window, document, etc.
 * if (globalObj.window) {
 *   console.log('Browser environment detected');
 *   console.log('Document available:', !!globalObj.document);
 * }
 *
 * // Safe cross-environment global access
 * const originalConsole = globalObj.console;
 * globalObj.console = { log: (...args) => originalConsole.log('[LOG]', ...args) };
 */
export function getGlobal(_options = {}) {
    // Use global for Node.js, fallback to globalThis for modern environments
    // We need to safely check for global to avoid ReferenceError in environments where it doesn't exist
    return (typeof global !== 'undefined' ? global : null) ?? globalThis;
}
