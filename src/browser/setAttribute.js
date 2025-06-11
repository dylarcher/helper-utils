/**
 * Sets an attribute on an element.
 * @param {Element} element - The DOM element.
 * @param {string} attributeName - The name of the attribute to set.
 * @param {string} value - The value to set for the attribute.
 */
export function setAttribute(element, attributeName, value) {
	if (element && typeof element.setAttribute === "function" && attributeName) {
		element.setAttribute(attributeName, value);
	}
}
