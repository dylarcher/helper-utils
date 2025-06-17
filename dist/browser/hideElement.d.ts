/**
 * Hides a given DOM element by setting its inline `display` style property to `'none'`.
 *
 * When an element's `display` style is set to `'none'`:
 * - The element is removed from the document's layout. It no longer takes up any space.
 * - The element and its descendants are not rendered on the page.
 * - The element cannot be interacted with (e.g., receive clicks or focus).
 * - Screen readers may ignore the element, impacting accessibility. If the element should be
 *   perceivable by assistive technologies but not visually, consider using an alternative
 *   method (e.g., an "sr-only" or "visually-hidden" CSS class).
 *
 * This function includes checks to ensure that the provided `element` is valid and has
 * a `style` property. If not, the function does nothing.
 * It attempts to use `element.style.setProperty('display', 'none')` for setting the style,
 * which is a standard DOM API, falling back to direct assignment (`element.style.display = 'none'`)
 * if `setProperty` is not available (though this is rare for `style` objects on HTML elements).
 * Any errors encountered during the style modification (e.g., if the `style` property were
 * somehow immutable, which is highly unlikely for `display`) are silently caught.
 *
 * @param {HTMLElement | SVGElement | null | undefined} element - The DOM element to hide.
 *        Can be an `HTMLElement` or `SVGElement`. If `null` or `undefined`, the function does nothing.
 * @returns {void} This function does not return a value.
 *
 * @example
 * // HTML: <div id="myComponent">Hello World</div>
 * //       <button id="hideButton">Hide Component</button>
 *
 * const componentToHide = document.getElementById('myComponent');
 * const button = document.getElementById('hideButton');
 *
 * if (button && componentToHide) {
 *   button.addEventListener('click', () => {
 *     hideElement(componentToHide);
 *     // After this, componentToHide.style.display will be 'none'.
 *     // The "Hello World" text will disappear from the page.
 *     console.log('Component hidden. Display style:', componentToHide.style.display);
 *   });
 * }
 *
 * // Example with a non-existent element:
 * const nonExistentElement = document.getElementById('doesNotExist');
 * hideElement(nonExistentElement); // Does nothing, no error is thrown.
 *
 * // Example with null input:
 * hideElement(null); // Does nothing, no error is thrown.
 */
export function hideElement(element: HTMLElement | SVGElement | null | undefined): void;
