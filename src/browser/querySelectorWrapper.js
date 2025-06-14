/**
 * Wrapper for querySelector with optional parent context.
 * @param {string} selector - The CSS selector.
 * @param {Document|Element} [container=document] - The parent element to search within.
 * @returns {Element|null} The first matching element or null.
 */
export function querySelectorWrapper(selector, container) {
	// Only use document as fallback when no container argument is provided
	// Check arguments.length to distinguish between undefined being passed vs not passed
	const targetContainer =
		arguments.length >= 2
			? container // Container was explicitly provided (even if null/undefined)
			: typeof document !== 'undefined'
				? document
				: null; // No container provided, use document

	if (!targetContainer || typeof targetContainer.querySelector !== 'function') {
		return null;
	}

	try {
		return targetContainer.querySelector(selector);
	} catch (_error) {
		return null;
	}
}
