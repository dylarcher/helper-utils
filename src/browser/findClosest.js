/**
 * @description Gets the closest ancestor of the current element (or the current element itself) which matches the selectors.
 * @param {Element} element - The starting DOM element.
 * @param {string} selector - A string containing a selector list.
 * @returns {Element|null} The closest ancestor element or null.
 * @example
 * const formElement = findClosest(document.getElementById('submitButton'), 'form');
 */
function findClosest(element, selector) {
    return element ? element.closest(selector) : null
}
// Similar for getParent, getChildren, siblings