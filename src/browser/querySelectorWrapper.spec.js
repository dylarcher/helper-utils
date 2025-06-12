import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { querySelectorWrapper } from './querySelectorWrapper.js';
import { setupBrowserMocks, restoreGlobals } from '../../utils/test.utils.js';

// Mock Element and Document for testing
class MockElement {
	constructor(tagName, id = '', className = '') {
		this.tagName = tagName.toLowerCase();
		this.id = id;
		this.className = className;
		this.children = [];
	}

	querySelector(selector) {
		// Simple mock implementation
		if (selector.startsWith('#')) {
			const id = selector.slice(1);
			return this.findById(id);
		}
		if (selector.startsWith('.')) {
			const className = selector.slice(1);
			return this.findByClass(className);
		}
		return this.findByTag(selector);
	}

	findById(id) {
		if (this.id === id) {
			return this;
		}
		for (const child of this.children) {
			const result = child.findById(id);
			if (result) {
				return result;
			}
		}
		return null;
	}

	findByClass(className) {
		if (this.className.includes(className)) {
			return this;
		}
		for (const child of this.children) {
			const result = child.findByClass(className);
			if (result) {
				return result;
			}
		}
		return null;
	}

	findByTag(tagName) {
		if (this.tagName === tagName.toLowerCase()) {
			return this;
		}
		for (const child of this.children) {
			const result = child.findByTag(tagName);
			if (result) {
				return result;
			}
		}
		return null;
	}

	appendChild(child) {
		this.children.push(child);
		child.parent = this;
	}
}

describe('querySelectorWrapper(selector, container)', () => {
	let mockDocument;

	beforeEach(() => {
		setupBrowserMocks();

		// Create mock document structure
		mockDocument = new MockElement('document');
		const body = new MockElement('body');
		const div1 = new MockElement('div', 'main', 'container');
		const div2 = new MockElement('div', 'sidebar', 'panel');
		const span = new MockElement('span', '', 'text');

		mockDocument.appendChild(body);
		body.appendChild(div1);
		body.appendChild(div2);
		div1.appendChild(span);

		global.document = mockDocument;
	});

	afterEach(() => {
		restoreGlobals();
	});

	it('should find element by id using document', () => {
		const result = querySelectorWrapper('#main');

		assert.ok(result !== null);
		assert.strictEqual(result.id, 'main');
		assert.strictEqual(result.tagName, 'div');
	});

	it('should find element by class using document', () => {
		const result = querySelectorWrapper('.container');

		assert.ok(result !== null);
		assert.strictEqual(result.className, 'container');
		assert.strictEqual(result.id, 'main');
	});

	it('should find element by tag using document', () => {
		const result = querySelectorWrapper('span');

		assert.ok(result !== null);
		assert.strictEqual(result.tagName, 'span');
		assert.strictEqual(result.className, 'text');
	});

	it('should use custom container when provided', () => {
		const container = new MockElement('div');
		const child = new MockElement('p', 'custom', '');
		container.appendChild(child);

		const result = querySelectorWrapper('#custom', container);

		assert.ok(result !== null);
		assert.strictEqual(result.id, 'custom');
		assert.strictEqual(result.tagName, 'p');
	});

	it('should return null for non-existent selector', () => {
		const result = querySelectorWrapper('#nonexistent');

		assert.strictEqual(result, null);
	});

	it('should return null for null container', () => {
		const result = querySelectorWrapper('#main', null);

		assert.strictEqual(result, null);
	});

	it('should return null for undefined container', () => {
		const result = querySelectorWrapper('#main', undefined);

		// Note: The function has a bug - it checks `!parent` instead of `!container`
		// This test documents the current behavior
		assert.strictEqual(result, null);
	});

	it('should return null for container without querySelector method', () => {
		const brokenContainer = {};

		const result = querySelectorWrapper('#main', brokenContainer);

		assert.strictEqual(result, null);
	});

	it('should handle container with null querySelector method', () => {
		const containerWithNullMethod = { querySelector: null };

		const result = querySelectorWrapper('#main', containerWithNullMethod);

		assert.strictEqual(result, null);
	});

	it('should handle empty selector', () => {
		// Mock querySelector to handle empty selector
		mockDocument.querySelector = (selector) => {
			if (!selector) {
				return null;
			}
			return mockDocument.findById('main');
		};

		const result = querySelectorWrapper('');

		assert.strictEqual(result, null);
	});

	it('should handle complex selectors', () => {
		// Create more complex mock behavior
		const container = new MockElement('div');
		container.querySelector = (selector) => {
			if (selector === 'div.container p') {
				const p = new MockElement('p', '', '');
				return p;
			}
			return null;
		};

		const result = querySelectorWrapper('div.container p', container);

		assert.ok(result !== null);
		assert.strictEqual(result.tagName, 'p');
	});

	it('should handle querySelector throwing error', () => {
		const errorContainer = {
			querySelector: () => {
				throw new Error('querySelector failed');
			},
		};

		// Should not throw, should return null
		assert.doesNotThrow(() => {
			const result = querySelectorWrapper('#test', errorContainer);
			assert.strictEqual(result, null);
		});
	});

	it('should default to document when no container provided', () => {
		// Ensure document is being used as default
		global.document = {
			querySelector: (selector) => {
				if (selector === '#document-test') {
					return { id: 'document-test', source: 'document' };
				}
				return null;
			},
		};

		const result = querySelectorWrapper('#document-test');

		assert.ok(result !== null);
		assert.strictEqual(result.source, 'document');
	});

	it('should work with various selector types', () => {
		const testContainer = {
			querySelector: (selector) => {
				const selectorMap = {
					'#id-selector': { type: 'id', tagName: 'div' },
					'.class-selector': { type: 'class', tagName: 'span' },
					'tag-selector': { type: 'tag', tagName: 'p' },
					'[data-test]': { type: 'attribute', tagName: 'section' },
					'div > p': { type: 'descendant', tagName: 'p' },
				};
				return selectorMap[selector] || null;
			},
		};

		const selectors = [
			'#id-selector',
			'.class-selector',
			'tag-selector',
			'[data-test]',
			'div > p',
		];

		selectors.forEach((selector) => {
			const result = querySelectorWrapper(selector, testContainer);
			assert.ok(
				result !== null,
				`Should find element for selector: ${selector}`,
			);
		});
	});

	// Test for when document doesn't exist and only a single argument is passed
	it("should return null when document doesn't exist and only one argument is provided", () => {
		// Temporarily remove the global document
		const originalDocument = global.document;
		delete global.document;

		try {
			// Call with only one argument (selector)
			const result = querySelectorWrapper('#test');
			assert.strictEqual(result, null);
		} finally {
			// Restore the global document
			global.document = originalDocument;
		}
	});
});
