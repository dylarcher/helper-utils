/**
 * Creates a new DOM element with the specified tag name, attributes, and children.
 *
 * This function uses `document.createElement` to create the element. Errors from
 * `document.createElement` (e.g., for an invalid `tagName`) will propagate.
 * Similarly, errors from `element.setAttribute` (e.g., for invalid attribute names)
 * will also propagate.
 *
 * Children can be provided as a single string, a single DOM Node, or an array
 * containing a mix of strings (which will be converted to text nodes) and DOM Nodes.
 *
 * @param {string} tagName - The HTML tag name for the element to create (e.g., 'div', 'span', 'a').
 * @param {Record<string, string>} [attributes={}] - An object where keys are attribute names
 *   and values are attribute values to set on the element (e.g., `{ class: 'my-class', 'data-id': '123' }`).
 * @param {string | Node | Array<string | Node>} [children=[]] - Content to append to the created element.
 *   Can be a single string, a single DOM Node, or an array of strings and/or DOM Nodes.
 *   Falsy values in an array (like null or undefined) are skipped.
 * @returns {Element} The newly created DOM element. The specific type will be a subtype of `Element`
 *   (e.g., `HTMLDivElement` for 'div').
 *
 * @example
 * // Create a simple <div>
 * const div = createElement('div'); // <div />
 *
 * // Create a <span> with text content
 * const span = createElement('span', {}, 'Hello, world!'); // <span>Hello, world!</span>
 *
 * // Create an <a> tag with attributes and text
 * const link = createElement('a', { href: '#', class: 'link active' }, 'Click me');
 * // <a href="#" class="link active">Click me</a>
 *
 * // Create a <ul> with various children
 * const list = createElement('ul', { class: 'items' }, [
 *   createElement('li', {}, 'First item'), // Child element
 *   'Second item (text)',                  // Text node
 *   document.createElement('li'),          // Existing node (empty li)
 *   null,                                  // Skipped
 *   createElement('li', {}, [             // Nested children
 *     'Third item with a ',
 *     createElement('strong', {}, 'bold part')
 *   ])
 * ]);
 * // <ul class="items">
 * //   <li>First item</li>
 * //   Second item (text)
 * //   <li />
 * //   <li>Third item with a <strong>bold part</strong></li>
 * // </ul>
 *
 * // Potentially throws error if tagName is invalid
 * // try {
 * //   const invalidEl = createElement('invalid-tag-@!#');
 * // } catch (e) {
 * //   console.error(e); // DOMException: The tag name provided ('invalid-tag-@!#') is not a valid name.
 * // }
 */
export function createElement(
	tagName: string,
	attributes?: Record<string, string>,
	children?: string | Node | Array<string | Node>,
): Element;
