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
export function hideElement(element) {
	if (!element?.style) {
		// Do nothing if element is null, undefined, or has no style property
		return;
	}
	try {
		// Prefer setProperty if available, as it's more robust for certain CSS interactions,
		// though for 'display' it's generally similar to direct assignment.
		if (typeof element.style.setProperty === 'function') {
			element.style.setProperty('display', 'none');
		} else {
			// Fallback for environments or elements where setProperty might not be standard (older browsers, SVG elements in some cases)
			element.style.display = 'none';
		}
	} catch (_error) {
		// Silently handle potential errors, e.g., if the style property is somehow locked or unwritable.
		// console.error('Failed to hide element:', error); // Optional: for debugging
	}
}
//# sourceMappingURL=hideElement.js.map
