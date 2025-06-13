import { describe, it, beforeEach, done } from 'node:test';
import assert from 'node:assert/strict';
import { debounce } from './debounce.js';

describe('debounce(func, delay)', () => {
	let callCount;
	let lastArgs;
	let testFunction;

	beforeEach(() => {
		callCount = 0;
		lastArgs = null;
		testFunction = (...args) => {
			callCount++;
			lastArgs = args;
		};
	});

	it('should delay function execution', (t, done) => {
		const debouncedFn = debounce(testFunction, 50);

		debouncedFn('test');
		assert.strictEqual(callCount, 0); // Should not be called immediately

		setTimeout(() => {
			assert.strictEqual(callCount, 1); // Should be called after delay
			assert.deepStrictEqual(lastArgs, ['test']);
			done();
		}, 60);
	});

	it('should cancel previous calls when called multiple times rapidly', (t, done) => {
		const debouncedFn = debounce(testFunction, 50);

		debouncedFn('first');
		debouncedFn('second');
		debouncedFn('third');

		setTimeout(() => {
			assert.strictEqual(callCount, 1); // Should only be called once
			assert.deepStrictEqual(lastArgs, ['third']); // With the last arguments
			done();
		}, 60);
	});

	it('should preserve function context (this)', (t, done) => {
		const context = { value: 'test-context' };
		let receivedContext;

		const contextFunction = function (...args) {
			receivedContext = this;
			lastArgs = args;
		};

		const debouncedFn = debounce(contextFunction, 30);
		debouncedFn.call(context, 'arg1', 'arg2');

		setTimeout(() => {
			assert.strictEqual(receivedContext, context);
			assert.deepStrictEqual(lastArgs, ['arg1', 'arg2']);
			done();
		}, 40);
	});

	it('should handle multiple arguments correctly', (t, done) => {
		const debouncedFn = debounce(testFunction, 30);

		debouncedFn('arg1', 'arg2', 'arg3', 123, { key: 'value' });

		setTimeout(() => {
			assert.strictEqual(callCount, 1);
			assert.deepStrictEqual(lastArgs, [
				'arg1',
				'arg2',
				'arg3',
				123,
				{ key: 'value' },
			]);
			done();
		}, 40);
	});

	it('should work with zero delay', (t, done) => {
		const debouncedFn = debounce(testFunction, 0);

		debouncedFn('test');

		// With 0 delay, should still use setTimeout (next tick)
		assert.strictEqual(callCount, 0);

		setTimeout(() => {
			assert.strictEqual(callCount, 1);
			assert.deepStrictEqual(lastArgs, ['test']);
			done();
		}, 1);
	});

	it('should reset timer on each call', (t, done) => {
		const debouncedFn = debounce(testFunction, 50);

		debouncedFn('first');

		setTimeout(() => {
			debouncedFn('second'); // Reset timer
		}, 25);

		setTimeout(() => {
			assert.strictEqual(callCount, 0); // Should not have been called yet
		}, 60);

		setTimeout(() => {
			assert.strictEqual(callCount, 1); // Should be called with "second"
			assert.deepStrictEqual(lastArgs, ['second']);
			done();
		}, 80);
	});
	it('should have error handling in the debounced function', (t, done) => {
		const errorFunction = () => {
			throw new Error('Test error handling');
		};

		// Save original console.error
		const originalConsoleError = console.error;
		let errorCaught = false;
		let errorMessage = '';
		let caughtError = null;

		// Mock console.error to capture the error
		console.error = (msg, err) => {
			errorCaught = true;
			errorMessage = msg;
			caughtError = err;
		};

		// Create and call the debounced function
		const debouncedFn = debounce(errorFunction, 10);
		debouncedFn();

		// Wait for the debounced function to execute
		setTimeout(() => {
			// Verify error was caught and logged
			assert.strictEqual(
				errorCaught,
				true,
				'Error should have been caught and logged',
			);
			assert.strictEqual(errorMessage, 'Error in debounced function:');
			assert.ok(caughtError instanceof Error);
			assert.strictEqual(caughtError.message, 'Test error handling');

			// Restore console.error
			console.error = originalConsoleError;

			// Signal test completion
			done();
		}, 50);
	});

	// Test that errors don't break subsequent debounced calls
	it('should continue working after an error', (t, done) => {
		let callCount = 0;
		let errorCaught = false;

		const errorFunction = () => {
			if (callCount === 0) {
				callCount++;
				throw new Error('First call error');
			} else {
				callCount++;
			}
		};

		// Save original console.error
		const originalConsoleError = console.error;

		// Mock console.error to capture the error
		console.error = () => {
			errorCaught = true;
		};

		const debouncedFn = debounce(errorFunction, 10);

		// First call should error
		debouncedFn();

		setTimeout(() => {
			// Verify error was logged
			assert.strictEqual(errorCaught, true, 'Error should have been logged');
			assert.strictEqual(callCount, 1, 'Function should have been called once');

			// Second call should work normally
			debouncedFn();

			setTimeout(() => {
				assert.strictEqual(callCount, 2, 'Function should have been called twice');

				// Restore console.error
				console.error = originalConsoleError;
				done();
			}, 20);
		}, 20);
	});
});
