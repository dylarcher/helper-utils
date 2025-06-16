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
export function setStyle(element, property, value) {
    if (!element || !element.style) {
        return; // Do nothing if element is invalid or has no style property
    }
    if (typeof property === 'object' && property !== null) {
        // Iterate over an object of style properties
        for (const key of Object.keys(property)) {
            // Ensure key is a non-empty string before attempting to set style.
            // Object.keys ensures `key` is a string.
            if (key) {
                // @ts-ignore - Dynamic property access on style object.
                // CSSStyleDeclaration properties are typically camelCase (e.g., backgroundColor).
                // While browsers might handle kebab-case for some properties, camelCase is standard.
                element.style[key] = property[key];
            }
        }
    }
    else if (typeof property === 'string' &&
        property && // Ensure property name is a non-empty string
        typeof value !== 'undefined' // Ensure value is provided
    ) {
        // Set a single style property
        // @ts-ignore - Dynamic property access on style object.
        element.style[property] = value;
    }
}
//# sourceMappingURL=setStyle.js.map