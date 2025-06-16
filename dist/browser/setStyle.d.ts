/**
 * Sets one or more CSS styles on an HTML element.
 * The function does nothing if the provided element is null, undefined, or lacks a `style` property.
 *
 * @param {HTMLElement} element - The DOM element on which to set the styles.
 * @param {string | Record<string, string>} property - Either a single CSS property name (string, e.g., 'color')
 *   or an object where keys are CSS property names (camelCase or kebab-case, though camelCase is safer
 *   for direct `element.style` access) and values are the corresponding style values (e.g., `{ color: 'blue', fontSize: '16px' }`).
 * @param {string} [value] - The CSS property value to set if `property` is a string (e.g., 'red').
 *   This parameter is ignored if `property` is an object. Must be provided if `property` is a string.
 * @returns {void}
 *
 * @example
 * const myDiv = document.getElementById('myDiv');
 * if (myDiv) {
 *   // Set a single style property
 *   setStyle(myDiv, 'color', 'red');
 *   setStyle(myDiv, 'backgroundColor', 'lightgray');
 *
 *   // Set multiple style properties using an object
 *   setStyle(myDiv, {
 *     fontSize: '18px',
 *     fontWeight: 'bold',
 *     border: '1px solid black'
 *   });
 *
 *   // Example of property names (camelCase is generally used with element.style)
 *   // setStyle(myDiv, 'margin-top', '10px'); // Works, but element.style['margin-top']
 *   setStyle(myDiv, 'marginTop', '10px'); // More common for direct style access
 * }
 *
 * // No error if element is null
 * const nullElement = null;
 * setStyle(nullElement, 'color', 'red'); // Does nothing
 */
export function setStyle(element: HTMLElement, property: string | Record<string, string>, value?: string): void;
