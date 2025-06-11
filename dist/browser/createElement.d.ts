/**
 * Creates a new DOM element with optional attributes and children.
 * @param {string} tagName - The tag name for the element.
 * @param {object} [attributes={}] - An object of attributes to set on the element.
 * @param {(string|Node|Array<string|Node>)} [children=[]] - Content to append (text, a DOM node, or an array of these).
 * @returns {Element} The created DOM element.
 */
export function createElement(tagName: string, attributes?: object, children?: (string | Node | Array<string | Node>)): Element;
