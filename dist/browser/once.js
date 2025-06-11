/**
 * Attaches an event listener to an element that fires only once.
 * @param {EventTarget} element - The DOM element or event target.
 * @param {string} eventType - The type of event (e.g., 'click').
 * @param {Function} listener - The event listener function.
 * @param {boolean|object} [options] - Optional event listener options.
 */
export function once(element, eventType, listener, options) {
    if (!element || typeof element.addEventListener !== 'function')
        return;
    const optionsWithOnce = typeof options === 'object' ? { ...options, once: true } : { once: true };
    // For older browsers that don't support `once` in options, wrap the listener.
    // Modern browsers handle `once: true` natively.
    element.addEventListener(eventType, listener, optionsWithOnce);
}
