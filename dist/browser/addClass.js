/**
 * Adds one or more CSS classes to an element.
 * @param {Element} element - The DOM element.
 * @param {...string} classNames - The CSS class(es) to add.
 */
export function addClass(element, ...classNames) {
	if (element === null || element === void 0 ? void 0 : element.classList) {
		element.classList.add(...classNames.filter(Boolean));
	}
}
