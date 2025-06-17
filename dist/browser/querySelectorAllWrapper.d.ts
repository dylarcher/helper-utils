/**
 * A robust wrapper for `document.querySelectorAll` or `element.querySelectorAll`
 * that consistently returns an array of matching DOM elements.
 *
 * This function offers several advantages over using `querySelectorAll` directly:
 * 1.  **Array Return Type**: It always returns a true JavaScript `Array` instead of a `NodeList`.
 *     This allows immediate use of array methods like `map()`, `filter()`, `reduce()`, etc.,
 *     without needing manual conversion (e.g., `Array.from()`). While modern `NodeList`
 *     objects are iterable and have `forEach`, they lack other array methods.
 * 2.  **Error Handling**: It includes a `try...catch` block to gracefully handle errors
 *     that `querySelectorAll` might throw (e.g., due to a syntactically invalid CSS selector).
 *     In case of an error, it returns an empty array instead of breaking the script.
 * 3.  **Container Validation**: It checks if the provided `container` (or the default `document`)
 *     is valid and supports the `querySelectorAll` method. If not, it returns an empty array.
 *
 * If no elements match the selector, or if any error occurs, an empty array is returned.
 *
 * @param {string} selector - The CSS selector string to match elements against.
 * @param {Element | Document} [container] - Optional. The parent `Element` or `Document`
 *   within which to search for matching elements. If not provided, it defaults to the global
 *   `document` object (if available in the current JavaScript environment).
 * @returns {Element[]} An array of matching DOM elements. This array will be empty if:
 *   - No elements match the selector.
 *   - The `selector` is syntactically invalid.
 *   - The `container` is invalid, does not support `querySelectorAll`, or is not provided
 *     in an environment without a global `document`.
 *
 * @example
 * // Example 1: Get all images in the document
 * const allImages = querySelectorAllWrapper('img');
 * allImages.forEach(img => console.log(img.src)); // Safe to use forEach directly
 * const imageSources = allImages.map(img => img.src); // Safe to use map directly
 *
 * // Example 2: Get all list items within a specific <ul> element
 * const myListElement = document.getElementById('myList');
 * if (myListElement) {
 *   const listItems = querySelectorAllWrapper('li.active', myListElement);
 *   listItems.forEach(item => console.log(item.textContent));
 * } else {
 *   console.log("Element with ID 'myList' not found.");
 * }
 *
 * // Example 3: Using an invalid CSS selector
 * const elementsWithInvalidSelector = querySelectorAllWrapper(':[invalid-css-selector]');
 * console.log(elementsWithInvalidSelector.length); // Output: 0 (error is caught, empty array returned)
 *
 * // Example 4: Using a non-existent or invalid container
 * const nonExistentContainer = document.getElementById('doesNotExist'); // null
 * const elementsInNonExistent = querySelectorAllWrapper('a', nonExistentContainer);
 * console.log(elementsInNonExistent.length); // Output: 0
 *
 * // Example 5: No matching elements
 * const noMatches = querySelectorAllWrapper('.non-existent-class');
 * console.log(noMatches.length); // Output: 0
 *
 * // Example 6: Running in an environment without `document` (e.g., pure Node.js, no container given)
 * // const nodeElements = querySelectorAllWrapper('div');
 * // console.log(nodeElements.length); // Output: 0 (if document is undefined)
 */
export function querySelectorAllWrapper(selector: string, container?: Element | Document): Element[];
