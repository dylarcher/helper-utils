/**
 * Sets an attribute with a given value on a DOM element.
 * This function will do nothing if the provided `element` is null/undefined,
 * or if `attributeName` is falsy (e.g., empty string, null, undefined).
 * It assumes `element` is a DOM Element and will thus have a `setAttribute` method.
 *
 * Any errors that occur during the `element.setAttribute(attributeName, value)`
 * operation (e.g., if `attributeName` contains invalid characters) are
 * silently caught and ignored.
 *
 * @param {Element} element - The DOM element on which to set the attribute.
 * @param {string} attributeName - The name of the attribute to set.
 * @param {string} value - The value to set for the attribute.
 * @returns {void}
 *
 * @example
 * const myImage = document.getElementById('myImage');
 * if (myImage) {
 *   setAttribute(myImage, 'src', 'new_image.jpg');
 *   setAttribute(myImage, 'alt', 'A new descriptive image text');
 *   setAttribute(myImage, 'data-custom', 'customValue');
 * }
 *
 * // Setting an attribute to an empty string
 * if (myImage) {
 *   setAttribute(myImage, 'title', '');
 * }
 *
 * // Example with a non-existent element
 * const nonExistent = document.getElementById('nonExistent');
 * setAttribute(nonExistent, 'class', 'active'); // Does nothing, no error thrown
 *
 * // Example with an invalid attribute name (silently ignored)
 * if (myImage) {
 *   setAttribute(myImage, 'invalid name', 'value'); // Browser would throw, but it's caught.
 * }
 *
 * // Example where attributeName is empty (does nothing)
 * if (myImage) {
 *  setAttribute(myImage, '', 'value');
 * }
 */
export function setAttribute(element: Element, attributeName: string, value: string): void;
