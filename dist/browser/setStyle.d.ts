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
export function setStyle(element: HTMLElement | SVGElement | null | undefined, property: string | Record<string, string | number | undefined | null>, value?: string | number | undefined | null): void;
