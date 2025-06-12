/**
 * Checks if an element has a specific CSS class.
 * @param {Element} element - The DOM element.
 * @param {string} className - The CSS class to check for.
 * @returns {boolean} True if the element has the class, false otherwise.
 */
export function hasClass(element, className) {
	if (!element?.classList || !className) {
		return false;
	}

	try {
		return (
			typeof element.classList.contains === "function" &&
			element.classList.contains(className)
		);
	} catch (error) {
		// Handle cases where classList.contains throws an error
		return false;
	}
}
