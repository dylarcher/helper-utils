/**
 * Toggles a CSS class on an element.
 * Can optionally force add or remove based on the 'force' boolean.
 * @param {Element} element - The DOM element.
 * @param {string} className - The CSS class to toggle.
 * @param {boolean} [force] - If true, adds the class; if false, removes it.
 */
export function toggleClass(element, className, force) {
	if (element?.classList && className) {
		element.classList.toggle(className, force);
	}
}
