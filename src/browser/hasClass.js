/**
 * Checks if a given DOM element has a specific CSS class.
 * This function provides a robust way to check for class existence,
 * utilizing the `element.classList.contains()` method.
 *
 * It includes several safeguards:
 * - Returns `false` if the provided `element` is `null`, `undefined`, or does not
 *   possess a `classList` property (e.g., it's not a valid Element node).
 * - Returns `false` if the `className` is `null`, `undefined`, or an empty string,
 *   as these are not valid class names to check for.
 * - Includes a `try...catch` block because `element.classList.contains()` can throw
 *   an error (e.g., a `DOMException` with `SyntaxError` or `InvalidCharacterError`)
 *   if the `className` string contains spaces or other characters invalid for class names.
 *   In such error cases, this function will return `false`.
 *
 * @param {Element | null | undefined} element - The DOM element to inspect.
 * @param {string | null | undefined} className - The CSS class name to search for within the element's class list.
 * @returns {boolean} Returns `true` if the element has the specified class, and `false` otherwise
 *                    (including cases of invalid input or internal errors).
 *
 * @example
 * // HTML structure:
 * // <div id="testElement" class="active featured user-profile"></div>
 * // <span id="emptyElement"></span>
 *
 * const el = document.getElementById('testElement');
 * const emptyEl = document.getElementById('emptyElement');
 *
 * if (el) {
 *   // Basic checks
 *   console.log(hasClass(el, 'active'));   // Output: true
 *   console.log(hasClass(el, 'featured')); // Output: true
 *   console.log(hasClass(el, 'user-profile')); // Output: true
 *   console.log(hasClass(el, 'hidden'));   // Output: false (class not present)
 *
 *   // Checks with potentially problematic class names
 *   console.log(hasClass(el, ''));         // Output: false (empty class name string)
 *   console.log(hasClass(el, ' '));        // Output: false (class name with only space, invalid)
 *   console.log(hasClass(el, 'active featured')); // Output: false (contains space, invalid for .contains())
 * }
 *
 * // Checks with an element that has no classes
 * if (emptyEl) {
 *   console.log(hasClass(emptyEl, 'active')); // Output: false
 * }
 *
 * // Checks with invalid inputs
 * console.log(hasClass(null, 'active'));          // Output: false (null element)
 * console.log(hasClass(undefined, 'active'));     // Output: false (undefined element)
 * if (el) {
 *    console.log(hasClass(el, null));             // Output: false (null class name)
 *    console.log(hasClass(el, undefined));        // Output: false (undefined class name)
 * }
 *
 * // Example with a non-element node (e.g., a text node)
 * // const textNode = document.createTextNode("hello");
 * // console.log(hasClass(textNode, "anyClass")); // Output: false (textNode.classList is undefined)
 */
export function hasClass(element, className) {
	// Step 1: Validate inputs.
	// Check if `element` is a valid DOM element with a `classList` property.
	// The optional chaining `element?.classList` safely handles `element` being null or undefined.
	// Also check if `className` is a non-empty string. `classList.contains('')` would throw.
	if (!element?.classList || !className || typeof className !== 'string' || className.trim() === '') {
		return false; // Invalid element or className, so it cannot have the class.
	}

	try {
		// Step 2: Use `element.classList.contains()`.
		// `element.classList` returns a `DOMTokenList` collection of the class attributes of the element.
		// The `contains()` method of `DOMTokenList` checks if the specified class value is present.
		// It returns `true` if the class exists, `false` otherwise.

		// Before calling `contains`, it's good practice to ensure it's actually a function.
		// This is mostly for robustness in very unusual environments or with polyfills.
		// In all modern browsers that support `classList`, `contains` will be a function.
		if (typeof element.classList.contains === 'function') {
			// `contains()` will throw a DOMException (SyntaxError or InvalidCharacterError)
			// if the provided className string contains whitespace or is an empty string.
			// The initial check for `className` being empty or just whitespace should prevent this,
			// but the try-catch is a fallback.
			return element.classList.contains(className);
		} else {
			// If `element.classList.contains` is not a function (highly unlikely for valid Elements),
			// we cannot determine if it has the class.
			return false;
		}
	} catch (error) {
		// Step 3: Handle potential errors.
		// `classList.contains()` can throw an error if `className` contains invalid characters
		// (like spaces), as class names must be single tokens.
		// If an error occurs, we assume the class is not present or the check is invalid.
		// Optionally, log the error for debugging purposes:
		// console.error(`Error checking class "${className}" on element:`, element, error);
		return false;
	}
}
