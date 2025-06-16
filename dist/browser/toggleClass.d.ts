/**
 * Toggles a CSS class on a DOM element.
 * Can optionally force the class to be added or removed based on the 'force' parameter.
 * This function silently catches and ignores errors during the classList.toggle operation,
 * for instance, if the className is an empty string or contains invalid characters
 * (though modern browsers are quite permissive).
 * It also handles cases where the element is null or undefined without throwing an error.
 *
 * @param {Element} element - The DOM element on which to toggle the class.
 * @param {string} className - The CSS class to toggle. Should be a non-empty string.
 * @param {boolean} [force] - Optional. If true, the class is added (if not already present).
 * If false, the class is removed (if present). If undefined, the class is toggled.
 * @returns {void}
 *
 * @example
 * // Assuming an element <div id="myElement" class="active"></div> exists
 * const el = document.getElementById('myElement');
 *
 * // Toggle 'active' class (will remove it)
 * toggleClass(el, 'active');
 * // el.classList is now ""
 *
 * // Toggle 'active' class again (will add it back)
 * toggleClass(el, 'active');
 * // el.classList is now "active"
 *
 * // Force add 'highlight' class
 * toggleClass(el, 'highlight', true);
 * // el.classList is now "active highlight"
 *
 * // Force remove 'active' class
 * toggleClass(el, 'active', false);
 * // el.classList is now "highlight"
 *
 * // Attempt to toggle with an empty class name (silently ignored)
 * toggleClass(el, '');
 * // el.classList remains "highlight"
 */
export function toggleClass(element: Element, className: string, force?: boolean): void;
