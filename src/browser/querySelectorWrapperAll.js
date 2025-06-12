/**
 * Wrapper for querySelectorAll, returns an Array.
 * @param {string} selector - The CSS selector.
 * @param {Document|Element} [container=document] - The parent element to search within.
 * @returns {Element[]} An array of matching elements.
 */
export function querySelectorAllWrapper(selector, container = document) {
	if (!container || typeof container.querySelectorAll !== "function") {
		return [];
	}
	return Array.from(container.querySelectorAll(selector));
}
