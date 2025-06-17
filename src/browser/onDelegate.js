/**
 * Attaches an event listener to a parent element that triggers a callback only if
 * the direct event target (the innermost element that an event originated from)
 * matches a given CSS selector. This is a basic form of event delegation.
 *
 * How it works:
 * 1. An event listener for the specified `eventType` is attached to `parentElement`.
 * 2. When an event occurs within `parentElement` (event bubbling phase, by default),
 *    the listener function is executed.
 * 3. Inside the listener, `event.target` (the actual element that triggered the event)
 *    is checked against the provided `selector` using `target.matches(selector)`.
 * 4. If `event.target` itself matches the `selector`, the `callback` function is executed.
 *    The `this` context within the `callback` is set to `event.target`, and the `event`
 *    object is passed as an argument.
 *
 * Important Limitations of this Implementation:
 * - It does **not** handle cases where the event target is a child of an element matching
 *   the selector. For example, if you delegate clicks for `'.item'` and a click occurs on a
 *   `<span>` inside an `<li class="item">`, this implementation will **not** trigger the
 *   callback for `'.item'` unless the `<span>` itself also matches `'.item'`.
 *   A more robust delegation often uses `event.target.closest(selector)` to find the
 *   nearest ancestor (or self) that matches the selector.
 *
 * The function does nothing if `parentElement` is null or undefined.
 * Errors during selector matching (e.g., an invalid CSS selector causing `target.matches()`
 * to throw an error) are silently caught to prevent breaking the main event listener.
 *
 * This function does not return the event listener function, so to remove the listener,
 * you would need to manage a reference to the anonymous listener created, or use a more
 * advanced pattern if removal is required.
 *
 * @param {Element | null | undefined} parentElement - The parent DOM element to which the event listener will be attached.
 *                                         If `null` or `undefined`, the function does nothing.
 * @param {string} eventType - The type of event to listen for (e.g., 'click', 'mouseover', 'input').
 * @param {string} selector - A CSS selector string. The `callback` is triggered only if `event.target`
 *                            directly matches this selector.
 * @param {(this: Element, event: Event) => void} callback - The function to execute when the event occurs on
 *   a matching `event.target`. Inside the callback:
 *   - `this` refers to the `event.target` element that matched the selector.
 *   - The `event` object is passed as the first argument.
 * @param {boolean | AddEventListenerOptions} [options] - Optional. Standard options for `addEventListener`
 *   (e.g., `{ capture: true, once: true, passive: true }` or a boolean for capture phase).
 * @returns {void} This function does not return a value.
 *
 * @example
 * // HTML structure:
 * // <ul id="myList">
 * //   <li class="item" data-id="1">Item 1 <span>(click span)</span></li>
 * //   <li class="item" data-id="2">Item 2</li>
 * //   <li class="other-item" data-id="3">Other Item</li>
 * //   <button id="unrelatedButton">Unrelated</button>
 * // </ul>
 *
 * const listElement = document.getElementById('myList');
 *
 * if (listElement) {
 *   // Example 1: Listen for clicks directly on '.item' elements
 *   onDelegate(listElement, 'click', '.item', function(event) {
 *     // `this` is the specific <li> element with class "item" that was clicked.
 *     // `event.target` is also this <li> element.
 *     console.log(`Item clicked: ${this.textContent}, ID: ${this.dataset.id}`);
 *   });
 *   // Clicking "Item 1" or "Item 2" text directly will trigger this.
 *   // Clicking the "<span>(click span)</span>" inside "Item 1" WILL NOT trigger this,
 *   // because event.target would be the <span>, which doesn't match '.item'.
 *
 *   // Example 2: Listen for clicks on any <li> element
 *   onDelegate(listElement, 'click', 'li', function(event) {
 *     console.log(`Any li clicked: ${this.textContent}`);
 *   });
 *   // This will trigger for clicks on "Item 1", "Item 2", or "Other Item".
 *
 *   // Example 3: Using options (e.g., capture phase)
 *   onDelegate(listElement, 'focus', 'input', function() { // Assuming inputs could be added to the list
 *     console.log(`Input focused (capture phase): ${this.value}`);
 *   }, true); // true for capture phase
 * }
 *
 * // Example 4: parentElement is null
 * const nullParent = null;
 * onDelegate(nullParent, 'click', '.item', function() {
 *   console.log("This will not be logged as parentElement is null.");
 * });
 *
 * // Example 5: Invalid selector (error caught silently)
 * if (listElement) {
 *   onDelegate(listElement, 'click', ':[invalid-selector]', function() {
 *     console.log("Callback for invalid selector - should not fire.");
 *   });
 *   // Clicking listElement will not cause an error to be thrown due to the invalid selector.
 * }
 */
export function onDelegate(
	parentElement,
	eventType,
	selector,
	callback,
	options, // Standard addEventListener options (boolean for capture, or object)
) {
	// Step 1: Validate parentElement.
	// If parentElement is null or undefined, we cannot attach an event listener.
	if (!parentElement) {
		return; // Exit the function silently.
	}

	// Step 2: Attach the primary event listener to the parentElement.
	// This listener will be triggered for any event of `eventType` that bubbles up to or
	// is captured by `parentElement`.
	parentElement.addEventListener(
		eventType,
		(/** @type {Event} */ evt) => {
			// `evt` is the event object for the occurred event.

			// Step 3: Identify the actual target of the event.
			// `evt.target` is the innermost element where the event originated.
			// We cast it to `Element` because `matches` method is on Element type.
			// Note: `evt.target` can sometimes be a Text node or other non-Element node,
			// in which case `target.matches` would be undefined.
			const target = /** @type {Element} */ (evt.target);

			// Step 4: Check if the event target itself matches the selector.
			// Ensure `target` is an Element and has the `matches` method before calling it.
			// `matches` is a standard DOM method that checks if an element would be selected
			// by the specified CSS selector.
			if (target && typeof target.matches === 'function') {
				try {
					// Attempt to match the event target against the selector.
					if (target.matches(selector)) {
						// Step 5: If the target matches, execute the callback.
						// `callback.call(target, evt)` invokes the provided `callback` function:
						// - `target`: Sets the `this` context inside the `callback` to be the `target` element
						//   (the element that matched the selector).
						// - `evt`: Passes the original event object as an argument to the `callback`.
						callback.call(target, evt);
					}
				} catch (error) {
					// Step 6: Handle errors from `target.matches(selector)`.
					// The `matches()` method can throw a `SyntaxError` if the `selector` string
					// is not a valid CSS selector.
					// We catch this error silently to prevent it from stopping the execution of
					// this main event listener, which might be handling other delegations or tasks.
					// For debugging, one might log this error:
					// console.warn(`Error in onDelegate selector matching for selector "${selector}":`, error);
				}
			}
			// If target is not an Element, or doesn't have `matches`, or doesn't match the selector,
			// or if `matches` throws an error, the callback is not executed for this event.
		},
		options, // Pass through the event listener options (e.g., capture, once, passive).
	);
	// The function does not return a reference to the anonymous listener,
	// making it harder to remove later with removeEventListener unless the calling code
	// wraps this or uses a more complex pattern.
}
