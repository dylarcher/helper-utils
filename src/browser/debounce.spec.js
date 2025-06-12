import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { debounce } from "src/browser/debounce.js";

describe("debounce(func, delay)", () => {
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

	it("should delay function execution", (t, done) => {
		const debouncedFn = debounce(testFunction, 50);

		debouncedFn("test");
		assert.strictEqual(callCount, 0); // Should not be called immediately

		setTimeout(() => {
			assert.strictEqual(callCount, 1); // Should be called after delay
			assert.deepStrictEqual(lastArgs, ["test"]);
			done();
		}, 60);
	});

	it("should cancel previous calls when called multiple times rapidly", (t, done) => {
		const debouncedFn = debounce(testFunction, 50);

		debouncedFn("first");
		debouncedFn("second");
		debouncedFn("third");

		setTimeout(() => {
			assert.strictEqual(callCount, 1); // Should only be called once
			assert.deepStrictEqual(lastArgs, ["third"]); // With the last arguments
			done();
		}, 60);
	});

	it("should preserve function context (this)", (t, done) => {
		const context = { value: "test-context" };
		let receivedContext;

		const contextFunction = function (...args) {
			receivedContext = this;
			lastArgs = args;
		};

		const debouncedFn = debounce(contextFunction, 30);
		debouncedFn.call(context, "arg1", "arg2");

		setTimeout(() => {
			assert.strictEqual(receivedContext, context);
			assert.deepStrictEqual(lastArgs, ["arg1", "arg2"]);
			done();
		}, 40);
	});

	it("should handle multiple arguments correctly", (t, done) => {
		const debouncedFn = debounce(testFunction, 30);

		debouncedFn("arg1", "arg2", "arg3", 123, { key: "value" });

		setTimeout(() => {
			assert.strictEqual(callCount, 1);
			assert.deepStrictEqual(lastArgs, [
				"arg1",
				"arg2",
				"arg3",
				123,
				{ key: "value" },
			]);
			done();
		}, 40);
	});

	it("should work with zero delay", (t, done) => {
		const debouncedFn = debounce(testFunction, 0);

		debouncedFn("test");

		// With 0 delay, should still use setTimeout (next tick)
		assert.strictEqual(callCount, 0);

		setTimeout(() => {
			assert.strictEqual(callCount, 1);
			assert.deepStrictEqual(lastArgs, ["test"]);
			done();
		}, 1);
	});

	it("should reset timer on each call", (t, done) => {
		const debouncedFn = debounce(testFunction, 50);

		debouncedFn("first");

		setTimeout(() => {
			debouncedFn("second"); // Reset timer
		}, 25);

		setTimeout(() => {
			assert.strictEqual(callCount, 0); // Should not have been called yet
		}, 60);

		setTimeout(() => {
			assert.strictEqual(callCount, 1); // Should be called with "second"
			assert.deepStrictEqual(lastArgs, ["second"]);
			done();
		}, 80);
	});

	it("should handle function that throws error", (t, done) => {
		const errorFunction = () => {
			throw new Error("Test error");
		};

		const debouncedFn = debounce(errorFunction, 30);

		// Should not throw immediately
		assert.doesNotThrow(() => {
			debouncedFn();
		});

		// Error should occur after delay
		setTimeout(() => {
			// The error will occur in the setTimeout, but won't be caught here
			// This is expected behavior for debounced functions
			done();
		}, 40);
	});
});
