/**
 * Finds the closest ancestor of the given element (or the element itself)
 * that matches the specified CSS selector. This function is a wrapper around
 * the native `Element.closest()` method.
 *
 * If the provided `element` is `null` or `undefined`, this function will return `null`.
 * If the `selector` is invalid and causes `element.closest()` to throw an error,
 * this function will catch the error and return `null`.
 *
 * @param {Element} element - The starting DOM element from which to begin the search.
 * @param {string} selector - A string containing a CSS selector list to match against.
 * @returns {Element|null} The closest ancestor element matching the selector,
 *   the element itself if it matches, or `null` if no such element is found,
 *   if the input `element` is `null`, or if the `selector` is invalid.
 *
 * @example
 * // HTML:
 * // <form id="myForm">
 * //   <div class="field">
 * //     <input type="text" id="myInput" />
 * //     <button id="submitButton">Submit</button>
 * //   </div>
 * // </form>
 *
 * const button = document.getElementById('submitButton');
 * if (button) {
 *   // Find the closest form ancestor
 *   const formElement = findClosest(button, 'form'); // Returns the form#myForm element
 *   console.info(formElement ? formElement.id : 'No form found'); // 'myForm'
 *
 *   // Find the closest ancestor with class 'field'
 *   const fieldDiv = findClosest(button, '.field'); // Returns the div.field element
 *   console.info(fieldDiv ? fieldDiv.className : 'No field div found'); // 'field'
 *
 *   // The element itself can be a match
 *   const selfMatch = findClosest(button, '#submitButton'); // Returns the button itself
 *   console.info(selfMatch ? selfMatch.id : 'Button not found'); // 'submitButton'
 *
 *   // No matching ancestor
 *   const noMatch = findClosest(button, '.non-existent-class'); // Returns null
 *   console.info(noMatch); // null
 * }
 *
 * // If element is null
 * const nullElementResult = findClosest(null, 'div');
 * console.info(nullElementResult); // null
 *
 * // Example with an invalid selector
 * const invalidSel = findClosest(button, ':[invalid]');
 * console.info(invalidSel); // null (error caught internally)
 */
export function findClosest(element, selector) {
	if (!element) {
		return null;
	}
	try {
		// If element is null or undefined, element.closest would throw an error.
		// The guard above handles this.
		return element.closest(selector);
	} catch (_error) {
		// This typically catches SyntaxError if the selector is invalid.
		// console.error(`Error in findClosest with selector "${selector}":`, error); // Optional for debugging
		return null;
	}
}
