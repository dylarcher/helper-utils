/**
 * Removes a DOM element from its parent node.
 * This function will do nothing if the provided element is null, undefined,
 * or if it does not have a parent node (i.e., it's not currently in the DOM).
 * Any errors encountered during the removal process (e.g., if the element
 * was already removed by another script) are silently caught and ignored.
 *
 * @param {Element} element - The DOM element to remove.
 * @returns {void}
 *
 * @example
 * const myElement = document.getElementById('myElement');
 * if (myElement) {
 *   removeElement(myElement); // myElement is removed from the DOM
 * }
 *
 * // Attempting to remove an element that's not in the DOM or is null
 * const detachedElement = document.createElement('div');
 * removeElement(detachedElement); // Does nothing, no error
 * removeElement(null); // Does nothing, no error
 *
 * // If an error occurs during removeChild (e.g. element is not a child of its parentNode anymore)
 * // it will be silently ignored.
 * const anotherElement = document.getElementById('anotherElement');
 * if (anotherElement && anotherElement.parentNode) {
 *   // anotherElement.parentNode.removeChild(anotherElement); // Manually remove it
 *   // removeElement(anotherElement); // This would now do nothing or catch internally if an error was thrown
 * }
 */
export function removeElement(element) {
    if (!element?.parentNode) {
        // Do nothing if element is null, undefined, or has no parentNode
        return;
    }
    try {
        // element.parentNode is confirmed to exist from the guard clause above.
        // removeChild is a standard method on Node.
        if (typeof element.parentNode.removeChild === 'function') {
            element.parentNode.removeChild(element);
        }
    }
    catch (_error) {
        // Silently handle potential errors during removal.
        // This could happen if the element was already removed or the DOM state changed unexpectedly.
        // console.error('Failed to remove element:', error); // Optional: for debugging
    }
}
