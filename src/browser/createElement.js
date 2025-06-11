/**
 * Creates a new DOM element with optional attributes and children.
 * @param {string} tagName - The tag name for the element.
 * @param {object} [attributes={}] - An object of attributes to set on the element.
 * @param {(string|Node|Array<string|Node>)} [children=[]] - Content to append (text, a DOM node, or an array of these).
 * @returns {Element} The created DOM element.
 */
export function createElement(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName)

    for (const key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
            element.setAttribute(key, attributes[key])
        }
    }

    const appendChild = (child) => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child))
        } else if (child instanceof Node) {
            element.appendChild(child)
        }
    }

    Array.isArray(children) ? children.forEach(appendChild) : appendChild(children)

    return element
}