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
export function addClass(element: Element, ...classNames: string[]): void;
