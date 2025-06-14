import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { findClosest } from './findClosest.js';
import { setupBrowserMocks, restoreGlobals } from '../../utils/test.utils.js';

// Mock Element class for testing (used by some tests, others use JSDOM)
class MockElement {
	constructor(tagName, className = '', id = '') {
		this.tagName = tagName.toLowerCase();
		this.className = className;
		this.id = id;
		this.parentElement = null;
		this.children = [];
	}

	closest(selector) {
		// Simple implementation for testing
		let current = this;
		while (current) {
			if (this.matches(current, selector)) {
				return current;
			}
			current = current.parentElement;
		}
		return null;
	}

	matches(element, selector) {
		// Simple selector matching for testing
		if (selector.startsWith('.')) {
			return element.className.includes(selector.slice(1));
		}
		if (selector.startsWith('#')) {
			return element.id === selector.slice(1);
		}
		return element.tagName === selector.toLowerCase();
	}

	appendChild(child) {
		child.parentElement = this;
		this.children.push(child);
	}
}

describe('findClosest(element, selector)', () => {
	it('should find closest element by tag name', () => {
		const div = new MockElement('div');
		const span = new MockElement('span');
		const button = new MockElement('button');

		div.appendChild(span);
		span.appendChild(button);

		const result = findClosest(button, 'div');
		assert.strictEqual(result, div);
	});

	it('should find closest element by class name', () => {
		const div = new MockElement('div', 'container');
		const span = new MockElement('span', 'text');
		const button = new MockElement('button');

		div.appendChild(span);
		span.appendChild(button);

		const result = findClosest(button, '.container');
		assert.strictEqual(result, div);
	});

	it('should find closest element by id', () => {
		const div = new MockElement('div', '', 'main');
		const span = new MockElement('span');
		const button = new MockElement('button');

		div.appendChild(span);
		span.appendChild(button);

		const result = findClosest(button, '#main');
		assert.strictEqual(result, div);
	});

	it('should return the element itself if it matches', () => {
		const button = new MockElement('button', 'primary');

		const result = findClosest(button, '.primary');
		assert.strictEqual(result, button);
	});

	it('should return null if no matching ancestor found', () => {
		const div = new MockElement('div');
		const span = new MockElement('span');
		const button = new MockElement('button');

		div.appendChild(span);
		span.appendChild(button);

		const result = findClosest(button, '.nonexistent');
		assert.strictEqual(result, null);
	});

	it('should return null if element is null', () => {
		const result = findClosest(null, 'div');
		assert.strictEqual(result, null);
	});

	it('should return null if element is undefined', () => {
		const result = findClosest(undefined, 'div');
		assert.strictEqual(result, null);
	});

	it('should handle complex selectors', () => {
		const form = new MockElement('form', 'login-form');
		const fieldset = new MockElement('fieldset');
		const input = new MockElement('input');

		form.appendChild(fieldset);
		fieldset.appendChild(input);

		const result = findClosest(input, 'form');
		assert.strictEqual(result, form);
	});

	it('should work with single element (no parents)', () => {
		const div = new MockElement('div', 'standalone');

		const result = findClosest(div, '.standalone');
		assert.strictEqual(result, div);
	});

	it('should return null for empty selector', () => {
		const div = new MockElement('div');

		// Mock closest to handle empty selector
		div.closest = (selector) => {
			if (!selector) {
				return null;
			}
			return div.tagName === selector.toLowerCase() ? div : null;
		};

		const result = findClosest(div, '');
		assert.strictEqual(result, null);
	});

	it('should return null if selector is invalid and causes an error', () => {
		const realDiv = document.createElement('div'); // Uses JSDOM from setupBrowserMocks
		document.body.appendChild(realDiv);
		const child = document.createElement('span');
		realDiv.appendChild(child);

		// An invalid selector like ':[invalid]' will cause element.closest to throw a SyntaxError.
		const result = findClosest(child, ':[invalid-selector]');
		assert.strictEqual(
			result,
			null,
			'Should return null for an invalid selector.',
		);

		// Cleanup
		document.body.removeChild(realDiv);
	});

	// Setup JSDOM for tests that need it (like the invalid selector test)
	beforeEach(() => {
		setupBrowserMocks();
	});

	afterEach(() => {
		restoreGlobals();
	});
});
