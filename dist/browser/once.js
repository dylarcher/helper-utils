/**
 * Attaches an event listener to an `EventTarget` (e.g., a DOM element) that is
 * designed to fire only once for the specified event type.
 *
 * This function utilizes the `once: true` option of the native `addEventListener` method.
 * It will do nothing if the provided `element` is null, undefined, or does not
 * support `addEventListener`.
 *
 * Note: This implementation relies on the browser's native support for the `once: true`
 * option in `addEventListener`. Most modern browsers support this. For older browsers
 * that do not, this listener might behave like a regular listener if `once: true` is ignored,
 * or it might cause an error if the options object is misinterpreted (though unlikely for `once`).
 *
 * @param {EventTarget} element - The DOM element or other EventTarget to attach the listener to.
 * @param {string} eventType - The type of event to listen for (e.g., 'click', 'load', 'customEvent').
 * @param {EventListener} listener - The event listener function to be called when the event occurs.
 *   The `this` context within the listener will be the `element` it's attached to.
 * @param {boolean | AddEventListenerOptions} [options] - Optional. Standard `addEventListener` options.
 *   If an object, `once: true` will be added to it. If `options` is a boolean (for capture),
 *   it will be converted to `{ capture: boolean, once: true }`. Any existing `once` property
 *   in an options object will effectively be overridden by `true`.
 * @returns {void}
 *
 * @example
 * const myButton = document.getElementById('myButton');
 * const myImage = document.getElementById('myImage');
 *
 * if (myButton) {
 *   once(myButton, 'click', function(event) {
 *     console.info('Button clicked once!', event.type, this.id);
 *     // This listener will automatically be removed after this execution.
 *   });
 * }
 *
 * if (myImage) {
 *   // Example with options (capture phase)
 *   once(myImage, 'load', (event) => {
 *     console.info('Image loaded once (capture phase).', event.target.src);
 *   }, true); // equivalent to { capture: true, once: true }
 *
 *   // Example with options object
 *   once(myImage, 'error', (event) => {
 *     console.error('Image failed to load (passive listener).');
 *   }, { passive: true }); // will become { passive: true, once: true }
 * }
 *
 * // If called multiple times with the same listener, each will be a unique "once" listener
 * // if (myButton) {
 * //   const handleClick = () => console.info('Another once click');
 * //   once(myButton, 'click', handleClick);
 * //   once(myButton, 'click', handleClick); // Both listeners will fire once independently
 * // }
 */
export function once(element, eventType, listener, options) {
    if (!element || typeof element.addEventListener !== 'function') {
        // Do nothing if element is invalid or doesn't support addEventListener
        return;
    }
    let eventOptions;
    if (typeof options === 'boolean') {
        eventOptions = { capture: options, once: true };
    }
    else if (typeof options === 'object' && options !== null) {
        eventOptions = { ...options, once: true };
    }
    else {
        eventOptions = { once: true }; // Default if options is undefined or invalid type
    }
    // This relies on the browser's native handling of `once: true`.
    // The comment about older browsers in the original code is not reflected in this implementation.
    element.addEventListener(eventType, listener, eventOptions);
}
//# sourceMappingURL=once.js.map