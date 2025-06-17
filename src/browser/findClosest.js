/**
 * Finds the closest ancestor of a given DOM element (or the element itself)
 * that matches a specified CSS selector. This function utilizes the native
 * `Element.closest()` method, providing a safe wrapper that handles potential null inputs
 * and invalid selectors.
 *
 * The `Element.closest()` method traverses up the DOM tree, starting from the
 * element itself, then its parent, grandparent, and so on, until it finds an
 * element that matches the provided selector string.
 *
 * If the `element` argument is `null` or `undefined`, this function will gracefully
 * return `null` instead of throwing an error.
 * If the `selector` is syntactically invalid and causes `element.closest()` to throw
 * a `SyntaxError`, this function will catch that error and return `null`.
 *
 * @param {Element | null | undefined} element - The starting DOM element from which to begin the search.
 *                                    Can be `null` or `undefined`, in which case the function returns `null`.
 * @param {string} selector - A string containing one or more CSS selectors to match against
 *                            (e.g., 'div', '.my-class', '#my-id', 'div.my-class[data-attr="value"]').
 * @returns {Element | null} The first ancestor element (including the element itself) that matches
 *                           the selector. Returns `null` if:
 *                           - No such element is found.
 *                           - The input `element` is `null` or `undefined`.
 *                           - The `selector` string is invalid, causing a `SyntaxError`.
 *
 * @example
 * // Consider the following HTML structure:
 * // <div id="grandparent" class="container">
 * //   <div id="parent" class="row">
 * //     <p id="child" class="text-muted">Hello</p>
 * //   </div>
 * // </div>
 *
 * const childElement = document.getElementById('child');
 *
 * // Example 1: Find the closest ancestor with a specific ID
 * if (childElement) {
 *   const parentDiv = findClosest(childElement, '#parent');
 *   console.log(parentDiv ? parentDiv.id : 'Not found'); // Output: "parent"
 * }
 *
 * // Example 2: Find the closest ancestor with a specific class
 * if (childElement) {
 *   const containerDiv = findClosest(childElement, '.container');
 *   console.log(containerDiv ? containerDiv.id : 'Not found'); // Output: "grandparent"
 * }
 *
 * // Example 3: The element itself can be a match
 * if (childElement) {
 *   const selfMatch = findClosest(childElement, 'p.text-muted');
 *   console.log(selfMatch ? selfMatch.id : 'Not found'); // Output: "child"
 * }
 *
 * // Example 4: No matching ancestor
 * if (childElement) {
 *   const noMatch = findClosest(childElement, '.non-existent-class');
 *   console.log(noMatch); // Output: null
 * }
 *
 * // Example 5: Handling a null input element
 * const nullElementResult = findClosest(null, 'div');
 * console.log(nullElementResult); // Output: null
 *
 * // Example 6: Handling an invalid CSS selector
 * if (childElement) {
 *   const invalidSelectorResult = findClosest(childElement, ':[invalid-selector]');
 *   console.log(invalidSelectorResult); // Output: null (SyntaxError is caught)
 * }
 */
export function findClosest(element, selector) {
	// Guard clause: If the provided element is null or undefined,
	// attempting to call `element.closest()` would result in an error.
	// Instead, we return null directly, indicating no element can be found.
	if (!element) {
		return null;
	}

	try {
		// Call the native `Element.closest()` method.
		// This method starts with the current `element` and checks if it matches the `selector`.
		// If not, it moves to `element.parentElement` and checks again, continuing up the DOM tree
		// until a match is found or the root of the document is reached.
		// If a match is found, that element is returned.
		// If no match is found after checking all ancestors, `closest()` returns `null`.
		return element.closest(selector);
	} catch (error) {
		// Catch potential errors. The most common error here is a `SyntaxError`
		// if the provided `selector` string is not a valid CSS selector.
		// Instead of letting the error propagate, we return `null` to indicate failure.
		// This makes the function more robust to invalid inputs.
		// For debugging purposes, one might uncomment the console.error line:
		// console.error(`Error in findClosest with selector "${selector}":`, error);
		return null;
	}
}
