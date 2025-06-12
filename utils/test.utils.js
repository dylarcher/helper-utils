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

	const mockDocument = {
		createElement: (tagName) => {
			const element = {
				tagName: tagName.toLowerCase(),
				attributes: {},
				childNodes: [],
				textContent: '',
				style: new Map(),
				classList: {
					_classes: new Set(),
					add(...classes) {
						classes.forEach((cls) => this._classes.add(cls));
					},
					remove(...classes) {
						classes.forEach((cls) => this._classes.delete(cls));
					},
					contains(cls) {
						return this._classes.has(cls);
					},
					toggle(cls, force) {
						if (
							force === true ||
							(force === undefined && !this._classes.has(cls))
						) {
							this._classes.add(cls);
							return true;
						}
						if (
							force === false ||
							(force === undefined && this._classes.has(cls))
						) {
							this._classes.delete(cls);
							return false;
						}
						return false;
					},
					get length() {
						return this._classes.size;
					},
				},
				setAttribute: function (name, value) {
					this.attributes[name] = value;
				},
				getAttribute: function (name) {
					return this.attributes[name] || null;
				},
				appendChild: function (child) {
					this.childNodes.push(child);
					if (typeof child === 'string') {
						this.textContent += child;
					}
					if (child && typeof child === 'object' && child.textContent) {
						this.textContent += child.textContent;
						child.parentNode = this;
					}
				},
				removeChild: function (child) {
					const index = this.childNodes.indexOf(child);
					if (index > -1) {
						this.childNodes.splice(index, 1);
						child.parentNode = null;
					}
				},
				matches: function (selector) {
					// Basic selector matching
					if (selector.startsWith('.') && this.classList) {
						return this.classList.contains(selector.slice(1));
					}
					if (selector.startsWith('#') && this.id) {
						return this.id === selector.slice(1);
					}
					return this.tagName === selector.toLowerCase();
				},
				parentNode: null,
				id: '',
				dataset: {},
				addEventListener: function (event, handler, options) {
					if (!this._eventListeners) {
						this._eventListeners = {};
					}
					if (!this._eventListeners[event]) {
						this._eventListeners[event] = [];
					}
					this._eventListeners[event].push({ handler, options });
				},
				removeEventListener: function (event, handler) {
					if (!this._eventListeners || !this._eventListeners[event]) {
						return;
					}
					this._eventListeners[event] = this._eventListeners[event].filter(
						(listener) => listener.handler !== handler,
					);
				},
			};

			// Store element in document's map
			if (tagName && tagName.toLowerCase) {
				elements.set(tagName.toLowerCase(), element);
			}

			return element;
		},
		createTextNode: (text) => new MockTextNode(text),
		querySelector: (selector) => elements.get(selector) || null,
		querySelectorAll: (selector) => {
			// Basic selector implementation for testing
			if (selector.startsWith('.')) {
				const className = selector.slice(1);
				return Array.from(elements.values()).filter(
					(el) => el.classList && el.classList.contains(className),
				);
			}
			if (selector.startsWith('#')) {
				const id = selector.slice(1);
				const element = Array.from(elements.values()).find(
					(el) => el.id === id,
				);
				return element ? [element] : [];
			}
			return Array.from(elements.values()).filter(
				(el) => el.tagName === selector.toLowerCase(),
			);
		},
		cookie: '',
		getElementById: (id) => {
			for (const el of elements.values()) {
				if (el.id === id) {
					return el;
				}
			}
			return null;
		},
		getElementsByClassName: (className) =>
			Array.from(elements.values()).filter(
				(el) => el.classList && el.classList.contains(className),
			),
		body: {
			appendChild: function (child) {
				if (!this.childNodes) {
					this.childNodes = [];
				}
				this.childNodes.push(child);
				if (child && typeof child === 'object') {
					child.parentNode = this;
				}
			},
			removeChild: function (child) {
				if (!this.childNodes) {
					return;
				}
				const index = this.childNodes.indexOf(child);
				if (index > -1) {
					this.childNodes.splice(index, 1);
					child.parentNode = null;
				}
			},
			childNodes: [],
		},
	};

	return mockDocument;
}

