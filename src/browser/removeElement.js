/**
 * Removes an element from the DOM.
 * @param {Element} element - The DOM element to remove.
 */
export function removeElement(element) {
	if (!element?.parentNode) {
		return;
	}

	try {
		if (typeof element.parentNode.removeChild === "function") {
			element.parentNode.removeChild(element);
		}
	} catch (error) {
		// Silently handle errors when removing elements
	}
}
