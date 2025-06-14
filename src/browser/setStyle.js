/**
 * Sets CSS style(s) on an element.
 * @param {HTMLElement} element - The DOM element.
 * @param {string|Record<string, string>} property - CSS property name (string) or an object of property-value pairs.
 * @param {string} [value] - CSS property value (if property is a string).
 */
export function setStyle(element, property, value) {
	if (!element || !element.style) {
		return;
	}

	if (typeof property === 'object' && property !== null) {
		for (const key of Object.keys(property)) {
			if (key && typeof key === 'string') {
				// @ts-ignore - Dynamic property access on style object
				element.style[key] = property[key];
			}
		}
	} else if (
		typeof property === 'string' &&
		property &&
		typeof value !== 'undefined'
	) {
		// @ts-ignore - Dynamic property access on style object
		element.style[property] = value;
	}
}