/**
 * Create a mock window object
 */
export function createMockWindow() {
	const mockLocalStorage = createMockLocalStorage();
	const mockDocument = createMockDocument();
	let mockWindow = {
		document: mockDocument,
		localStorage: mockLocalStorage,
		location: {
			search: '?test=value&foo=bar',
			href: 'https://example.com?test=value&foo=bar',
			pathname: '/',
			host: 'example.com',
			protocol: 'https:',
			hash: '',
			origin: 'https://example.com',
			toString: () => mockWindow.location.href,
			reload: () => {},
			replace: (url) => {
				mockWindow.location.href = url;
			},
			assign: (url) => {
				mockWindow.location.href = url;
			},
		},
		getComputedStyle: (element, pseudoElement) => ({
			getPropertyValue: (prop) => element.style?.get(prop) || '',
			color: 'rgb(0, 0, 0)',
			fontSize: '16px',
			display: 'block',
			visibility: 'visible',
		}),
		navigator: {
			clipboard: {
				writeText: async (text) => Promise.resolve(text),
				readText: async () => Promise.resolve('Clipboard content'),
			},
			userAgent:
				'Mozilla/5.0 (Mock Browser) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			language: 'en-US',
			platform: 'MacIntel',
		},
		crypto: {
			randomUUID: () => '12345678-1234-4000-8000-123456789abc',
			getRandomValues: (array) => {
				for (let i = 0; i < array.length; i++) {
					array[i] = Math.floor(Math.random() * 256);
				}
				return array;
			},
		},
		history: null,
		addEventListener: (event, handler, options) => {
			if (!mockWindow._eventListeners) {
				mockWindow._eventListeners = {};
			}
			if (!mockWindow._eventListeners[event]) {
				mockWindow._eventListeners[event] = [];
			}
			mockWindow._eventListeners[event].push({ handler, options });
		},
		removeEventListener: (event, handler) => {
			if (!mockWindow._eventListeners || !mockWindow._eventListeners[event]) {
				return;
			}
			mockWindow._eventListeners[event] = mockWindow._eventListeners[
				event
			].filter((listener) => listener.handler !== handler);
		},
		dispatchEvent: (event) => {
			if (
				!mockWindow._eventListeners ||
				!mockWindow._eventListeners[event.type]
			) {
				return true;
			}
			mockWindow._eventListeners[event.type].forEach(({ handler }) => {
				handler(event);
			});
			return !event.defaultPrevented;
		},
		setTimeout: setTimeout,
		clearTimeout: clearTimeout,
		setInterval: setInterval,
		clearInterval: clearInterval,
		fetch: async (url, options) => {
			return {
				json: async () => ({ success: true, data: 'Mock data' }),
				text: async () => 'Mock response text',
				ok: true,
				status: 200,
				headers: new Map(),
			};
		},
		console: console,
		URLSearchParams,
	};

	const mockHistory = {
		state: null,
		pushState: (state, title, url) => {
			mockHistory.state = state;
			mockWindow.location.href = url;
		},
		replaceState: (state, title, url) => {
			mockHistory.state = state;
			mockWindow.location.href = url;
		},
	};

	mockWindow = {
		document: mockDocument,
		localStorage: mockLocalStorage,
		location: {
			search: '?test=value&foo=bar',
			href: 'https://example.com?test=value&foo=bar',
			pathname: '/',
			host: 'example.com',
			protocol: 'https:',
			hash: '',
			origin: 'https://example.com',
			toString: () => mockWindow.location.href,
			reload: () => {},
			replace: (url) => {
				mockWindow.location.href = url;
			},
			assign: (url) => {
				mockWindow.location.href = url;
			},
		},
		getComputedStyle: (element, pseudoElement) => ({
			getPropertyValue: (prop) => element.style?.get(prop) || '',
			color: 'rgb(0, 0, 0)',
			fontSize: '16px',
			display: 'block',
			visibility: 'visible',
		}),
		navigator: {
			clipboard: {
				writeText: async (text) => Promise.resolve(text),
				readText: async () => Promise.resolve('Clipboard content'),
			},
			userAgent:
				'Mozilla/5.0 (Mock Browser) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			language: 'en-US',
			platform: 'MacIntel',
		},
		crypto: {
			randomUUID: () => '12345678-1234-4000-8000-123456789abc',
			getRandomValues: (array) => {
				for (let i = 0; i < array.length; i++) {
					array[i] = Math.floor(Math.random() * 256);
				}
				return array;
			},
		},
		history: mockHistory,
		addEventListener: (event, handler, options) => {
			if (!mockWindow._eventListeners) {
				mockWindow._eventListeners = {};
			}
			if (!mockWindow._eventListeners[event]) {
				mockWindow._eventListeners[event] = [];
			}
			mockWindow._eventListeners[event].push({ handler, options });
		},
		removeEventListener: (event, handler) => {
			if (!mockWindow._eventListeners || !mockWindow._eventListeners[event]) {
				return;
			}
			mockWindow._eventListeners[event] = mockWindow._eventListeners[
				event
			].filter((listener) => listener.handler !== handler);
		},
		dispatchEvent: (event) => {
			if (
				!mockWindow._eventListeners ||
				!mockWindow._eventListeners[event.type]
			) {
				return true;
			}
			mockWindow._eventListeners[event.type].forEach(({ handler }) => {
				handler(event);
			});
			return !event.defaultPrevented;
		},
		setTimeout: setTimeout,
		clearTimeout: clearTimeout,
		setInterval: setInterval,
		clearInterval: clearInterval,
		fetch: async (url, options) => {
			return {
				json: async () => ({ success: true, data: 'Mock data' }),
				text: async () => 'Mock response text',
				ok: true,
				status: 200,
				headers: new Map(),
			};
		},
		console: console,
		URLSearchParams,
	};

	return mockWindow;
}

