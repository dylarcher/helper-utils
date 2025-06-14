/**
 * Sets an attribute on an element.
 * @param {Element} element - The DOM element.
 * @param {string} attributeName - The name of the attribute to set.
 * @param {string} value - The value to set for the attribute.
 */
export function setAttribute(element, attributeName, value) {
	if (
		!element ||
		!attributeName ||
		typeof element.setAttribute !== 'function'
	) {
		return;
	}

	try {
		element.setAttribute(attributeName, value);
	} catch (_error) {
		// Silently handle errors when setting attributes
	}
}
