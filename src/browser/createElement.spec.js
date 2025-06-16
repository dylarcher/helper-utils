import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from './createElement.js';
import {
	setupJSDOM,
	cleanupJSDOM,
	setupBrowserMocks,
	restoreGlobals,
} from '../../utils/test.utils.js';

// Mock Element class for testing
class _MockElement {
	constructor(tagName, className = '', id = '') {
		this.tagName = tagName.toLowerCase();
		this.className = className;
		this.id = id;
		this.textContent = '';
		this.childNodes = [];
	}

	appendChild(child) {
		this.childNodes.push(child);
		return child;
	}
}

describe('createElement(tagName, attributes, children)', () => {
	describe('Mock Environment Tests', () => {
		beforeEach(() => {
			setupBrowserMocks();
		});

		afterEach(() => {
			restoreGlobals();
		});

		// ...existing mock-based tests...
		it('should create an element with specified tag name', () => {
			const element = createElement('div');
			assert.strictEqual(element.tagName, 'div');
		});

		it('should create an element with attributes', () => {
			const attributes = {
				id: 'test-id',
				class: 'test-class',
				'data-value': '123',
			};

			const element = createElement('div', attributes);
			assert.strictEqual(element.attributes.id, 'test-id');
			assert.strictEqual(element.attributes.class, 'test-class');
			assert.strictEqual(element.attributes['data-value'], '123');
		});

		it('should create an element with string child', () => {
			const element = createElement('p', {}, 'Hello World');
			assert.strictEqual(element.childNodes.length, 1);
			assert.strictEqual(element.childNodes[0].textContent, 'Hello World');
		});
	});

	describe('JSDOM Environment Tests', () => {
		beforeEach(() => {
			setupJSDOM();
		});

		afterEach(() => {
			cleanupJSDOM();
		});

		it('should create real DOM elements with jsdom', () => {
			const element = createElement('div');
			assert.strictEqual(element.tagName.toLowerCase(), 'div');
			assert.ok(element instanceof global.HTMLDivElement);
		});

		it('should create elements with real attributes in jsdom', () => {
			const attributes = {
				id: 'test-id',
				class: 'test-class my-class',
				'data-value': '123',
				title: 'Test Title',
			};

			const element = createElement('div', attributes);

			assert.strictEqual(element.id, 'test-id');
			assert.strictEqual(element.className, 'test-class my-class');
			assert.strictEqual(element.getAttribute('data-value'), '123');
			assert.strictEqual(element.title, 'Test Title');
		});

		it('should handle real DOM text nodes with jsdom', () => {
			const element = createElement('p', {}, 'Hello World');

			assert.strictEqual(element.childNodes.length, 1);
			assert.strictEqual(element.textContent, 'Hello World');
			assert.ok(element.firstChild instanceof global.Text);
		});

		it('should handle real DOM element children with jsdom', () => {
			const childElement = document.createElement('span');
			childElement.textContent = 'Child Content';

			const element = createElement('div', {}, childElement);

			assert.strictEqual(element.childNodes.length, 1);
			assert.strictEqual(element.firstChild.tagName.toLowerCase(), 'span');
			assert.strictEqual(element.firstChild.textContent, 'Child Content');
		});

		it('should handle complex nested structures with jsdom', () => {
			const span = document.createElement('span');
			span.textContent = 'Span Text';

			const children = ['Text before', span, ' text after'];

			const element = createElement('div', { class: 'container' }, children);

			assert.strictEqual(element.childNodes.length, 3);
			assert.strictEqual(element.childNodes[0].textContent, 'Text before');
			assert.strictEqual(element.childNodes[1].tagName.toLowerCase(), 'span');
			assert.strictEqual(element.childNodes[2].textContent, ' text after');
			assert.strictEqual(
				element.textContent,
				'Text beforeSpan Text text after',
			);
		});

		it('should work with various HTML elements in jsdom', () => {
			const elements = ['div', 'span', 'p', 'h1', 'section', 'article'];

			elements.forEach((tagName) => {
				const element = createElement(tagName, { id: `test-${tagName}` });
				assert.strictEqual(element.tagName.toLowerCase(), tagName);
				assert.strictEqual(element.id, `test-${tagName}`);
			});
		});
	});
});
