/**
 * Removes one or more CSS classes from a specified DOM element.
 * This function robustly handles multiple class names and filters out any falsy values
 * (e.g., `null`, `undefined`, empty strings) from the list of class names to be removed,
 * preventing errors that might occur if `classList.remove()` is called with such values.
 *
 * It utilizes the `element.classList.remove()` method, which can accept multiple
 * class names as arguments. Attempting to remove a class that the element does not
 * possess does not cause an error.
 *
 * @param {Element | null | undefined} element - The DOM element from which the CSS classes will be removed.
 *                           Must be a valid DOM Element with a `classList` property.
 *                           If `null`, `undefined`, or an object without `classList` is provided,
 *                           the function does nothing.
 * @param {...(string | null | undefined | '')} classNames - A variable number of strings representing the CSS class(es)
 *                               to remove. Falsy values or empty strings in this list will be ignored.
 * @returns {void} This function does not return a value.
 *
 * @example
 * // Scenario 1: Basic class removal
 * // HTML: <div id="myDiv" class="active featured important extra"></div>
 * const myDiv = document.getElementById('myDiv');
 * if (myDiv) {
 *   removeClass(myDiv, 'featured');
 *   console.log(myDiv.className); // Output: "active important extra"
 *
 *   // Scenario 2: Removing multiple classes, including one not present
 *   removeClass(myDiv, 'active', 'nonExistentClass', 'important');
 *   console.log(myDiv.className); // Output: "extra"
 * }
 *
 * // Scenario 3: Handling falsy values among class names to remove
 * // HTML: <span id="mySpan" class="visible highlight old-style"></span>
 * const mySpan = document.getElementById('mySpan');
 * if (mySpan) {
 *   removeClass(mySpan, 'old-style', null, 'highlight', undefined, '');
 *   console.log(mySpan.className); // Output: "visible"
 * }
 *
 * // Scenario 4: Attempting to remove all classes
 * // HTML: <p id="myParagraph" class="text bold"></p>
 * const myParagraph = document.getElementById('myParagraph');
 * if (myParagraph) {
 *   removeClass(myParagraph, 'text', 'bold');
 *   console.log(myParagraph.className); // Output: "" (empty string)
 * }
 *
 * // Scenario 5: Invalid element
 * removeClass(null, 'anyClass'); // Does nothing, no error thrown.
 * const plainObject = {};
 * removeClass(plainObject, 'anyClass'); // Does nothing, no error thrown.
 */
export function removeClass(element, ...classNames) {
	// Step 1: Validate the input element.
	// Check if `element` is provided (not null/undefined) and if it has a `classList` property.
	// `element?.classList` uses optional chaining for safe access.
	// If `element` is invalid or lacks `classList`, the function exits silently.
	if (element?.classList) {
		// Step 2: Filter the list of class names to remove.
		// `classNames.filter(Boolean)` creates a new array containing only truthy values
		// from the `classNames` arguments. This effectively removes `null`, `undefined`,
		// empty strings (`''`), `0`, `NaN`, and `false` if they were passed.
		// This is crucial because `element.classList.remove('')` would throw a DOMException.
		// Other falsy values might also cause issues or be ignored by `remove` in an unpredictable way.
		const validClassNamesToRemove = classNames.filter(Boolean);

		// Step 3: Remove the filtered class names if any are valid.
		// Only proceed if there are actual valid class names to remove.
		if (validClassNamesToRemove.length > 0) {
			// Use the spread operator (`...`) to pass the filtered class names as individual
			// arguments to `element.classList.remove()`.
			// For example, if `validClassNamesToRemove` is `['class1', 'class2']`,
			// this is equivalent to calling `element.classList.remove('class1', 'class2')`.
			// `classList.remove()` will:
			// - Remove each specified class if it's present on the element.
			// - Silently ignore any specified classes that are not present on the element (no error is thrown).
			element.classList.remove(...validClassNamesToRemove);
		}
	}
	// If element is invalid or has no classList, the function implicitly does nothing and returns undefined.
}
