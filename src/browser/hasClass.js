/**
 * Checks if an element has a specific CSS class.
 * @param {Element} element - The DOM element.
 * @param {string} className - The CSS class to check for.
 * @returns {boolean} True if the element has the class, false otherwise.
 */
export function hasClass(element, className) {
	return !!(
		element?.classList &&
		className &&
		element.classList.contains(className)
	);
}
