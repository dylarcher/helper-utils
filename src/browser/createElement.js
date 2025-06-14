/**
 * Creates a new DOM element with optional attributes and children.
 * @param {string} tagName - The tag name for the element.
 * @param {Record<string, string>} [attributes={}] - An object of attributes to set on the element.
 * @param {(string|Node|Array<string|Node>)} [children=[]] - Content to append (text, a DOM node, or an array of these).
 * @returns {Element} The created DOM element.
 */
export function createElement(
	tagName,
	attributes = /** @type {Record<string, string>} */ ({}),
	children = [],
) {
	const element = document.createElement(tagName);

	for (const key in attributes) {
		if (Object.prototype.hasOwnProperty.call(attributes, key)) {
			element.setAttribute(key, attributes[key]);
		}
	}

	Array.isArray(children)
		? appendChildren(children, element)
		: appendChild(children, element);

	/**
	 * Appends a child (string or Node) to the element.
	 * @param {string | Node} child
	 * @param {Element} parentElement
	 * @returns {void}
	 */
	function appendChild(child, parentElement) {
		if (typeof child === 'string') {
			parentElement.appendChild(document.createTextNode(child));
		} else if (child) {
			// Handle any object that might be a DOM node
			// In tests, we don't have real Node instances but objects with similar interface
			parentElement.appendChild(child);
		}
	}

	/**
	 * Appends multiple children (string or Node) to the element.
	 * @param {Array<string | Node>} descendants
	 * @param {Element} parentElement
	 * @returns {void}
	 */
	function appendChildren(descendants, parentElement) {
		for (const descendant of descendants) {
			appendChild(descendant, parentElement);
		}
	}

	return element;
}
