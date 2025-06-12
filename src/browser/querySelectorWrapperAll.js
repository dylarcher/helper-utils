/**
 * Wrapper for querySelectorAll, returns an Array.
 * @param {string} selector - The CSS selector.
 * @param {Document|Element} [container=document] - The parent element to search within.
 * @returns {Element[]} An array of matching elements.
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
