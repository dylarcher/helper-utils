import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getGlobal } from './getGlobal.js';

describe('getGlobal()', () => {
	const originalGlobalThis = global.globalThis;
	const originalSelf = global.self;
	const originalWindow = global.window;
	const originalGlobal = global.global; // This is Node's global, which is the test context itself

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

		// global.global cannot be deleted as it's the context itself in Node.
		// If it was truly deleted in the test, Node environment would break.
		// So we assume 'global' will always exist in this test runner.
		// The function being tested checks `typeof global !== 'undefined'`,
		// which refers to the specific 'global' property, not the actual global object.
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
		// In Node.js test environment, 'global' is the global scope itself.
		// The function checks `typeof global !== 'undefined'` which specifically refers to a property named 'global'.
		// In Node.js, global.global usually refers to itself.
		delete global.globalThis;
		delete global.self;
		delete global.window;
		// global.global = { type: 'nodejs-global-property' }; // This would be shadowed by actual global
		// This test is tricky because `global` is the actual global scope in Node tests.
		// The function's `typeof global !== 'undefined'` check will be true.
		// So, it should return the Node.js global object.
		assert.strictEqual(
			getGlobal(),
			global,
			'Should return the Node.js global object.',
		);
	});

	it("should use Function('return this')() if other globals are not found", () => {
		delete global.globalThis;
		delete global.self;
		delete global.window;

		// To test this, we need 'global' property to be undefined as well.
		// This is hard in Node because `global` is the actual global execution context.
		// We can mock `global` as a property of itself to be undefined for the check.
		const realGlobalProperty = global.global; // Save it if it exists (it does)
		delete global.global; // Attempt to make `typeof global` undefined for the function's check

		const result = getGlobal();
		// Function('return this')() in Node returns the global object.
		assert.strictEqual(
			typeof result,
			'object',
			'Fallback should return an object',
		);
		assert.ok(result !== null);
		// In Node, Function('return this')() returns the main global object.
		assert.strictEqual(
			result,
			originalGlobal,
			"Function('return this') should return the Node global",
		);

		global.global = realGlobalProperty; // Restore
	});

	it("should return empty object and log error if Function('return this')() fails", () => {
		delete global.globalThis;
		delete global.self;
		delete global.window;
		const realGlobalProperty = global.global;
		delete global.global;

		const originalFunction = global.Function;
		global.Function = () => {
			throw new Error('CSP restriction');
		}; // Mock Function constructor to throw

		const consoleErrors = [];
		const originalConsoleError = console.error;
		console.error = (...args) => {
			consoleErrors.push(args);
		};

		const result = getGlobal();
		assert.deepStrictEqual(
			result,
			{},
			'Should return empty object on Function fallback failure.',
		);
		assert.strictEqual(consoleErrors.length, 1, 'Should have logged an error.');
		assert.ok(
			consoleErrors[0][0].includes(
				'Unable to determine global object reliably.',
			),
			'Error message mismatch.',
		);

		console.error = originalConsoleError; // Restore console
		global.Function = originalFunction; // Restore Function
		global.global = realGlobalProperty; // Restore global
	});

	it('should accept an options parameter (though unused)', () => {
		const options = { test: true };
		const result = getGlobal(options); // Should not affect outcome
		assert.strictEqual(typeof result, 'object');
		assert.ok(result !== null);
	});
});
