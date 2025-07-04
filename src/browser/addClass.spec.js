import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { addClass } from './addClass.js';
import { setupJSDOM, cleanupJSDOM } from '../../utils/test.utils.js';

// Mock Element class for testing environment
class MockElement {
	constructor() {
		this.classList = new Set();
		// Store reference to Set's add method to avoid recursion
		const setAdd = this.classList.add.bind(this.classList);
		// Define classList.add, classList.contains, and className for compatibility
		this.classList.add = (...names) =>
			names.forEach(elementName => {
				if (typeof elementName === 'string' && elementName.trim() !== '') {
					setAdd(elementName); // Use Set's original add method
				}
			});
		this.classList.contains = name => this.classList.has(name);
	}

	// Getter to simulate the className property
	get className() {
		return Array.from(this.classList).join(' ');
	}
}

describe('addClass(element, ...classNames)', () => {
	let mockElement;

	beforeEach(() => {
		mockElement = new MockElement();
	});

	it('should add a single class to an element', () => {
		addClass(mockElement, 'test-class');
		assert.ok(
			mockElement.classList.has('test-class'),
			'Class "test-class" should be present',
		);
		assert.strictEqual(mockElement.className, 'test-class');
	});

	it('should add multiple classes to an element', () => {
		addClass(mockElement, 'class1', 'class2');
		assert.ok(
			mockElement.classList.has('class1'),
			'Class "class1" should be present',
		);
		assert.ok(
			mockElement.classList.has('class2'),
			'Class "class2" should be present',
		);
		assert.strictEqual(mockElement.className, 'class1 class2'); // Order might vary with Set, check individual classes
	});

	it('should not add duplicate classes', () => {
		addClass(mockElement, 'test-class');
		addClass(mockElement, 'test-class');
		assert.strictEqual(
			mockElement.className,
			'test-class',
			'Duplicate class should not be added',
		);
		assert.strictEqual(
			Array.from(mockElement.classList).length,
			1,
			'Class list should contain only one class',
		);
	});

	it('should filter out falsy class names like null, undefined, and empty strings', () => {
		addClass(mockElement, 'class1', null, 'class2', undefined, '', 'class3');
		assert.ok(mockElement.classList.has('class1'));
		assert.ok(mockElement.classList.has('class2'));
		assert.ok(mockElement.classList.has('class3'));
		assert.strictEqual(Array.from(mockElement.classList).length, 3);
		// Check className, order might vary
		const classes = mockElement.className.split(' ');
		assert.ok(classes.includes('class1'));
		assert.ok(classes.includes('class2'));
		assert.ok(classes.includes('class3'));
	});

	it('should not throw an error if the element is null', () => {
		assert.doesNotThrow(() => {
			addClass(null, 'test-class');
		});
	});

	it('should not throw an error if the element is undefined', () => {
		assert.doesNotThrow(() => {
			addClass(undefined, 'test-class');
		});
	});

	it('should not throw an error or modify if element has no classList property', () => {
		const plainObject = {};
		addClass(plainObject, 'test-class');
		assert.strictEqual(
			Object.keys(plainObject).length,
			0,
			'Plain object should not be modified',
		);
	});

	it('should handle adding a class that already exists with other classes', () => {
		mockElement.classList.add('existing-class');
		addClass(mockElement, 'new-class', 'existing-class');
		assert.ok(mockElement.classList.has('existing-class'));
		assert.ok(mockElement.classList.has('new-class'));
		assert.strictEqual(Array.from(mockElement.classList).length, 2);
	});

	it('should handle adding multiple new classes when some already exist', () => {
		mockElement.classList.add('class1');
		addClass(mockElement, 'class2', 'class1', 'class3');
		assert.ok(mockElement.classList.has('class1'));
		assert.ok(mockElement.classList.has('class2'));
		assert.ok(mockElement.classList.has('class3'));
		assert.strictEqual(Array.from(mockElement.classList).length, 3);
	});

	it('should handle non-string class names safely', () => {
		// Test with various non-string values that could be passed as classNames
		addClass(
			mockElement,
			'valid-class',
			123,
			null,
			undefined,
			{},
			[],
			'another-valid',
		);

		// Only string values that can be trimmed should be added
		assert.ok(
			mockElement.classList.has('valid-class'),
			'String "valid-class" should be present',
		);
		assert.ok(
			mockElement.classList.has('another-valid'),
			'String "another-valid" should be present',
		);

		// Non-string values should be filtered out (no errors thrown)
		// Check that we only have the 2 valid string classes
		assert.strictEqual(mockElement.className, 'valid-class another-valid');
	});

	it('should handle various non-string and edge case inputs comprehensively', () => {
		// Test to achieve 100% branch coverage for the filter condition
		// The filter checks: Boolean(className && typeof className === 'string' && className.trim())

		// Test case 1: Non-string values (should be filtered out)
		addClass(mockElement, 123, true, false, {}, [], Symbol('test'));
		assert.strictEqual(
			mockElement.className,
			'',
			'Non-string values should be filtered out',
		);

		// Test case 2: String values that fail the trim test (empty after trim)
		addClass(mockElement, '', '   ', '\t\n  ');
		assert.strictEqual(
			mockElement.className,
			'',
			'Empty and whitespace-only strings should be filtered out',
		);

		// Test case 3: Valid strings that pass all checks
		addClass(mockElement, 'valid1', '  valid2  ', ' valid3');
		const classes = mockElement.className.split(' ').filter(c => c.length > 0);
		assert.strictEqual(
			classes.length,
			3,
			'Should have exactly 3 valid classes',
		);
		assert.ok(mockElement.classList.has('valid1'));
		assert.ok(mockElement.classList.has('valid2')); // The function should trim and use 'valid2'
		assert.ok(mockElement.classList.has('valid3'));

		// Reset for next test
		mockElement = new MockElement();

		// Test case 4: Mixed valid and invalid to ensure filter works correctly
		addClass(
			mockElement,
			null,
			'class1',
			undefined,
			'',
			'  class2  ',
			42,
			'   ',
			'class3',
		);
		const finalClasses = Array.from(mockElement.classList);
		assert.strictEqual(finalClasses.length, 3, 'Should have exactly 3 classes');
		assert.ok(mockElement.classList.has('class1'));
		assert.ok(mockElement.classList.has('class2'));
		assert.ok(mockElement.classList.has('class3'));

		// Test case 5: Verify the validClassNames.length > 0 branch
		// When no valid class names are provided, the add operation should be skipped
		mockElement = new MockElement();
		addClass(mockElement, null, undefined, '', '   ', 123, {});
		assert.strictEqual(
			mockElement.className,
			'',
			'No classes should be added when all inputs are invalid',
		);
	});

	describe('JSDOM Environment Tests', () => {
		beforeEach(() => {
			setupJSDOM();
		});

		afterEach(() => {
			cleanupJSDOM();
		});

		it('should add classes to real DOM elements', () => {
			const element = document.createElement('div');

			addClass(element, 'test-class');

			assert.ok(element.classList.contains('test-class'));
			assert.strictEqual(element.className, 'test-class');
		});

		it('should add multiple classes to real DOM elements', () => {
			const element = document.createElement('div');

			addClass(element, 'class1', 'class2', 'class3');

			assert.ok(element.classList.contains('class1'));
			assert.ok(element.classList.contains('class2'));
			assert.ok(element.classList.contains('class3'));
			assert.strictEqual(element.className, 'class1 class2 class3');
		});

		it('should handle existing classes in real DOM', () => {
			const element = document.createElement('div');
			element.className = 'existing-class';

			addClass(element, 'new-class');

			assert.ok(element.classList.contains('existing-class'));
			assert.ok(element.classList.contains('new-class'));
			assert.strictEqual(element.className, 'existing-class new-class');
		});

		it('should not duplicate classes in real DOM', () => {
			const element = document.createElement('div');
			element.className = 'existing-class';

			addClass(element, 'existing-class', 'new-class');

			// Should not duplicate existing-class
			const classes = element.className.split(' ');
			const existingCount = classes.filter(c => c === 'existing-class').length;
			assert.strictEqual(existingCount, 1);
			assert.ok(element.classList.contains('new-class'));
		});

		it('should work with various HTML elements in real DOM', () => {
			const elements = ['div', 'span', 'p', 'section', 'article'];

			elements.forEach(tagName => {
				const element = document.createElement(tagName);
				addClass(element, `${tagName}-class`);

				assert.ok(element.classList.contains(`${tagName}-class`));
				assert.strictEqual(element.className, `${tagName}-class`);
			});
		});

		it('should handle empty and whitespace class names in real DOM', () => {
			const element = document.createElement('div');

			addClass(element, '', '  ', 'valid-class', '   ');

			// Only valid-class should be added
			assert.strictEqual(element.className, 'valid-class');
			assert.ok(element.classList.contains('valid-class'));
		});
	});
});
