/**
 * @description Selects all elements matching the CSS selector within an optional parent, returning them as an Array.
 * @param {string} selector - The CSS selector to match.
 * @param {Element|Document} [parent=document] - The parent element to search within.
 * @returns {Element} An array of matching elements (empty if none found).
 * @example
 * const allImages = querySelectorAllWrapper('img');
 * const listItems = querySelectorAllWrapper('li', document.getElementById('myList'));
 */
declare function querySelectorAllWrapper(selector: string, parent?: Element | Document): Element;
