/**
 * Adds one or more CSS classes to a specified DOM element.
 * This function robustly handles multiple class names and filters out any falsy values (e.g., null, undefined, empty strings)
 * before attempting to add them to the element's class list. This prevents errors and ensures clean class manipulation.
 *
 * @param {Element} element - The DOM element to which the CSS classes will be added.
 *                           Must be a valid DOM Element with a `classList` property.
 *                           If `null` or an object without `classList` is provided, the function does nothing.
 * @param {...string} classNames - A variable number of strings representing the CSS class(es) to add.
 *                                Falsy values (e.g., `null`, `undefined`, `''`) in this list will be ignored.
 *                                Class names with leading/trailing whitespace will be trimmed.
 * @returns {void} This function does not return a value.
 *
 * @example
 * // Basic usage: Adding a single class
 * const myDiv = document.createElement('div');
 * addClass(myDiv, 'active');
 * console.log(myDiv.className); // Output: "active"
 *
 * @example
 * // Adding multiple classes
 * const myButton = document.getElementById('myButton');
 * if (myButton) {
 *   addClass(myButton, 'btn', 'btn-primary', 'disabled');
 *   console.log(myButton.className); // Output: (something like) "btn btn-primary disabled"
 * }
 *
 * @example
 * // Handling falsy values among class names
 * const mySpan = document.createElement('span');
 * let userStatus = null;
 * let theme = 'dark-theme';
 * addClass(mySpan, 'base-style', userStatus, theme, undefined, '  extra-padding  ');
 * console.log(mySpan.className); // Output: "base-style dark-theme extra-padding"
 *
 * @example
 * // Attempting to add classes to a non-existent or invalid element
 * const nonExistentElement = document.getElementById('doesNotExist');
 * addClass(nonExistentElement, 'oops'); // Does nothing, no error thrown
 *
 * const plainObject = {};
 * addClass(plainObject, 'oops'); // Does nothing, no error thrown
 */
export function addClass(element, ...classNames) {
	// Check if the provided element is a valid DOM element with a classList property.
	// This prevents errors if `element` is null, undefined, or not a DOM element.
	if (element?.classList) {
		// Filter the incoming classNames array.
		// 1. `Boolean(className && className.trim())`:
		//    - `className && className.trim()`: Ensures className is not null/undefined and then trims whitespace.
		//      If className is falsy (null, undefined, ''), `className.trim()` would throw an error, so `className` check is first.
		//      An empty string or a string with only whitespace becomes `''` after trim.
		//    - `Boolean(...)`: Converts the trimmed string (or falsy value) to a boolean.
		//      Empty strings `''` become `false`, non-empty strings become `true`.
		// This effectively removes any falsy or empty/whitespace-only class names.
		const validClassNames = classNames
			.filter(className =>
				Boolean(className && typeof className === 'string' && className.trim()),
			)
			.map(className => className.trim());

		// Only proceed if there are valid class names to add.
		if (validClassNames.length > 0) {
			// Use the spread operator to pass the filtered and trimmed class names to element.classList.add().
			// `classList.add()` can take multiple arguments and will add each one as a class.
			element.classList.add(...validClassNames);
		}
	}
	// If element is invalid or has no classList, the function implicitly does nothing and returns undefined.
}
