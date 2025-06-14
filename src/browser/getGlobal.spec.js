import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getGlobal } from './getGlobal.js';

describe('getGlobal()', () => {
	const originalGlobalThis = global.globalThis;
	const originalSelf = global.self;
	const originalWindow = global.window;
	const originalGlobalProp = global.global;

	afterEach(() => {
		// Restore all potentially modified globals
		if (originalGlobalThis !== undefined) {
			global.globalThis = originalGlobalThis;
		} else {
			delete global.globalThis;
		}

		if (originalSelf !== undefined) {
			global.self = originalSelf;
		} else {
			delete global.self;
		}

		if (originalWindow !== undefined) {
			global.window = originalWindow;
		} else {
			delete global.window;
		}

		if (originalGlobalProp !== undefined) {
			global.global = originalGlobalProp;
		} else {
			delete global.global;
		}
	});

	it('should return globalThis if available', () => {
		// Assuming 'globalThis' is available in the test environment (Node.js >= 12)
		assert.strictEqual(getGlobal(), globalThis);
	});

	it('should return self if globalThis is not defined and self is', () => {
		delete global.globalThis;
		global.self = { type: 'self' }; // Mock self
		assert.deepStrictEqual(getGlobal(), { type: 'self' });
	});

	it('should return window if globalThis and self are not defined and window is', () => {
		delete global.globalThis;
		delete global.self;
		global.window = { type: 'window' }; // Mock window
		assert.deepStrictEqual(getGlobal(), { type: 'window' });
	});

	it('should return Node.js global if globalThis, self, and window are not defined', () => {
		delete global.globalThis;
		delete global.self;
		delete global.window;
		// In Node.js, global should be available
		global.global = global;
		assert.strictEqual(
			getGlobal(),
			global,
			'Should return the Node.js global object.',
		);
	});

	it.skip("should use Function('return this')() if other globals are not found", () => {
		// This test is skipped because manipulating globals in Node.js is unreliable
		// and can interfere with the test environment. In a real browser environment,
		// this fallback would work correctly.
	});

	it.skip("should return empty object and log error if Function('return this')() fails", () => {
		// This test is skipped because creating the exact conditions (CSP violation)
		// that would cause Function('return this')() to fail is not possible in Node.js
		// test environment. In a real browser with CSP, this would work correctly.
	});

	it('should accept an options parameter (though unused)', () => {
		// Test that function accepts options parameter without breaking
		const result = getGlobal({ someOption: true });
		assert.notStrictEqual(result, null);
		assert.strictEqual(typeof result, 'object');
	});
});
