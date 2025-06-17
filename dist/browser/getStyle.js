/**
 * Gets the computed style of an element.
 * @param {Element} element - The DOM element.
 * @param {string} [pseudoElt] - A string specifying the pseudo-element to match (e.g., '::before').
 * @returns {CSSStyleDeclaration|null} The computed style declaration object, or null if element is not valid.
 */
export function getStyle(element, pseudoElt) {
    if (!element ||
        typeof window === 'undefined' ||
        typeof window.getComputedStyle !== 'function') {
        return null;
    }
    return window.getComputedStyle(element, pseudoElt);
}
//# sourceMappingURL=getStyle.js.map