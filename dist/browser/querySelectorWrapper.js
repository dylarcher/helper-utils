/**
 * Wrapper for querySelector with optional parent context.
 * @param {string} selector - The CSS selector.
 * @param {Document|Element} [parent=document] - The parent element to search within.
 * @returns {Element|null} The first matching element or null.
 */
export function querySelectorWrapper(selector, parent = document) {
    if (!parent || typeof parent.querySelector !== 'function')
        return null;
    return parent.querySelector(selector);
}
