/**
 * Test helpers for browser environment mocking
 */

// Store original global values
export const originalGlobals = {};

/**
 * Mock global object with proper cleanup
 */
export function mockGlobal(name, value) {
	// Store original value if not already stored
	if (!(name in originalGlobals)) {
		originalGlobals[name] = globalThis[name];
	}

	// Mock the global
	Object.defineProperty(globalThis, name, {
		value: value,
		configurable: true,
		writable: true,
	});
}

/**
 * Restore all mocked globals
 */
export function restoreGlobals() {
	for (const [name, originalValue] of Object.entries(originalGlobals)) {
		if (originalValue === undefined) {
			delete globalThis[name];
		} else {
			Object.defineProperty(globalThis, name, {
				value: originalValue,
				configurable: true,
				writable: true,
			});
		}
	}
	// Clear the stored values
	Object.keys(originalGlobals).forEach((key) => delete originalGlobals[key]);
}

/**
 * Create a mock localStorage
 */
export function createMockLocalStorage() {
	const storage = new Map();
	return {
		getItem: (key) => storage.get(key) || null,
		setItem: (key, value) => storage.set(key, String(value)),
		removeItem: (key) => storage.delete(key),
		clear: () => storage.clear(),
		get length() {
			return storage.size;
		},
		key: (index) => Array.from(storage.keys())[index] || null,
	};
}

/**
 * Create a mock document
 */
export function createMockDocument() {
	const elements = new Map();

	// Mock TextNode
	class MockTextNode {
		constructor(text) {
			this.nodeType = 3; // TEXT_NODE
			this.textContent = text;
		}
	}

	return {
		createElement: (tagName) => ({
			tagName: tagName.toLowerCase(),
			attributes: {},
			childNodes: [],
			textContent: "",
			style: new Map(),
			classList: new Set(),
			setAttribute: function (name, value) {
				this.attributes[name] = value;
			},
			getAttribute: function (name) {
				return this.attributes[name] || null;
			},
			appendChild: function (child) {
				this.childNodes.push(child);
				if (typeof child === "string") {
					this.textContent += child;
				}
				if (child && typeof child === "object" && child.textContent) {
					this.textContent += child.textContent;
				}
			},
			removeChild: function (child) {
				const index = this.childNodes.indexOf(child);
				if (index > -1) {
					this.childNodes.splice(index, 1);
					child.parentNode = null;
				}
			},
		}),
		createTextNode: (text) => new MockTextNode(text),
		querySelector: (selector) => elements.get(selector) || null,
		querySelectorAll: (selector) =>
			Array.from(elements.values()).filter(
				(el) => el.matches && el.matches(selector),
			),
		cookie: "",
		getElementById: (id) => elements.get(`#${id}`) || null,
		getElementsByClassName: (className) =>
			Array.from(elements.values()).filter(
				(el) => el.classList && el.classList.contains(className),
			),
	};
}

/**
 * Create a mock window object
 */
export function createMockWindow() {
	const mockLocalStorage = createMockLocalStorage();
	const mockDocument = createMockDocument();

	return {
		document: mockDocument,
		localStorage: mockLocalStorage,
		location: {
			search: "?test=value&foo=bar",
			href: "https://example.com?test=value&foo=bar",
		},
		getComputedStyle: (element, pseudoElement) => ({
			getPropertyValue: (prop) => element.style?.get(prop) || "",
			color: "rgb(0, 0, 0)",
			fontSize: "16px",
		}),
		navigator: {
			clipboard: {
				writeText: async (text) => Promise.resolve(),
			},
		},
		crypto: {
			randomUUID: () => "12345678-1234-4000-8000-123456789abc",
		},
	};
}

/**
 * Setup full browser environment mock
 */
export function setupBrowserMocks() {
	const mockWindow = createMockWindow();

	// Mock all browser globals
	mockGlobal("window", mockWindow);
	mockGlobal("document", mockWindow.document);
	mockGlobal("localStorage", mockWindow.localStorage);
	mockGlobal("navigator", mockWindow.navigator);
	mockGlobal("crypto", mockWindow.crypto);

	return mockWindow;
}
