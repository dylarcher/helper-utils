/**
 * Wrapper for querySelectorAll, returns an Array.
 * @param {string} selector - The CSS selector.
 * @param {Document|Element} [parent=document] - The parent element to search within.
 * @returns {Element[]} An array of matching elements.
 */
export function querySelectorAllWrapper(selector, parent = document) {
	if (!parent || typeof parent.querySelectorAll !== "function") {
		return [];
	}
	return Array.from(parent.querySelectorAll(selector));
}
