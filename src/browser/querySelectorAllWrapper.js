/**
 * @description Selects all elements matching the CSS selector within an optional parent, returning them as an Array.
 * @param {string} selector - The CSS selector to match.
 * @param {Element|Document} [container=document] - The parent element to search within.
 * @returns {Element[]} An array of matching elements (empty if none found).
 * @example
 * const allImages = querySelectorAllWrapper('img');
 * const listItems = querySelectorAllWrapper('li', document.getElementById('myList'));
 */
export function querySelectorAllWrapper(selector, container) {
	// Use document as fallback only if it exists and container is not provided
	const targetContainer =
		container || (typeof document !== "undefined" ? document : null);

	if (
		!targetContainer ||
		typeof targetContainer.querySelectorAll !== "function"
	) {
		return [];
	}

	try {
		return Array.from(targetContainer.querySelectorAll(selector));
	} catch (error) {
		return [];
	}
}