/**
 * Setup full browser environment mock
 */
export function setupBrowserMocks() {
	const mockWindow = createMockWindow();

	// Mock all browser globals
	mockGlobal('window', mockWindow);
	mockGlobal('document', mockWindow.document);
	mockGlobal('localStorage', mockWindow.localStorage);
	mockGlobal('navigator', mockWindow.navigator);
	mockGlobal('crypto', mockWindow.crypto);
	mockGlobal('location', mockWindow.location);
	mockGlobal('history', mockWindow.history);
	mockGlobal('HTMLElement', class HTMLElement {});
	mockGlobal('Element', class Element {});
	mockGlobal(
		'Event',
		class Event {
			constructor(type, options = {}) {
				this.type = type;
				this.bubbles = options.bubbles || false;
				this.cancelable = options.cancelable || false;
				this.defaultPrevented = false;
			}
			preventDefault() {
				this.defaultPrevented = true;
			}
			stopPropagation() {
				this.propagationStopped = true;
			}
		},
	);

	// Add fetch if not available
	if (typeof global.fetch !== 'function') {
		mockGlobal('fetch', mockWindow.fetch);
	}

	return mockWindow;
}

/**
 * Creates a mock element with a specific tag name for testing DOM operations
 * @param {string} tagName - The HTML tag name
 * @param {object} attributes - Key-value pairs of attributes to set
 * @returns {object} A mock element
 */
export function createMockElement(tagName, attributes = {}) {
	const doc = createMockDocument();
	const element = doc.createElement(tagName);

	// Set attributes
	for (const [key, value] of Object.entries(attributes)) {
		if (key === 'id') {
			element.id = value;
		} else if (key === 'className' || key === 'class') {
			if (typeof value === 'string') {
				value
					.split(' ')
					.filter(Boolean)
					.forEach((cls) => {
						element.classList.add(cls);
					});
			}
		} else if (key === 'style' && typeof value === 'object') {
			for (const [prop, styleValue] of Object.entries(value)) {
				element.style.set(prop, styleValue);
			}
		} else if (key === 'dataset' && typeof value === 'object') {
			Object.assign(element.dataset, value);
		} else {
			element.setAttribute(key, value);
		}
	}

	return element;
}
