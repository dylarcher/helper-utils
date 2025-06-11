/**
 * Removes one or more CSS classes from an element.
 * @param {Element} element - The DOM element.
 * @param {...string} classNames - The CSS class(es) to remove.
 */
export function removeClass(element, ...classNames) {
	if (element?.classList) {
		element.classList.remove(...classNames.filter(Boolean));
	}
}
