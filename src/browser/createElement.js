/**
 * Creates a new DOM element with the specified tag name, attributes, and children.
 * This is a versatile utility for dynamically generating HTML structures in JavaScript.
 *
 * The function uses `document.createElement` for element instantiation. Errors from
 * `document.createElement` (e.g., for an invalid or non-standard `tagName`) will propagate.
 * Similarly, errors from `element.setAttribute` (e.g., for invalid attribute names)
 * will also propagate.
 *
 * Children can be a single string (which becomes a text node), a single DOM Node,
 * or an array containing a mix of strings and DOM Nodes. Falsy values (e.g., `null`, `undefined`)
 * within a children array are safely skipped. Numbers provided as children are converted to strings.
 *
 * @param {string} tagName - The HTML tag name for the element to create (e.g., 'div', 'span', 'a', 'custom-element').
 *                           Must be a valid HTML tag name.
 * @param {Record<string, string | number | boolean>} [attributes={}] - An optional object where keys are attribute names
 *   (e.g., 'class', 'id', 'data-custom', 'disabled') and values are the corresponding attribute values.
 *   Values will be coerced to strings by `setAttribute`. For boolean attributes (e.g., `disabled`, `checked`),
 *   provide `true` or `false`, though `setAttribute` will convert `true` to an empty string attribute and
 *   `false` will typically not add the attribute (behavior can vary slightly by attribute).
 *   It's common to use string values: `{ disabled: '' }` for `<button disabled>`.
 * @param {string | number | Node | Array<string | number | Node | null | undefined>} [children=[]] - Optional content to append
 *   to the created element.
 *   - A single string or number: creates a single text node.
 *   - A single DOM Node: appends the node directly.
 *   - An array: iterates through the array. Strings/numbers become text nodes, DOM Nodes are appended,
 *     `null` or `undefined` values are ignored.
 * @returns {Element} The newly created DOM element. The specific type will be a subtype of `Element`
 *   (e.g., `HTMLDivElement` for 'div', `SVGElement` for 'svg' if used in an SVG context, though this function
 *   is primarily for HTML).
 *
 * @example
 * // Example 1: Create a simple <div>
 * const div = createElement('div');
 * console.log(div.outerHTML); // Output: "<div></div>"
 *
 * @example
 * // Example 2: Create a <span> with text content and a class
 * const span = createElement('span', { class: 'highlight' }, 'Hello, world!');
 * console.log(span.outerHTML); // Output: "<span class="highlight">Hello, world!</span>"
 *
 * @example
 * // Example 3: Create an <a> tag with multiple attributes and text
 * const link = createElement('a', { href: '#', class: 'link active', 'data-id': 123, target: '_blank' }, 'Click me');
 * // Output: <a href="#" class="link active" data-id="123" target="_blank">Click me</a>
 *
 * @example
 * // Example 4: Create a <ul> with various types of children
 * const list = createElement('ul', { class: 'user-list' }, [
 *   createElement('li', { class: 'user-item' }, 'First item (string)'), // Child element from string
 *   'Second item (plain string)',                                      // Becomes a text node
 *   document.createTextNode('Third item (TextNode)'),                  // Already a TextNode
 *   null,                                                              // This will be skipped
 *   createElement('li', {}, [                                          // Nested children
 *     'User: ',
 *     createElement('strong', {}, 'Admin'),
 *     123 // Number converted to text
 *   ]),
 *   undefined // Also skipped
 * ]);
 * // Renders something like:
 * // <ul class="user-list">
 * //   <li class="user-item">First item (string)</li>
 * //   Second item (plain string)
 * //   Third item (TextNode)
 * //   <li>User: <strong>Admin</strong>123</li>
 * // </ul>
 *
 * @example
 * // Example 5: Creating an element with a boolean attribute
 * const input = createElement('input', { type: 'checkbox', checked: true, disabled: '' });
 * console.log(input.outerHTML); // Output: <input type="checkbox" checked="" disabled="">
 * // Note: `setAttribute('checked', true)` results in `checked=""`.
 * // To remove, you'd use `removeAttribute('checked')`.
 *
 * @example
 * // Example 6: Error handling for invalid tag name
 * try {
 *   const invalidEl = createElement('invalid-tag-@!#');
 * } catch (e) {
 *   console.error(e.message); // e.g., "The tag name provided ('invalid-tag-@!#') is not a valid name."
 * }
 */
export function createElement(
	tagName,
	attributes = /** @type {Record<string, any>} */ ({}), // Allow any value type for attributes, setAttribute will coerce
	children = [],
) {
	// Step 1: Create the DOM element using the provided tagName.
	// `document.createElement` is the standard browser API for this.
	// If tagName is invalid (e.g., contains spaces, special characters not allowed),
	// this will throw a DOMException.
	const element = document.createElement(tagName);

	// Step 2: Set attributes on the newly created element.
	// Iterate over the keys of the `attributes` object.
	for (const key in attributes) {
		// Ensure the key is a direct property of the attributes object and not from its prototype chain.
		if (Object.prototype.hasOwnProperty.call(attributes, key)) {
			const value = attributes[key];
			// `setAttribute` will coerce the value to a string.
			// For boolean attributes like 'disabled' or 'checked', an empty string value ('')
			// is often used to represent true (e.g., <button disabled>).
			// If value is `null` or `undefined`, setAttribute might behave differently across browsers/attributes,
			// generally, it's better to explicitly not call setAttribute or use removeAttribute.
			// However, common usage passes strings, numbers, or booleans.
			if (value != null) { // Skip if value is null or undefined
				element.setAttribute(key, value);
			}
		}
	}

	// Step 3: Append children to the element.
	// Children can be a single item or an array of items.
	if (Array.isArray(children)) {
		// If children is an array, iterate through it and append each child.
		appendChildrenInternal(children, element);
	} else {
		// If children is a single item (string, number, Node), append it directly.
		appendChildInternal(children, element);
	}

	/**
	 * Internal helper function to append a single child to a parent element.
	 * This function handles strings, numbers, and DOM Nodes.
	 * @param {string | number | Node | null | undefined} child - The child to append.
	 * @param {Element} parentElement - The parent DOM element.
	 * @returns {void}
	 */
	function appendChildInternal(child, parentElement) {
		// If the child is a string, create a new text node and append it.
		if (typeof child === 'string') {
			parentElement.appendChild(document.createTextNode(child));
		}
		// If the child is a number, convert it to a string and create a text node.
		else if (typeof child === 'number') {
			parentElement.appendChild(document.createTextNode(String(child)));
		}
		// If the child is a DOM Node (or an object that behaves like one, e.g., in some test environments),
		// and it's not null/undefined, append it directly.
		// The `child` check implicitly filters out `null` and `undefined`.
		else if (child && typeof child.nodeType === 'number') { // Basic check for Node-like objects
			parentElement.appendChild(child);
		}
		// Falsy values like null, undefined, or empty strings (if not caught by typeof string)
		// will not be appended if they don't meet the above conditions.
	}

	/**
	 * Internal helper function to append multiple children from an array to a parent element.
	 * @param {Array<string | number | Node | null | undefined>} descendants - An array of items to append.
	 * @param {Element} parentElement - The parent DOM element.
	 * @returns {void}
	 */
	function appendChildrenInternal(descendants, parentElement) {
		// Iterate over each item in the `descendants` array.
		for (const descendant of descendants) {
			// Use the single appendChildInternal helper for each item.
			// This ensures consistent handling for strings, numbers, Nodes, and falsy values.
			appendChildInternal(descendant, parentElement);
		}
	}

	// Step 4: Return the newly created and configured DOM element.
	return element;
}
