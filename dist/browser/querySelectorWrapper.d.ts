/**
 * Wrapper for querySelector with optional parent context.
 * @param {string} selector - The CSS selector.
 * @param {Document|Element} [parent=document] - The parent element to search within.
 * @returns {Element|null} The first matching element or null.
 */
export function querySelectorWrapper(
	selector: string,
	parent?: Document | Element,
): Element | null;
