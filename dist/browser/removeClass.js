/**
 * Removes one or more CSS classes from a DOM element.
 * Filters out falsy values from classNames to prevent errors.
 *
 * @param {Element} element - The DOM element from which classes will be removed.
 * @param {...string} classNames - The CSS class(es) to remove. Can include falsy values, which will be ignored.
 * @returns {void}
 *
 * @example
 * // Assuming an element <div id="myElement" class="active old-class"></div> exists
 * const el = document.getElementById('myElement');
 * removeClass(el, 'old-class', 'non-existent-class');
 * // el.classList will now be "active"
 *
 * removeClass(el, null, 'active', undefined);
 * // el.classList will now be ""
 */
export function removeClass(element, ...classNames) {
	if (element?.classList) {
		element.classList.remove(...classNames.filter(Boolean));
	}
}
//# sourceMappingURL=removeClass.js.map
