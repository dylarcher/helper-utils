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
export function createElement(tagName: string, attributes?: Record<string, string | number | boolean>, children?: string | number | Node | Array<string | number | Node | null | undefined>): Element;
