/**
 * Toggles a single CSS class on a given DOM element.
 * This function utilizes the `element.classList.toggle()` method, which can add
 * or remove a class depending on its presence, or force addition/removal
 * based on an optional second boolean argument.
 *
 * The function includes safeguards:
 * - It does nothing if the provided `element` is `null`, `undefined`, or does not
 *   possess a `classList` property.
 * - It does nothing if `className` is falsy (e.g., `null`, `undefined`, or an empty string).
 * - It includes a `try...catch` block because `element.classList.toggle()` can throw
 *   an error (e.g., a `DOMException` with `SyntaxError` or `InvalidCharacterError`)
 *   if the `className` string contains spaces or other characters invalid for class names.
 *   In such error cases, this function will silently ignore the error.
 *
 * The `force` parameter behavior:
 * - If `force` is `true`: The `className` will be added to the element. If it's already
 *   present, it remains. `element.classList.toggle()` returns `true`.
 * - If `force` is `false`: The `className` will be removed from the element. If it's not
 *   present, nothing changes. `element.classList.toggle()` returns `false`.
 * - If `force` is `undefined` (not provided): The `className` is toggled. If present,
 *   it's removed (and `toggle()` returns `false`); if not present, it's added
 *   (and `toggle()` returns `true`).
 * This wrapper function itself returns `void`.
 *
 * @param {Element | null | undefined} element - The DOM element on which to toggle the class.
 * @param {string | null | undefined} className - The CSS class name to be toggled. Must be a single,
 *                                   non-empty string without spaces.
 * @param {boolean} [force] - Optional. A boolean value:
 *                            - If `true`, forces the class to be added.
 *                            - If `false`, forces the class to be removed.
 *                            - If omitted, the class is simply toggled based on its current state.
 * @returns {void} This function does not return a value.
 *
 * @example
 * // HTML: <div id="box" class="visible active"></div>
 * const myBox = document.getElementById('box');
 *
 * if (myBox) {
 *   // Example 1: Simple toggle (remove 'active' as it's present)
 *   toggleClass(myBox, 'active');
 *   // myBox.className is now "visible"
 *   console.log(myBox.className);
 *
 *   // Example 2: Simple toggle (add 'active' as it's not present)
 *   toggleClass(myBox, 'active');
 *   // myBox.className is now "visible active"
 *   console.log(myBox.className);
 *
 *   // Example 3: Force add 'highlight' class (it's not present, so it's added)
 *   toggleClass(myBox, 'highlight', true);
 *   // myBox.className is now "visible active highlight"
 *   console.log(myBox.className);
 *
 *   // Example 4: Force add 'active' class again (it's already present, remains present)
 *   toggleClass(myBox, 'active', true);
 *   // myBox.className is still "visible active highlight"
 *   console.log(myBox.className);
 *
 *   // Example 5: Force remove 'visible' class (it's present, so it's removed)
 *   toggleClass(myBox, 'visible', false);
 *   // myBox.className is now "active highlight"
 *   console.log(myBox.className);
 *
 *   // Example 6: Force remove 'nonExistent' class (it's not present, nothing changes)
 *   toggleClass(myBox, 'nonExistent', false);
 *   // myBox.className is still "active highlight"
 *   console.log(myBox.className);
 *
 *   // Example 7: Invalid class name (empty string - silently ignored)
 *   toggleClass(myBox, '');
 *   console.log(myBox.className); // Remains "active highlight"
 *
 *   // Example 8: Invalid class name (contains space - silently ignored due to try-catch)
 *   toggleClass(myBox, 'some invalid class');
 *   console.log(myBox.className); // Remains "active highlight"
 * }
 *
 * // Example 9: Null element (does nothing)
 * toggleClass(null, 'anyClass');
 */
export function toggleClass(element, className, force) {
	// Step 1: Validate inputs.
	// Check if `element` is a valid DOM element with a `classList` property.
	// Also check if `className` is a truthy string (not null, undefined, or empty).
	// `element.classList.toggle('')` would throw an error.
	if (element?.classList && className && typeof className === 'string') {
		try {
			// Step 2: Use `element.classList.toggle()`.
			// `element.classList` returns a `DOMTokenList`.
			// The `toggle()` method behavior:
			// - If `force` is undefined:
			//   - Removes `className` if it exists, returns `false`.
			//   - Adds `className` if it doesn't exist, returns `true`.
			// - If `force` is true:
			//   - Adds `className` if it doesn't exist.
			//   - If it already exists, it remains.
			//   - Always returns `true` (indicating the class is now present).
			// - If `force` is false:
			//   - Removes `className` if it exists.
			//   - If it doesn't exist, nothing changes.
			//   - Always returns `false` (indicating the class is now not present, or wasn't to begin with).
			//
			// This function (`toggleClass`) itself returns `void`, not the result of `element.classList.toggle()`.
			element.classList.toggle(className, force);
		} catch (_error) {
			// Step 3: Handle potential errors.
			// `classList.toggle()` can throw an error if `className` contains invalid characters
			// (like spaces), as class names must be single tokens.
			// Silently ignore the error to prevent breaking the calling script.
			// For debugging, one might uncomment:
			// console.error(`Error toggling class "${className}" on element:`, element, error);
		}
	}
	// If element is invalid or className is invalid/empty, the function does nothing.
}
