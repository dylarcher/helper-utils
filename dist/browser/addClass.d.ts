/**
 * Adds one or more CSS classes to a DOM element.
 * Filters out falsy values from classNames to prevent errors.
 *
 * @param {Element} element - The DOM element to which classes will be added.
 * @param {...string} classNames - The CSS class(es) to add. Can include falsy values, which will be ignored.
 * @returns {void}
 *
 * @example
 * // Assuming an element <div id="myElement"></div> exists
 * const el = document.getElementById('myElement');
 * addClass(el, 'new-class', 'another-class');
 * // el.classList will now be "new-class another-class"
 *
 * addClass(el, null, 'active', undefined, 'highlight');
 * // el.classList will now be "new-class another-class active highlight"
 */
export function addClass(element: Element, ...classNames: string[]): void;
