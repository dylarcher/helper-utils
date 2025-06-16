/**
 * Hides a DOM element by setting its display style to 'none'.
 * This function will do nothing if the provided element is null, undefined, or lacks a `style` property.
 * It attempts to use `element.style.setProperty('display', 'none')` for robustness,
 * falling back to `element.style.display = 'none'` if `setProperty` is not available.
 * Any errors encountered during the style modification are silently caught and ignored.
 *
 * @param {HTMLElement} element - The DOM element to hide.
 * @returns {void}
 *
 * @example
 * const tooltip = document.getElementById('tooltip');
 * if (tooltip) {
 *   hideElement(tooltip); // tooltip.style.display will be 'none'
 * }
 *
 * // Example with a non-existent or null element
 * const nonExistent = document.getElementById('nonExistent');
 * hideElement(nonExistent); // Does nothing, no error thrown
 *
 * hideElement(null); // Does nothing, no error thrown
 */
export function hideElement(element: HTMLElement): void;
