/**
 * Sets one or more inline CSS style properties on an HTML element.
 *
 * This function allows setting either a single style property or multiple style properties
 * at once by passing an object.
 *
 * How styles are applied:
 * - Styles are applied directly to the `element.style` object. This means they are
 *   set as inline styles on the element.
 * - Inline styles have high specificity but can be overridden by CSS rules marked with
 *   `!important`.
 * - For CSS property names that contain hyphens (e.g., `background-color`), they should generally
 *   be provided in camelCase when used as keys in an object or as the `property` string
 *   (e.g., `backgroundColor`). Direct assignment like `element.style.backgroundColor = 'red'`
 *   is standard. If providing kebab-case property names in an object, they would be accessed
 *   via bracket notation like `element.style['background-color'] = 'red'`. This function's
 *   object iteration `element.style[key] = property[key]` will work correctly if `key` is
 *   the camelCase version or if the browser supports direct assignment of kebab-case to `style` object
 *   via bracket notation (which modern browsers generally do).
 *
 * The function includes safeguards:
 * - It does nothing if the provided `element` is `null`, `undefined`, or lacks a `style` property.
 * - When setting a single style, it ensures the `property` name is a non-empty string and `value` is provided.
 * - When setting styles from an object, it iterates over the object's own keys.
 *
 * @param {HTMLElement | SVGElement | null | undefined} element - The DOM element on which to set the styles.
 *        If `null` or `undefined` or an element without a `style` property (e.g., a text node),
 *        the function does nothing.
 * @param {string | Record<string, string | number | undefined | null>} property - Either:
 *   1. A single CSS property name as a string (e.g., 'color', 'fontSize', 'backgroundColor').
 *      When using this form, the `value` parameter must also be provided.
 *   2. An object where keys are CSS property names (preferably camelCased, e.g., `fontSize`)
 *      and values are the corresponding style values (e.g., `{ color: 'blue', fontSize: '16px', opacity: 0.5 }`).
 *      Values can be strings or numbers (which will be converted to strings, usually with 'px' appended by the browser
 *      for length properties if unitless, though explicitly providing units is safer). `null` or `undefined` values
 *      for object properties might effectively remove/reset the style or be ignored by the browser.
 * @param {string | number | undefined | null} [value] - The CSS property value to set if `property` is a string (e.g., 'red', 10, '1.5em').
 *   This parameter is ignored if `property` is an object. It is required if `property` is a string.
 *   If `value` is `null` or `undefined` when `property` is a string, the style might be removed or set to its default,
 *   depending on the browser and property (often equivalent to setting it to an empty string).
 * @returns {void} This function does not return a value.
 *
 * @example
 * const myBox = document.getElementById('myBox');
 * if (myBox) {
 *   // Example 1: Set a single style property
 *   setStyle(myBox, 'color', 'white');
 *   setStyle(myBox, 'backgroundColor', 'dodgerblue'); // camelCase for 'background-color'
 *   setStyle(myBox, 'opacity', 0.9); // Numbers are usually fine for properties that accept them
 *
 *   // Example 2: Set multiple style properties using an object
 *   setStyle(myBox, {
 *     fontSize: '20px',
 *     fontWeight: 'bold',
 *     border: '2px solid navy',
 *     padding: '15px',
 *     borderRadius: '5px' // camelCase for 'border-radius'
 *   });
 *   // myBox.style will now have: color: white; background-color: dodgerblue; opacity: 0.9;
 *   //                            font-size: 20px; font-weight: bold; border: 2px solid navy;
 *   //                            padding: 15px; border-radius: 5px;
 *
 *   // Example 3: Using kebab-case in object (works in modern browsers via bracket notation)
 *   // setStyle(myBox, { 'margin-top': '10px' });
 *
 *   // Example 4: Setting a style to an empty string to remove/reset it
 *   // setStyle(myBox, 'fontStyle', ''); // Removes previously set font-style
 * }
 *
 * // Example 5: Element is null or invalid (does nothing, no error)
 * const nonExistent = null;
 * setStyle(nonExistent, 'color', 'red');
 *
 * // Example 6: Property is an empty string or value is undefined when property is a string
 * if (myBox) {
 *   setStyle(myBox, '', 'red'); // Does nothing
 *   setStyle(myBox, 'color', undefined); // May remove/reset 'color' style
 * }
 */
export function setStyle(element, property, value) {
    // Step 1: Validate the input element.
    // Check if `element` is provided and has a `style` property.
    // `element.style` is where inline styles are accessed and modified.
    if (!element || !element.style) {
        // If the element is invalid or lacks a style property, do nothing.
        return;
    }
    // Step 2: Determine if setting multiple styles (from an object) or a single style.
    if (typeof property === 'object' && property !== null) {
        // Case 1: `property` is an object containing multiple style key-value pairs.
        // Iterate over each key (CSS property name) in the `property` object.
        for (const key of Object.keys(property)) {
            // `key` is the CSS property name (e.g., 'fontSize', 'backgroundColor').
            // `property[key]` is the corresponding CSS value.
            // Ensure the key is a non-empty string before attempting to set the style.
            // `Object.keys` ensures `key` is a string.
            if (key) {
                // Assign the value to the element's style object.
                // `element.style[key]` uses bracket notation, which allows `key` to be a string variable.
                // This works for camelCased CSS properties (e.g., `element.style.fontSize = '16px'`).
                // It also works for kebab-cased properties if the browser supports assigning them
                // via bracket notation on the style object (e.g., `element.style['font-size'] = '16px'`).
                // camelCase is generally the more standard way to interact with `element.style` properties directly in JS.
                // @ts-ignore - Suppresses TypeScript errors for dynamic property access on `CSSStyleDeclaration`.
                // This is used because `key` is a string variable, and TypeScript cannot statically verify
                // if `key` corresponds to a valid property of `element.style`.
                element.style[key] = property[key];
            }
        }
    }
    else if (typeof property === 'string' && // `property` must be a string (single CSS property name).
        property && // Ensure the property name string is not empty.
        typeof value !== 'undefined' // Ensure `value` is provided when `property` is a string.
    // `null` is a valid value to set (often removes the style), so `value !== undefined` is used.
    ) {
        // Case 2: `property` is a string, representing a single CSS property name.
        // `value` is its corresponding value.
        // @ts-ignore - Similar to the object case, for dynamic property access.
        element.style[property] = value;
    }
    // If `property` is not an object or a valid string, or if `value` is missing for a string `property`,
    // the function does nothing further.
}
//# sourceMappingURL=setStyle.js.map