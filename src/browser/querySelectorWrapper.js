/**
 * Wrapper for querySelector with optional parent context.
 * @param {string} selector - The CSS selector.
 * @param {Document|Element} [container=document] - The parent element to search within.
 * @returns {Element|null} The first matching element or null.
 */
export function querySelectorWrapper(selector, container) {
	// Use document as fallback only if it exists and container is not provided
	const targetContainer =
		container || (typeof document !== "undefined" ? document : null);

	if (!targetContainer || typeof targetContainer.querySelector !== "function") {
		return null;
	}

	try {
		return targetContainer.querySelector(selector);
	} catch (error) {
		return null;
	}
}
