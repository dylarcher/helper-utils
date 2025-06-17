/**
 * A robust wrapper for `document.querySelector` or `element.querySelector` that finds
 * and returns the first DOM element matching the specified CSS selector.
 *
 * This function offers a layer of safety and convenience over direct use of `querySelector`:
 * 1.  **Error Handling**: It includes a `try...catch` block to gracefully handle errors
 *     that `querySelector` might throw (e.g., due to a syntactically invalid CSS selector).
 *     In case of such an error, it returns `null` instead of breaking the script.
 * 2.  **Container Logic**:
 *     - If a `container` argument is explicitly passed (even if it's `null` or `undefined`),
 *       the function attempts to use that `container`. If this explicit `container` is invalid
 *       (e.g., `null`, `undefined`, or an object without a `querySelector` method), the function returns `null`.
 *     - If no `container` argument is passed, it defaults to searching within the global `document`
 *       (if `document` is available in the current JavaScript environment).
 *     - If no `container` argument is passed and `document` is not available (e.g., in a pure
 *       Node.js environment), it returns `null`.
 * 3.  **Return Value**: Consistent with `querySelector`, it returns the first matching `Element`
 *     or `null` if no match is found.
 *
 * This function is particularly useful for ensuring that querying the DOM does not inadvertently
 * throw errors and for providing a clear default search context. It differs from
 * `querySelectorAllWrapper` in that it only returns the *first* matching element, not a collection.
 *
 * @param {string} selector - The CSS selector string to match the first element against.
 * @param {Document | Element} [container] - Optional. The parent `Document` or `Element`
 *   within which to search for the matching element. If not explicitly provided, it defaults
 *   to the global `document`. If an explicit but falsy value (like `null`) is passed for
 *   `container`, the function will return `null`.
 * @returns {Element | null} The first DOM Element that matches the selector, or `null` if:
 *   - No element matches the selector.
 *   - The `selector` is syntactically invalid.
 *   - The specified `container` (or the default `document`) is not valid for querying or is unavailable.
 *
 * @example
 * // HTML structure:
 * // <div id="appRoot">
 * //   <p class="greeting">Hello World</p>
 * //   <p class="message special">This is a test.</p>
 * //   <span class="info"></span>
 * // </div>
 *
 * // Example 1: Basic usage, searching within the entire document
 * const appRootElement = querySelectorWrapper('#appRoot'); // Gets <div id="appRoot">
 * const firstParagraph = querySelectorWrapper('p');    // Gets <p class="greeting">
 *
 * // Example 2: Searching within a specific container element
 * if (appRootElement) {
 *   const greetingInRoot = querySelectorWrapper('.greeting', appRootElement); // Gets <p class="greeting">
 *   const spanInRoot = querySelectorWrapper('span.info', appRootElement);     // Gets <span class="info">
 *   const nonExistentInRoot = querySelectorWrapper('.footer', appRootElement); // null
 * }
 *
 * // Example 3: Selector does not match any element
 * const noMatchElement = querySelectorWrapper('.non-existent-class'); // Returns null
 *
 * // Example 4: Using an invalid CSS selector
 * const invalidSelectorResult = querySelectorWrapper(':[invalid-css-selector]');
 * console.log(invalidSelectorResult); // Output: null (error is caught, null returned)
 *
 * // Example 5: Explicitly passing null or undefined as the container
 * const resultWithNullContainer = querySelectorWrapper('p', null);
 * console.log(resultWithNullContainer); // Output: null
 * const resultWithUndefinedContainer = querySelectorWrapper('p', undefined);
 * console.log(resultWithUndefinedContainer); // Output: null
 *
 * // Example 6: No container argument, in an environment where `document` is not available
 * // (e.g., pure Node.js without DOM emulation)
 * // const resultInNode = querySelectorWrapper('body');
 * // console.log(resultInNode); // Output: null (if document is undefined)
 */
export function querySelectorWrapper(selector, container) {
	// Step 1: Determine the target container for the query.
	// The `arguments.length >= 2` check determines if the `container` argument was explicitly passed.
	// - If `container` was passed (even as `null` or `undefined`), `targetContainer` becomes that passed value.
	// - If `container` was NOT passed, `targetContainer` defaults to the global `document` (if available),
	//   otherwise it becomes `null` (e.g., in a non-browser environment).
	const targetContainer =
		arguments.length >= 2 // Checks if 'container' was explicitly passed in the function call.
			? container // Use the passed 'container' value directly.
			: typeof document !== 'undefined'
				? document // If no 'container' passed, and 'document' is available, default to document.
				: null; // If no 'container' passed and no 'document', targetContainer is null.

	// Step 2: Validate the determined target container.
	// Check if `targetContainer` is truthy (not null, undefined, etc.) and if it actually
	// has a `querySelector` method. This ensures we don't try to call `querySelector`
	// on an invalid object (e.g., if `null` was explicitly passed as container).
	if (!targetContainer || typeof targetContainer.querySelector !== 'function') {
		// If the container is invalid or doesn't support `querySelector`,
		// return `null` as no query can be performed.
		return null;
	}

	try {
		// Step 3: Execute `querySelector` on the target container.
		// `targetContainer.querySelector(selector)` searches for the first element within
		// `targetContainer` that matches the specified `selector`.
		// - If a match is found, it returns that `Element` object.
		// - If no match is found, it returns `null`.
		return targetContainer.querySelector(selector);
	} catch (error) {
		// Step 4: Handle potential errors during `querySelector`.
		// `querySelector` can throw an error (typically a `DOMException` with `SyntaxError`)
		// if the provided `selector` string is not a valid CSS selector.
		// By catching this error, the wrapper function provides robustness.
		// Instead of letting the error propagate, it returns `null`.
		// For debugging, one might uncomment the following line:
		// console.error(`Error in querySelectorWrapper with selector "${selector}" on container:`, targetContainer, error);
		return null;
	}
}
