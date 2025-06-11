/**
 * Returns the global object for the Node.js environment.
 * @returns {object} The global object (global).
 */
export function getGlobal() {
    var _a, _b, _c;
    return (_c = (_b = (_a = global !== null && global !== void 0 ? global : globalThis) !== null && _a !== void 0 ? _a : self) !== null && _b !== void 0 ? _b : window) !== null && _c !== void 0 ? _c : this;
}
