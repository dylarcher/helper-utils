/**
 * Sets CSS style(s) on an element.
 * @param {HTMLElement} element - The DOM element.
 * @param {string|object} property - CSS property name (string) or an object of property-value pairs.
 * @param {string} [value] - CSS property value (if property is a string).
 */
export function setStyle(element, property, value) {
	if (!element || !element.style) {
		return;
	}

	if (typeof property === "object") {
		for (const key of Object.keys(property)) {
			element.style[key] = property[key];
		}
	} else if (typeof property === "string" && typeof value !== "undefined") {
		element.style[property] = value;
	}
}
