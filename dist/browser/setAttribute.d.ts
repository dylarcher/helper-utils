/**
 * Sets an attribute with a specified value on a given DOM element.
 *
 * This function wraps the standard `element.setAttribute(attributeName, value)` method.
 * Key behaviors of `setAttribute`:
 * - If the attribute already exists on the element, its value is updated to the new value.
 * - If the attribute does not exist, it is created with the specified name and value.
 * - The `value` is always converted to a string. For example, if `value` is a number `123`,
 *   it's set as the string `"123"`. If `value` is `true` (boolean), it's set as `"true"`.
 * - To set a boolean attribute (like `disabled` or `checked`) in a way that makes it present
 *   (often interpreted as `true` by HTML), it's common practice to set its value to an empty
 *   string (e.g., `setAttribute('disabled', '')`). To remove it, use `element.removeAttribute()`.
 *   Setting a boolean attribute to `"false"` (string) does NOT remove it or make it false in HTML interpretation;
 *   it creates an attribute with the literal string value "false".
 *
 * This wrapper function includes safeguards:
 * - It does nothing if the provided `element` is `null` or `undefined`.
 * - It does nothing if `attributeName` is falsy (e.g., an empty string, `null`, `undefined`).
 * - It silently catches and ignores errors that might occur during the `setAttribute` operation
 *   (e.g., if `attributeName` contains characters that are invalid for attribute names, like spaces).
 *
 * @param {Element | null | undefined} element - The DOM element on which to set the attribute.
 *                                   If `null` or `undefined`, the function does nothing.
 * @param {string} attributeName - The name of the attribute to set (e.g., 'class', 'id', 'data-custom', 'disabled').
 *                                 Must be a non-empty string.
 * @param {string | number | boolean} value - The value to set for the attribute. This value will be
 *                                   converted to a string before being set.
 * @returns {void} This function does not return a value.
 *
 * @example
 * const myButton = document.getElementById('myButton');
 * const myInput = document.getElementById('myInput');
 *
 * if (myButton) {
 *   // Set standard attributes
 *   setAttribute(myButton, 'id', 'submitBtn');       // <button id="submitBtn">
 *   setAttribute(myButton, 'class', 'btn btn-primary'); // <button id="submitBtn" class="btn btn-primary">
 *   setAttribute(myButton, 'data-role', 'action');    // <button id="submitBtn" class="btn btn-primary" data-role="action">
 *
 *   // Update an existing attribute
 *   setAttribute(myButton, 'class', 'btn');           // <button id="submitBtn" class="btn" data-role="action">
 *
 *   // Using number and boolean values (converted to strings)
 *   setAttribute(myButton, 'data-count', 5);          // <button ... data-count="5">
 *   setAttribute(myButton, 'aria-pressed', true);     // <button ... aria-pressed="true">
 *
 *   // Setting a "boolean" attribute like 'disabled'
 *   // To make it present (and thus typically active):
 *   setAttribute(myButton, 'disabled', '');           // <button ... disabled=""> (button is disabled)
 *   // To remove it, you would use element.removeAttribute('disabled') or setAttribute(myButton, 'disabled', 'false')
 *   // is NOT how you make it false, that would be disabled="false".
 * }
 *
 * // Example with an input field
 * if (myInput) {
 *   setAttribute(myInput, 'type', 'text');
 *   setAttribute(myInput, 'value', 'Initial text');
 *   setAttribute(myInput, 'placeholder', 'Enter text here');
 * }
 *
 * // Example with a non-existent element (does nothing, no error)
 * const nonExistentEl = document.getElementById('doesNotExist');
 * setAttribute(nonExistentEl, 'class', 'active');
 *
 * // Example with an invalid attribute name (silently ignored due to try-catch)
 * if (myButton) {
 *   setAttribute(myButton, 'invalid name with spaces', 'someValue'); // No attribute set, error caught.
 * }
 *
 * // Example where attributeName is empty or element is null (does nothing)
 * if (myButton) {
 *   setAttribute(myButton, '', 'value'); // Does nothing
 * }
 * setAttribute(null, 'id', 'test'); // Does nothing
 */
export function setAttribute(element: Element | null | undefined, attributeName: string, value: string | number | boolean): void;
