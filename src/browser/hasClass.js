/**
 * Checks if a DOM element has a specific CSS class.
 *
 * This function safely handles cases where:
 * - The `element` is null, undefined, or does not have a `classList` property.
 * - The `className` is null, undefined, or an empty string.
 * - `element.classList.contains` might throw an error (e.g., for invalid class name syntax,
 *   though modern browsers are often permissive).
 * In all such exceptional cases, the function will return `false`.
 *
 * @param {Element} element - The DOM element to check.
 * @param {string} className - The CSS class name to look for.
 * @returns {boolean} Returns `true` if the element has the specified class, `false` otherwise.
 *
 * @example
 * // HTML: <div id="myDiv" class="active featured"></div>
 * const myDiv = document.getElementById('myDiv');
 *
 * if (myDiv) {
 *   console.info(hasClass(myDiv, 'active'));   // true
 *   console.info(hasClass(myDiv, 'featured')); // true
 *   console.info(hasClass(myDiv, 'hidden'));   // false
 *
 *   // Invalid class name (e.g., with space) - should return false
 *   console.info(hasClass(myDiv, 'invalid class')); // false (and logs error internally if browser throws)
 *
 *   // Empty class name
 *   console.info(hasClass(myDiv, '')); // false
 * }
 *
 * // Null element
 * console.info(hasClass(null, 'active')); // false
 *
 * // Element without classList (e.g., a text node - though Element type hint implies it has classList)
 * // const textNode = document.createTextNode('text');
 * // console.info(hasClass(textNode, 'active')); // false (if it were passed, though TS would complain)
 */
export function hasClass(element, className) {
	// Check for invalid element or className early
	if (!element?.classList || !className) {
		return false;
	}

	try {
		// element.classList is confirmed to exist and be a DOMTokenList by the guard clause.
		// DOMTokenList.contains is a standard method.
		// The try-catch handles errors if className has invalid characters (spaces, etc.),
		// which can cause .contains() to throw in stricter environments or older browsers.
		return (
			typeof element.classList.contains === 'function' &&
			element.classList.contains(className)
		);
	} catch (error) {
		// Silently handle errors from classList.contains (e.g., invalid character in className)
		// console.error(`Error checking class "${className}":`, error); // Optional: for debugging
		return false;
	}
}
