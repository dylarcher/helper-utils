/**
 * Retrieves the computed style of a DOM element, optionally for a specified pseudo-element.
 *
 * This function is a wrapper around the standard `window.getComputedStyle()` method.
 * `getComputedStyle()` returns a `CSSStyleDeclaration` object that reflects the actual,
 * rendered style of an element after all stylesheets, inline styles, and browser default
 * styles have been applied. This is different from `element.style`, which only shows
 * inline styles directly set on the element.
 *
 * The function includes checks to ensure it's running in a browser environment where
 * `window` and `window.getComputedStyle` are available, and that a valid `element`
 * is provided. If these conditions are not met, it returns `null`.
 *
 * @param {Element} element - The DOM element for which to get the computed style.
 *                            If `null` or not a valid `Element`, the function returns `null`.
 * @param {string} [pseudoElt] - Optional. A string specifying the pseudo-element to match
 *                               (e.g., '::before', '::after', '::marker', '::first-line').
 *                               If omitted or `null`, the styles of the element itself are returned.
 * @returns {CSSStyleDeclaration | null} A live `CSSStyleDeclaration` object containing the
 *                                       computed styles of the element (and pseudo-element, if specified).
 *                                       This object is read-only. Returns `null` if the `element`
 *                                       is invalid or if `window.getComputedStyle` is not available.
 *
 * @example
 * // HTML: <div id="myDiv" style="color: red; padding-top: 10px;"></div>
 * // CSS: #myDiv { font-size: 16px; }
 * //      #myDiv::before { content: "Prefix: "; color: blue; }
 *
 * const divElement = document.getElementById('myDiv');
 *
 * if (divElement) {
 *   // Example 1: Get computed style of the element itself
 *   const styles = getStyle(divElement);
 *   if (styles) {
 *     console.log(styles.color);         // Output: "rgb(255, 0, 0)" (from inline style)
 *     console.log(styles.fontSize);      // Output: "16px" (from CSS stylesheet)
 *     console.log(styles.paddingTop);    // Output: "10px" (from inline style)
 *     console.log(styles.backgroundColor); // Output: "rgba(0, 0, 0, 0)" or "transparent" (browser default)
 *   }
 *
 *   // Example 2: Get computed style of a pseudo-element
 *   const beforeStyles = getStyle(divElement, '::before');
 *   if (beforeStyles) {
 *     console.log(beforeStyles.content); // Output: "\"Prefix: \"" (or "normal" if content not applied)
 *     console.log(beforeStyles.color);   // Output: "rgb(0, 0, 255)"
 *   }
 *
 *   // Example 3: Invalid element
 *   const nullStyles = getStyle(null, '::after');
 *   console.log(nullStyles); // Output: null
 * }
 *
 * // Example 4: Accessing a specific style property
 * // const PADDING_LEFT = "padding-left";
 * // const paddingLeft = styles ? styles.getPropertyValue(PADDING_LEFT) : 'N/A';
 * // console.log(`Padding left: ${paddingLeft}`);
 */
export function getStyle(element, pseudoElt) {
	// Step 1: Validate input and environment.
	// Check if `element` is provided and is a valid DOM element.
	// Check if `window` object exists (i.e., we are in a browser environment).
	// Check if `window.getComputedStyle` method itself is available.
	if (
		!element || // Element must exist and be truthy.
		typeof window === 'undefined' || // `window` must be defined.
		typeof window.getComputedStyle !== 'function' // `getComputedStyle` must be a function.
	) {
		// If any condition is not met, it's not possible to get computed styles.
		return null;
	}

	// Step 2: Call `window.getComputedStyle()`.
	// - `element`: The element for which to get the styles.
	// - `pseudoElt`: (Optional) A string specifying the pseudo-element (e.g., '::before', '::after').
	//   If this parameter is not provided or is `null`, styles for the element itself are returned.
	// This method returns a live `CSSStyleDeclaration` object. "Live" means that if the styles
	// on the element change, the values in this object will also update.
	// The returned object is read-only; attempting to set properties on it will usually
	// result in a TypeError in strict mode or fail silently.
	return window.getComputedStyle(element, pseudoElt);
}
