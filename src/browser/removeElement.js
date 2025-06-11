/**
 * Removes an element from the DOM.
 * @param {Element} element - The DOM element to remove.
 */
export function removeElement(element) {
	if (element?.parentNode) {
		element.parentNode.removeChild(element);
	}
}
