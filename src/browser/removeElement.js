/**
 * Removes a DOM element from its parent node in the DOM tree.
 *
 * This function uses the `element.parentNode.removeChild(element)` method, which is a
 * standard way to remove an element from the DOM.
 *
 * The function includes checks to ensure robustness:
 * - It does nothing if the provided `element` is `null`, `undefined`.
 * - It does nothing if the `element` does not have a `parentNode` (i.e., it's not
 *   currently attached to the DOM, or it's a top-level node like `document` or a `DocumentFragment`
 *   that isn't itself a child).
 * - Any errors encountered during the removal process (e.g., if the element was already
 *   removed by another script between the checks and the `removeChild` call) are silently
 *   caught and ignored to prevent script breakage.
 *
 * Note: Modern browsers also support the `element.remove()` method, which is a more direct
 * way for an element to remove itself. This function, however, uses the `removeChild` approach
 * for broader compatibility or specific use cases where interaction with the parent is preferred.
 *
 * @param {Element | null | undefined} element - The DOM element to be removed from its parent.
 *        If `null` or `undefined`, the function does nothing.
 * @returns {void} This function does not return a value.
 *
 * @example
 * // HTML structure:
 * // <div id="container">
 * //   <p id="paragraphToRemove">This paragraph will be removed.</p>
 * //   <span>Some other content.</span>
 * // </div>
 *
 * const p = document.getElementById('paragraphToRemove');
 * if (p) {
 *   removeElement(p);
 *   // Now, the <p> element is no longer a child of <div id="container">.
 *   // console.log(document.getElementById('paragraphToRemove')); // Output: null
 * }
 *
 * // Example 2: Attempting to remove an element that's not in the DOM
 * const detachedElement = document.createElement('div');
 * removeElement(detachedElement); // Does nothing, because detachedElement.parentNode is null. No error.
 *
 * // Example 3: Attempting to remove a null element
 * removeElement(null); // Does nothing, no error.
 *
 * // Example 4: Element is already removed by another means (demonstrating error handling)
 * const itemToRemove = document.createElement('li');
 * const list = document.createElement('ul');
 * list.appendChild(itemToRemove);
 * // removeElement(itemToRemove); // This would work
 *
 * // If itemToRemove was removed by other means before calling our function:
 * // itemToRemove.remove(); // or list.removeChild(itemToRemove);
 * // removeElement(itemToRemove); // This would do nothing gracefully due to parentNode check or try/catch.
 */
export function removeElement(element) {
	// Step 1: Validate the input element and its connection to the DOM.
	// Check if `element` is provided (not null/undefined).
	// Crucially, check if `element.parentNode` exists. An element can only be removed
	// from its parent if it has one. If `element.parentNode` is null, the element
	// is not currently attached to the DOM, or it's a node that cannot be a child (e.g., Document).
	// The optional chaining `element?.parentNode` handles cases where `element` itself is null/undefined.
	if (!element?.parentNode) {
		// If the element is invalid, or has no parent, there's nothing to remove it from.
		// Silently exit the function.
		return;
	}

	try {
		// Step 2: Remove the element from its parent.
		// `element.parentNode` is confirmed to be non-null from the guard clause above.
		// `removeChild()` is a standard method on `Node` objects (of which `Element` is a subtype).
		// It removes the specified child node (`element`) from the `parentNode`.
		// This operation modifies the DOM tree.
		// We ensure `removeChild` is a function before calling, though it's standard on parent nodes.
		if (typeof element.parentNode.removeChild === 'function') {
			element.parentNode.removeChild(element);
		}
		// Note: A more modern alternative is `element.remove()`, which directly removes the element
		// from its parent without needing to reference `parentNode`. However, this implementation
		// uses `removeChild`. Example: `if (typeof element.remove === 'function') { element.remove(); }`
	} catch (_error) {
		// Step 3: Handle potential errors during removal.
		// Errors are rare here if `element.parentNode` was valid moments before, but they could occur if:
		// - The DOM was modified by another script between the `parentNode` check and this `removeChild` call,
		//   making `element` no longer a child of `element.parentNode`.
		// - Other unexpected DOM state issues.
		// Silently ignore the error to prevent the calling script from breaking.
		// For debugging, one might uncomment the following line:
		// console.error('Failed to remove element:', element, error);
	}
	// The function does not return any value.
}
