/**
 * A robust wrapper for `querySelector` that finds the first element matching the
 * CSS selector, optionally within a specified parent container.
 *
 * Behavior:
 * - If no `container` argument is passed, it defaults to searching within the global `document` (if available).
 * - If `container` is explicitly passed (even as `null` or `undefined`), the function will use that value.
 *   If this explicit `container` is invalid (e.g., `null`, `undefined`, or an object without
 *   a `querySelector` method), the function returns `null`.
 * - If `document` is not available (e.g., in a non-browser environment) and no `container` is passed,
 *   it returns `null`.
 * - If `targetContainer.querySelector(selector)` throws an error (e.g., due to an invalid CSS selector),
 *   the error is caught, and the function returns `null`.
 * - If no element matches the selector, it returns `null` (standard `querySelector` behavior).
 *
 * @param {string} selector - The CSS selector string to match.
 * @param {Document|Element} [container] - Optional. The parent Document or Element to search within.
 *   If not provided, defaults to `document`. If explicitly provided as a falsy value,
 *   the function will likely return `null` due to failing the container validation.
 * @returns {Element|null} The first DOM Element matching the selector, or `null` if no match is found,
 *   the selector is invalid, or the container is not valid for querying.
 *
 * @example
 * // Assuming HTML: <div id="main"><p class="text">Hello</p><span></span></div>
 *
 * // Basic usage (defaults to document)
 * const mainDiv = querySelectorWrapper('#main'); // Gets <div id="main">
 * const firstP = querySelectorWrapper('p');    // Gets <p class="text">
 *
 * // With a valid container
 * if (mainDiv) {
 *   const pInMain = querySelectorWrapper('.text', mainDiv); // Gets <p class="text">
 *   const spanInMain = querySelectorWrapper('span', mainDiv); // Gets <span>
 * }
 *
 * // Selector not matching
 * const noMatch = querySelectorWrapper('.non-existent'); // null
 *
 * // Invalid selector (returns null, no error thrown)
 * const invalidSelector = querySelectorWrapper(':[invalid-selector]'); // null
 *
 * // Explicitly passing null as container
 * const nullContainer = querySelectorWrapper('p', null); // null
 *
 * // Explicitly passing undefined as container (if function is called with `querySelectorWrapper('p', undefined)`)
 * const undefinedContainer = querySelectorWrapper('p', undefined); // null
 *
 * // No container argument passed, in an environment where document is not available (e.g. specific Node.js test setup)
 * // (This would require mocking document to be undefined)
 * // const noDoc = querySelectorWrapper('p'); // null
 */
export function querySelectorWrapper(
	selector: string,
	container?: Document | Element,
	...args: any[]
): Element | null;
