/**
 * Attaches an event listener to an `EventTarget` (e.g., a DOM element) that is
 * automatically removed after it executes for the first time for the specified event type.
 *
 * This function leverages the native `once: true` option available in the
 * `addEventListener` method in modern browsers. This is the most efficient way
 * to achieve a "fire once" event listener.
 *
 * The function will do nothing if the provided `element` is null, undefined, or
 * does not support `addEventListener` (e.g., it's not a valid `EventTarget`).
 *
 * Note on browser compatibility:
 * The `once: true` option for `addEventListener` is widely supported in modern browsers
 * (Chrome 55+, Firefox 50+, Safari 10+, Edge 16+). If this function were to be used
 * in an environment that does not support `once: true` (very old browsers), the browser
 * might ignore the `once` option (making the listener behave like a regular, persistent one)
 * or potentially misinterpret the options object if it's not expecting `once`.
 * However, this implementation assumes modern browser capabilities.
 *
 * @param {EventTarget | null | undefined} element - The DOM element or other `EventTarget` to attach the listener to.
 *                                       If `null` or invalid, the function does nothing.
 * @param {string} eventType - The type of event to listen for (e.g., 'click', 'load', 'customEvent').
 * @param {EventListener} listener - The event listener function to be called when the event occurs.
 *   The `this` context within the listener will typically be the `element` it's attached to
 *   (unless the listener is an arrow function, in which case `this` is lexically bound).
 * @param {boolean | AddEventListenerOptions} [options] - Optional. Standard `addEventListener` options.
 *   - If `options` is a boolean, it's treated as the `capture` option. The effective options will be `{ capture: options, once: true }`.
 *   - If `options` is an object, `once: true` will be added to it (or override an existing `once` property).
 *     For example, `{ passive: true }` becomes `{ passive: true, once: true }`.
 *   - If `options` is omitted, the effective options will be `{ once: true }`.
 * @returns {void} This function does not return a value.
 *
 * @example
 * const myButton = document.getElementById('myButton');
 * const myImage = document.getElementById('myImage');
 *
 * if (myButton) {
 *   once(myButton, 'click', function(event) {
 *     // 'this' refers to myButton
 *     console.log('Button clicked for the very first time!', event.type, this.id);
 *     // This listener is now automatically removed by the browser.
 *   });
 * }
 *
 * if (myImage) {
 *   // Example 1: Using a boolean for capture phase
 *   once(myImage, 'load', (event) => {
 *     // 'this' is lexically bound if listener is an arrow function
 *     console.log('Image loaded once (capture phase). Source:', event.target.src);
 *   }, true); // Effective options: { capture: true, once: true }
 *
 *   // Example 2: Using an options object
 *   once(myImage, 'error', (event) => {
 *     console.error('Image failed to load (passive listener). This message appears only once.');
 *   }, { passive: true }); // Effective options: { passive: true, once: true }
 * }
 *
 * // Example 3: Attaching to window for a one-time scroll event
 * // once(window, 'scroll', () => {
 * //   console.log("User scrolled for the first time after this listener was attached.");
 * // });
 *
 * // Note: If you call `once()` multiple times with the exact same listener function reference
 * // for the same event type on the same element, `addEventListener`'s behavior regarding
 * // duplicate listeners applies (typically, it won't add the same listener multiple times
 * // if all parameters including options are identical). However, if you provide a new function
 * // reference each time (e.g., an anonymous function), each will be a distinct "once" listener.
 */
export function once(element, eventType, listener, options) {
	// Step 1: Validate the input element.
	// Check if `element` is provided and if it has the `addEventListener` method.
	// This ensures `element` is a valid `EventTarget`.
	if (!element || typeof element.addEventListener !== 'function') {
		// If the element is invalid or doesn't support `addEventListener`, do nothing.
		return;
	}

	// Step 2: Prepare the event options, ensuring `once: true`.
	// The `once: true` option tells `addEventListener` to automatically remove the listener
	// after it has been invoked for the first time.
	let eventOptions;

	if (typeof options === 'boolean') {
		// If `options` is a boolean, it's interpreted as the `capture` flag.
		eventOptions = { capture: options, once: true };
	} else if (typeof options === 'object' && options !== null) {
		// If `options` is an object, merge it with `once: true`.
		// `once: true` will be added or will override any existing `once` property.
		eventOptions = { ...options, once: true };
	} else {
		// If `options` is undefined, null, or an invalid type, default to `{ once: true }`.
		eventOptions = { once: true };
	}

	// Step 3: Attach the event listener using the processed options.
	// The browser's native implementation of `addEventListener` handles the "once" behavior
	// when `eventOptions.once` is true. The listener function (`listener`) will be called
	// at most once. After its first invocation, the browser automatically removes it.
	element.addEventListener(eventType, listener, eventOptions);

	// This function does not need to manually call `removeEventListener` because
	// the `once: true` option delegates that responsibility to the browser.
}
