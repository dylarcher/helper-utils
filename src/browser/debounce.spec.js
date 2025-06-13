import { describe, it, beforeEach } from 'node:test';
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

	// The error handling test above doesn't actually validate the console.error
	// functionality directly, so let's add a specific test for that
	it('should log errors to console.error', (t, done) => {
		// Save original console.error
		const originalConsoleError = console.error;
		let message, error;

		// Mock console.error
		console.error = (msg, err) => {
			message = msg;
			error = err;
		};

		const errorFunction = () => {
			throw new Error('Test console error message');
		};

		const debouncedFn = debounce(errorFunction, 10);

		// Set up error handler
		const errorHandler = (err) => {
			// Verify error was logged with correct message
			assert.strictEqual(message, 'Error in debounced function:');
			assert.ok(error instanceof Error);
			assert.strictEqual(error.message, 'Test console error message');

			// Restore console.error
			console.error = originalConsoleError;

			// Signal test completion
			done();

			// Prevent the error from failing the test
			return true;
		};

		// Set global error handler
		process.on('uncaughtException', errorHandler);

		// Call the function
		debouncedFn();

		// Set a fallback timeout in case the error isn't thrown
		setTimeout(() => {
			process.removeListener('uncaughtException', errorHandler);
			console.error = originalConsoleError;

			// If the error wasn't caught properly, the test failed
			if (!message || !error) {
				assert.fail('Error was not properly logged');
			}
			done();
		}, 50);
	});
});
