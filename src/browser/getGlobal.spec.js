import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { getGlobal } from './getGlobal.js';

describe('getGlobal()', () => {
	let originalGlobal;
	let dom;
	let window;

	beforeEach(() => {
		// Save original values
		originalGlobal = globalThis.global;

		// Create a new JSDOM instance for browser environment simulation
		dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
			url: 'http://localhost',
			pretendToBeVisual: true,
			resources: 'usable',
		});
		window = dom.window;
	});

	afterEach(() => {
		// Restore original values
		if (originalGlobal !== undefined) {
			globalThis.global = originalGlobal;
		} else {
			delete globalThis.global;
		}

		// Clean up JSDOM
		if (dom) {
			dom.window.close();
			dom = null;
			window = null;
		}
	});

	it('should return global object when global is available (Node.js environment)', () => {
		// In Node.js, global should be available
		const result = getGlobal();

		// Verify we get a global object
		assert.ok(typeof result === 'object', 'Should return an object');
		assert.ok(result !== null, 'Should not return null');

		// In Node.js environment, global should be defined and result should be global
		if (typeof global !== 'undefined') {
			assert.strictEqual(
				result,
				global,
				'Should return global in Node.js environment',
			);
		}
	});

	it('should return globalThis when global is not available (browser environment)', () => {
		// Mock browser environment by temporarily setting global to undefined
		globalThis.global = undefined;

		const result = getGlobal();

		assert.strictEqual(
			result,
			globalThis,
			'Should return globalThis when global is not available',
		);
	});

	it('should return global when both global and globalThis are available', () => {
		// Ensure global is available (this should be the case in Node.js)
		const result = getGlobal();

		// In Node.js, global should be preferred
		if (typeof global !== 'undefined') {
			assert.strictEqual(
				result,
				global,
				'Should prefer global over globalThis when both are available',
			);
		}
	});

	it('should handle simulated browser environment using jsdom', () => {
		// Save the current global reference
		const nodeGlobal = globalThis.global;

		// Temporarily set global to undefined to simulate browser environment
		globalThis.global = undefined;

		// Add browser-like properties using jsdom window
		const originalWindow = globalThis.window;
		const originalDocument = globalThis.document;
		const _originalNavigator = globalThis.navigator;
		const _originalLocation = globalThis.location;

		try {
			// Mock browser environment by adding window and document
			Object.defineProperty(globalThis, 'window', {
				value: window,
				writable: true,
				configurable: true,
			});
			Object.defineProperty(globalThis, 'document', {
				value: window.document,
				writable: true,
				configurable: true,
			});

			const result = getGlobal();

			// Should return globalThis in browser environment
			assert.strictEqual(
				result,
				globalThis,
				'Should return globalThis in simulated browser environment',
			);
			assert.ok('window' in result, 'Should have window property');
			assert.ok('document' in result, 'Should have document property');
		} finally {
			// Restore original state
			if (originalWindow !== undefined) {
				globalThis.window = originalWindow;
			} else {
				delete globalThis.window;
			}
			if (originalDocument !== undefined) {
				globalThis.document = originalDocument;
			} else {
				delete globalThis.document;
			}
			// Note: We don't restore navigator and location as they might be read-only properties
			globalThis.global = nodeGlobal;
		}
	});

	it('should handle the case when global is null', () => {
		// Set global to null
		globalThis.global = null;

		const result = getGlobal();

		assert.strictEqual(
			result,
			globalThis,
			'Should return globalThis when global is null',
		);
	});

	it('should handle the case when global is undefined', () => {
		// Explicitly set global to undefined
		globalThis.global = undefined;

		const result = getGlobal();

		assert.strictEqual(
			result,
			globalThis,
			'Should return globalThis when global is undefined',
		);
	});

	it('should ignore the optional options parameter', () => {
		const result1 = getGlobal();
		const result2 = getGlobal({});
		const result3 = getGlobal({ someOption: 'value' });

		assert.strictEqual(
			result1,
			result2,
			'Should return same result regardless of options',
		);
		assert.strictEqual(
			result2,
			result3,
			'Should return same result regardless of options content',
		);
	});

	it('should return the same object on multiple calls', () => {
		const result1 = getGlobal();
		const result2 = getGlobal();

		assert.strictEqual(
			result1,
			result2,
			'Should return the same object on multiple calls',
		);
	});

	it('should return an object that can be used to set and get global variables', () => {
		const globalObj = getGlobal();
		const testKey = `__test_global_var_${Math.random()}`;
		const testValue = `test_value_${Math.random()}`;

		// Set a global variable
		globalObj[testKey] = testValue;

		// Verify it can be retrieved
		assert.strictEqual(
			globalObj[testKey],
			testValue,
			'Should be able to set and get global variables',
		);

		// Clean up
		delete globalObj[testKey];
	});

	it('should return an object with expected global properties', () => {
		const globalObj = getGlobal();

		// Check for common global properties that should exist
		assert.ok('Object' in globalObj, 'Should have Object constructor');
		assert.ok('Array' in globalObj, 'Should have Array constructor');
		assert.ok('Function' in globalObj, 'Should have Function constructor');
		assert.ok('console' in globalObj, 'Should have console object');

		// In Node.js environment, check for Node.js specific globals
		if (typeof global !== 'undefined' && globalObj === global) {
			assert.ok(
				'process' in globalObj,
				'Should have process object in Node.js',
			);
			assert.ok('Buffer' in globalObj, 'Should have Buffer in Node.js');
		}
	});

	it('should work correctly with jsdom window simulation', () => {
		// Create a mock browser environment
		const savedGlobal = globalThis.global;
		globalThis.global = undefined; // Set to undefined instead of deleting

		// Save original properties
		const originalWindow = globalThis.window;
		const originalDocument = globalThis.document;
		const _originalNavigator = globalThis.navigator;
		const _originalLocation = globalThis.location;

		try {
			// Add browser-like properties to globalThis using jsdom
			Object.defineProperty(globalThis, 'window', {
				value: window,
				writable: true,
				configurable: true,
			});
			Object.defineProperty(globalThis, 'document', {
				value: window.document,
				writable: true,
				configurable: true,
			});

			const result = getGlobal();

			// Should return globalThis which now has browser properties
			assert.strictEqual(
				result,
				globalThis,
				'Should return globalThis in browser simulation',
			);
			assert.strictEqual(
				result.window,
				window,
				'Should have access to jsdom window',
			);
			assert.strictEqual(
				result.document,
				window.document,
				'Should have access to jsdom document',
			);
		} finally {
			// Cleanup - restore original values
			if (originalWindow !== undefined) {
				Object.defineProperty(globalThis, 'window', {
					value: originalWindow,
					writable: true,
					configurable: true,
				});
			} else {
				delete globalThis.window;
			}
			if (originalDocument !== undefined) {
				Object.defineProperty(globalThis, 'document', {
					value: originalDocument,
					writable: true,
					configurable: true,
				});
			} else {
				delete globalThis.document;
			}
			globalThis.global = savedGlobal;
		}
	});

	it('should handle cross-environment compatibility', () => {
		// Test Node.js environment behavior
		if (typeof global !== 'undefined') {
			const nodeResult = getGlobal();
			assert.strictEqual(nodeResult, global, 'Should return global in Node.js');
		}

		// Test simulated browser environment
		const savedGlobal = globalThis.global;
		globalThis.global = undefined;

		// Add browser globals from jsdom
		globalThis.window = window;
		globalThis.document = window.document;

		const browserResult = getGlobal();
		assert.strictEqual(
			browserResult,
			globalThis,
			'Should return globalThis in browser simulation',
		);
		assert.ok(
			browserResult.window,
			'Should have window property in browser simulation',
		);

		// Cleanup
		delete globalThis.window;
		delete globalThis.document;
		globalThis.global = savedGlobal;
	});

	it('should work correctly with the nullish coalescing operator logic', () => {
		// Test the specific implementation: (typeof global !== 'undefined' ? global : null) ?? globalThis

		// When global exists and is not null/undefined
		if (typeof global !== 'undefined') {
			const result = getGlobal();
			assert.strictEqual(result, global, 'Should return global when it exists');
		}

		// When global is made unavailable (simulate browser)
		const savedGlobal = globalThis.global;
		globalThis.global = undefined;

		// Mock the global variable being undefined in browser context
		const result = getGlobal();
		assert.strictEqual(
			result,
			globalThis,
			'Should return globalThis when global is not available',
		);

		// Restore
		globalThis.global = savedGlobal;
	});

	it('should enable browser DOM manipulation with jsdom in mock environment', () => {
		// Save current state
		const savedGlobal = globalThis.global;
		globalThis.global = undefined;

		// Set up jsdom environment in globalThis
		globalThis.window = window;
		globalThis.document = window.document;
		globalThis.Document = window.Document;
		globalThis.Element = window.Element;
		globalThis.HTMLElement = window.HTMLElement;

		const result = getGlobal();

		// Verify we can access DOM APIs through the global object
		assert.strictEqual(
			result,
			globalThis,
			'Should return globalThis in browser simulation',
		);
		assert.ok(result.document, 'Should have document object');
		assert.ok(result.window, 'Should have window object');

		// Test DOM manipulation through the global object
		const testDiv = result.document.createElement('div');
		testDiv.id = 'test-element';
		testDiv.textContent = 'Hello from jsdom!';

		assert.strictEqual(
			testDiv.tagName,
			'DIV',
			'Should be able to create DOM elements',
		);
		assert.strictEqual(
			testDiv.id,
			'test-element',
			'Should be able to set element properties',
		);
		assert.strictEqual(
			testDiv.textContent,
			'Hello from jsdom!',
			'Should be able to set text content',
		);

		// Test that we can append to document body
		result.document.body.appendChild(testDiv);
		const foundElement = result.document.getElementById('test-element');
		assert.strictEqual(
			foundElement,
			testDiv,
			'Should be able to append and find elements in DOM',
		);

		// Clean up
		delete globalThis.window;
		delete globalThis.document;
		delete globalThis.Document;
		delete globalThis.Element;
		delete globalThis.HTMLElement;
		globalThis.global = savedGlobal;
	});
});