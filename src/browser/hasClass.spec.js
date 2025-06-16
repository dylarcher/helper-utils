import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { hasClass } from './hasClass.js';

// Mock Element class for testing
class MockElement {
	constructor(classes = []) {
		this.classList = new Set(classes);
		this.classList.contains = className => this.classList.has(className);
	}
}

describe('hasClass(element, className)', () => {
	let mockElement;

	beforeEach(() => {
		mockElement = new MockElement(['class1', 'class2', 'active']);
	});

	it('should return true when element has the specified class', () => {
		const result = hasClass(mockElement, 'class1');
		assert.strictEqual(result, true);
	});

	it('should return true for multiple existing classes', () => {
		assert.strictEqual(hasClass(mockElement, 'class1'), true);
		assert.strictEqual(hasClass(mockElement, 'class2'), true);
		assert.strictEqual(hasClass(mockElement, 'active'), true);
	});

	it('should return false when element does not have the specified class', () => {
		const result = hasClass(mockElement, 'nonexistent');
		assert.strictEqual(result, false);
	});

	it('should return false for null element', () => {
		const result = hasClass(null, 'class1');
		assert.strictEqual(result, false);
	});

	it('should return false for undefined element', () => {
		const result = hasClass(undefined, 'class1');
		assert.strictEqual(result, false);
	});

	it('should return false for element without classList', () => {
		const elementWithoutClassList = {};
		const result = hasClass(elementWithoutClassList, 'class1');
		assert.strictEqual(result, false);
	});

	it('should return false for empty className', () => {
		const result = hasClass(mockElement, '');
		assert.strictEqual(result, false);
	});

	it('should return false for null className', () => {
		const result = hasClass(mockElement, null);
		assert.strictEqual(result, false);
	});

	it('should return false for undefined className', () => {
		const result = hasClass(mockElement, undefined);
		assert.strictEqual(result, false);
	});

	it('should be case sensitive', () => {
		const element = new MockElement(['TestClass']);

		assert.strictEqual(hasClass(element, 'TestClass'), true);
		assert.strictEqual(hasClass(element, 'testclass'), false);
		assert.strictEqual(hasClass(element, 'TESTCLASS'), false);
	});

	it('should handle classes with special characters', () => {
		const element = new MockElement([
			'class-with-dash',
			'class_with_underscore',
			'class123',
		]);

		assert.strictEqual(hasClass(element, 'class-with-dash'), true);
		assert.strictEqual(hasClass(element, 'class_with_underscore'), true);
		assert.strictEqual(hasClass(element, 'class123'), true);
	});

	it('should handle element with no classes', () => {
		const emptyElement = new MockElement([]);

		assert.strictEqual(hasClass(emptyElement, 'anyclass'), false);
	});

	it('should not match partial class names', () => {
		const element = new MockElement(['navigation', 'nav-item']);

		assert.strictEqual(hasClass(element, 'nav'), false);
		assert.strictEqual(hasClass(element, 'navigation'), true);
		assert.strictEqual(hasClass(element, 'nav-item'), true);
	});

	it('should handle whitespace in className parameter', () => {
		const element = new MockElement(['test']);

		// Depending on implementation, this might trim or not
		assert.strictEqual(hasClass(element, ' test '), false);
		assert.strictEqual(hasClass(element, 'test'), true);
	});

	it('should handle element with classList but no contains method', () => {
		const brokenElement = {
			classList: new Set(['test']),
			// Missing contains method
		};

		const result = hasClass(brokenElement, 'test');
		assert.strictEqual(result, false);
	});

	it('should handle element where classList.contains throws', () => {
		const errorElement = {
			classList: {
				contains: () => {
					throw new Error('Contains method error');
				},
			},
		};

		// Should not throw, should return false
		const result = hasClass(errorElement, 'test');
		assert.strictEqual(result, false);
	});

	it('should work with real DOM-like element structure', () => {
		const domLikeElement = {
			classList: {
				contains: className => {
					const classes = ['btn', 'btn-primary', 'active'];
					return classes.includes(className);
				},
			},
		};

		assert.strictEqual(hasClass(domLikeElement, 'btn'), true);
		assert.strictEqual(hasClass(domLikeElement, 'btn-primary'), true);
		assert.strictEqual(hasClass(domLikeElement, 'inactive'), false);
	});
});
