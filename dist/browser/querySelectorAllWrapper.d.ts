/**
 * A robust wrapper for `querySelectorAll` that always returns an array of elements.
 * It selects all elements matching the CSS selector within an optional parent element or document.
 *
 * - If no elements match, it returns an empty array.
 * - If the provided `container` is invalid or does not support `querySelectorAll`, it returns an empty array.
 * - If `container` is not provided, it defaults to the global `document` (if available).
 * - If `document` is not available (e.g., in a non-browser environment) and no container is given,
 *   it returns an empty array.
 * - If an error occurs during `querySelectorAll` (e.g., due to an invalid selector),
 *   it catches the error and returns an empty array, preventing runtime exceptions.
 *
 * @param {string} selector - The CSS selector to match.
 * @param {Element|Document} [container] - Optional. The parent element or document to search within.
 *   Defaults to `document` if available and not provided.
 * @returns {Element[]} An array of matching DOM elements. This array is empty if no matches are found,
 *   if the selector is invalid, or if the container is not valid for querying.
 *
 * @example
 * // Get all images in the document
 * const allImages = querySelectorAllWrapper('img');
 * allImages.forEach(img => console.info(img.src));
 *
 * // Get all list items within a specific ul
 * const myList = document.getElementById('myList');
 * if (myList) {
 *   const listItems = querySelectorAllWrapper('li', myList);
 *   listItems.forEach(item => console.info(item.textContent));
 * }
 *
 * // Using an invalid selector (returns empty array, no error thrown)
 * const withInvalidSelector = querySelectorAllWrapper(':[invalid-selector]');
 * console.info(withInvalidSelector.length); // 0
 *
 * // Using a non-existent container (returns empty array, no error thrown)
 * const nonExistentContainer = document.getElementById('nonExistent');
 * const withNonExistentContainer = querySelectorAllWrapper('a', nonExistentContainer);
 * console.info(withNonExistentContainer.length); // 0
 */
export function querySelectorAllWrapper(selector: string, container?: Element | Document): Element[];
