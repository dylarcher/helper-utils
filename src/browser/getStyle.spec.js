import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getStyle } from './getStyle.js';
import { setupBrowserMocks, restoreGlobals } from '../../utils/test.utils.js';

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
		global.window.getComputedStyle = (element, pseudoElt) => {
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
			getPropertyValue: function (property) {
				return '';
			},
		};

		global.window.getComputedStyle = () => emptyStyles;

		const result = getStyle(mockElement);
		assert.strictEqual(result, emptyStyles);
	});
});
