/**
 * Wrapper for querySelector with optional parent context.
 * @param {string} selector - The CSS selector.
 * @param {Document|Element} [container=document] - The parent element to search within.
 * @returns {Element|null} The first matching element or null.
 */
export function querySelectorWrapper(selector, container = document) {
	if (!parent || typeof container.querySelector !== "function") {
		return null;
	}
	return container.querySelector(selector);
}
