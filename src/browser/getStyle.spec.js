import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getStyle } from './getStyle.js';
import {
	setupJSDOM,
	cleanupJSDOM,
	setupBrowserMocks,
	restoreGlobals,
} from '../../utils/test.utils.js';

describe('getStyle(element, pseudoElt)', () => {
	let mockElement;
	let mockComputedStyle;

	beforeEach(() => {
		setupBrowserMocks();

		// Mock computed style object
		mockComputedStyle = {
			color: 'rgb(255, 0, 0)',
			fontSize: '16px',
			display: 'block',
			margin: '10px',
			getPropertyValue: function (property) {
				return this[property] || '';
			},
		};

		// Mock element
		mockElement = {
			tagName: 'DIV',
			className: 'test-element',
		};

		// Mock window.getComputedStyle
		global.window.getComputedStyle = (element, _pseudoElt) => {
			if (element === mockElement) {
				return mockComputedStyle;
			}
			return null;
		};
	});

	afterEach(() => {
		restoreGlobals();
	});

	it('should return computed style for valid element', () => {
		const result = getStyle(mockElement);

		assert.strictEqual(result, mockComputedStyle);
		assert.strictEqual(result.color, 'rgb(255, 0, 0)');
		assert.strictEqual(result.fontSize, '16px');
	});

	it('should pass pseudoElement parameter to getComputedStyle', () => {
		let capturedPseudoElt;

		global.window.getComputedStyle = (element, pseudoElt) => {
			capturedPseudoElt = pseudoElt;
			return mockComputedStyle;
		};

		getStyle(mockElement, '::before');
		assert.strictEqual(capturedPseudoElt, '::before');
	});

	it('should handle common pseudo-elements', () => {
		const pseudoElements = [
			'::before',
			'::after',
			'::first-line',
			'::first-letter',
		];

		pseudoElements.forEach((pseudo) => {
			let capturedPseudoElt;

			global.window.getComputedStyle = (element, pseudoElt) => {
				capturedPseudoElt = pseudoElt;
				return mockComputedStyle;
			};

			getStyle(mockElement, pseudo);
			assert.strictEqual(capturedPseudoElt, pseudo);
		});
	});

	it('should return null for null element', () => {
		const result = getStyle(null);
		assert.strictEqual(result, null);
	});

	it('should return null for undefined element', () => {
		const result = getStyle(undefined);
		assert.strictEqual(result, null);
	});

	it('should return null when getComputedStyle is not available', () => {
		global.window = {};

		const result = getStyle(mockElement);
		assert.strictEqual(result, null);
	});

	it('should return null when window is not defined', () => {
		global.window = undefined;

		const result = getStyle(mockElement);
		assert.strictEqual(result, null);
	});

	it('should handle getComputedStyle returning null', () => {
		global.window.getComputedStyle = () => null;

		const result = getStyle(mockElement);
		assert.strictEqual(result, null);
	});

	it('should work without pseudoElement parameter', () => {
		let capturedPseudoElt;

		global.window.getComputedStyle = (element, pseudoElt) => {
			capturedPseudoElt = pseudoElt;
			return mockComputedStyle;
		};

		getStyle(mockElement);
		assert.strictEqual(capturedPseudoElt, undefined);
	});

	it('should handle elements with complex styles', () => {
		const complexStyles = {
			color: 'rgba(255, 0, 0, 0.5)',
			fontSize: '1.2rem',
			margin: '10px 20px 30px 40px',
			transform: 'translateX(100px) rotate(45deg)',
			background: 'linear-gradient(to right, red, blue)',
			getPropertyValue: function (property) {
				return this[property] || '';
			},
		};

		global.window.getComputedStyle = () => complexStyles;

		const result = getStyle(mockElement);
		assert.strictEqual(result.color, 'rgba(255, 0, 0, 0.5)');
		assert.strictEqual(result.transform, 'translateX(100px) rotate(45deg)');
		assert.strictEqual(
			result.background,
			'linear-gradient(to right, red, blue)',
		);
	});

	it('should handle empty style object', () => {
		const emptyStyles = {
			getPropertyValue: function (_property) {
				return '';
			},
		};

		global.window.getComputedStyle = () => emptyStyles;

		const result = getStyle(mockElement);
		assert.strictEqual(result, emptyStyles);
	});

	describe('JSDOM Environment Tests', () => {
		beforeEach(() => {
			setupJSDOM(`
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						.test-element {
							color: red;
							font-size: 16px;
							margin: 10px;
							display: block;
						}
						.hidden {
							display: none;
						}
						#styled-div {
							background-color: blue;
							padding: 20px;
						}
					</style>
				</head>
				<body>
					<div id="styled-div" class="test-element">Test Content</div>
					<p class="test-element hidden">Hidden paragraph</p>
				</body>
				</html>
			`);
		});

		afterEach(() => {
			cleanupJSDOM();
		});

		it('should get computed styles from real DOM elements', () => {
			const element = document.getElementById('styled-div');
			const computedStyle = getStyle(element);

			assert.notStrictEqual(computedStyle, null);
			assert.strictEqual(typeof computedStyle, 'object');

			// Note: exact color values may vary in different environments
			// so we test that the properties exist and are strings
			assert.strictEqual(typeof computedStyle.color, 'string');
			assert.strictEqual(typeof computedStyle.fontSize, 'string');
			assert.strictEqual(typeof computedStyle.display, 'string');
		});

		it('should handle pseudo-elements in real DOM', () => {
			const element = document.getElementById('styled-div');
			const computedStyle = getStyle(element, '::before');

			// Even if no specific ::before styles are defined,
			// getComputedStyle should return a CSSStyleDeclaration
			assert.notStrictEqual(computedStyle, null);
			assert.strictEqual(typeof computedStyle, 'object');
		});

		it('should work with dynamically created elements', () => {
			const element = document.createElement('div');
			element.style.color = 'green';
			element.style.fontSize = '14px';
			document.body.appendChild(element);

			const computedStyle = getStyle(element);

			assert.notStrictEqual(computedStyle, null);
			assert.strictEqual(typeof computedStyle.color, 'string');
			assert.strictEqual(typeof computedStyle.fontSize, 'string');
		});

		it('should handle elements with multiple classes', () => {
			const element = document.querySelector('.test-element.hidden');
			const computedStyle = getStyle(element);

			assert.notStrictEqual(computedStyle, null);
			// The element should have styles from both classes
			assert.strictEqual(typeof computedStyle.display, 'string');
			assert.strictEqual(typeof computedStyle.color, 'string');
		});

		it('should work with different element types', () => {
			const elements = ['div', 'span', 'p', 'section'];

			elements.forEach((tagName) => {
				const element = document.createElement(tagName);
				document.body.appendChild(element);

				const computedStyle = getStyle(element);

				assert.notStrictEqual(computedStyle, null);
				assert.strictEqual(typeof computedStyle, 'object');
				assert.strictEqual(typeof computedStyle.display, 'string');
			});
		});

		it('should return null for null/undefined elements', () => {
			assert.strictEqual(getStyle(null), null);
			assert.strictEqual(getStyle(undefined), null);
		});
	});
});
