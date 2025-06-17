/**
 * Attaches an event listener to a parent element that only triggers a callback
 * if the event target matches a given CSS selector. This is a form of event delegation.
 *
 * If the `parentElement` is null or undefined, the function will do nothing.
 * Errors that occur during selector matching (e.g., an invalid CSS selector in `target.matches(selector)`)
 * are silently caught and ignored. This is to prevent a single faulty selector check from
 * breaking the entire event delegation chain for the parent element.
 *
 * @param {Element} parentElement - The parent DOM element to attach the event listener to.
 * @param {string} eventType - The type of event to listen for (e.g., 'click', 'mouseover').
 * @param {string} selector - A CSS selector string. The callback is triggered only if the event target matches this selector.
 * @param {(this: Element, event: Event) => void} callback - The function to execute when the event occurs on a matching target.
 *   The `this` keyword inside the callback will refer to the matched target element. The `event` object is passed as an argument.
 * @param {boolean | AddEventListenerOptions} [options] - Optional. Standard `addEventListener` options
 *   (e.g., `capture: true`, `once: true`, `passive: true`).
 * @returns {void}
 *
 * @example
 * // HTML:
 * // <ul id="myList">
 * //   <li class="item">Item 1</li>
 * //   <li class="item">Item 2</li>
 * //   <button id="addButton">Add</button>
 * // </ul>
 *
 * const list = document.getElementById('myList');
 *
 * // Listen for clicks on '.item' elements within the list
 * onDelegate(list, 'click', '.item', function(event) {
 *   console.info(`Clicked item: ${this.textContent}`); // `this` is the clicked <li>
 *   // event.target will also be the clicked <li>
 * });
 *
 * // Example with options (capture phase)
 * onDelegate(list, 'focus', 'input', function() {
 *   console.info(`Input focused: ${this.value}`);
 * }, true); // or { capture: true }
 *
 * // If list is null, this function does nothing:
 * // onDelegate(null, 'click', '.item', () => {});
 *
 * // If selector is invalid, e.g., onDelegate(list, 'click', ':[invalid]', () => {}),
 * // errors will be silently ignored and the callback won't fire for that selector.
 */
export function onDelegate(parentElement, eventType, selector, callback, options) {
    if (!parentElement) {
        return; // Do nothing if parentElement is not provided
    }
    parentElement.addEventListener(eventType, (/** @type {Event} */ evt) => {
        // Cast event.target to Element for `matches` method.
        // In some complex scenarios (e.g. text nodes), target might not be an Element.
        const target = /** @type {Element} */ (evt.target);
        // Ensure target is an Element and has `matches` method.
        if (target && typeof target.matches === 'function') {
            try {
                if (target.matches(selector)) {
                    // `call` sets `this` context of the callback to the target element
                    callback.call(target, evt);
                }
            }
            catch (_error) {
                // Silently handle errors from `target.matches(selector)`.
                // This typically occurs if `selector` is invalid.
                // This prevents breaking the event delegation for other selectors or listeners.
                // console.warn(`Error in onDelegate selector matching: "${selector}"`, error); // Optional: for debugging
            }
        }
    }, options);
}
//# sourceMappingURL=onDelegate.js.map