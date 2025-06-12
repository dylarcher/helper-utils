import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { throttle } from "./throttle.js";

describe("throttle(func, limit)", () => {
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

	it("should call function immediately on first invocation", () => {
		const throttledFn = throttle(testFunction, 100);

		throttledFn("test");
		assert.strictEqual(callCount, 1);
		assert.deepStrictEqual(lastArgs, ["test"]);
	});

	it("should throttle subsequent calls within limit period", (t, done) => {
		const throttledFn = throttle(testFunction, 50);

		throttledFn("first");
		throttledFn("second");
		throttledFn("third");

		// Should only be called once immediately
		assert.strictEqual(callCount, 1);
		assert.deepStrictEqual(lastArgs, ["first"]);

		setTimeout(() => {
			// Should allow next call after limit period
			throttledFn("fourth");
			assert.strictEqual(callCount, 2);
			assert.deepStrictEqual(lastArgs, ["fourth"]);
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

		const throttledFn = throttle(contextFunction, 30);
		throttledFn.call(context, "arg1", "arg2");

		assert.strictEqual(receivedContext, context);
		assert.deepStrictEqual(lastArgs, ["arg1", "arg2"]);

		setTimeout(() => {
			throttledFn.call(context, "arg3", "arg4");
			assert.strictEqual(receivedContext, context);
			assert.deepStrictEqual(lastArgs, ["arg3", "arg4"]);
			done();
		}, 40);
	});

	it("should handle multiple arguments correctly", () => {
		const throttledFn = throttle(testFunction, 50);

		throttledFn("arg1", "arg2", "arg3", 123, { key: "value" });

		assert.strictEqual(callCount, 1);
		assert.deepStrictEqual(lastArgs, [
			"arg1",
			"arg2",
			"arg3",
			123,
			{ key: "value" },
		]);
	});

	it("should work with zero limit", (t, done) => {
		const throttledFn = throttle(testFunction, 0);

		throttledFn("first");
		assert.strictEqual(callCount, 1);

		// With zero limit, each call should execute immediately without throttling
		throttledFn("second");
		assert.strictEqual(callCount, 2); // Should execute immediately with zero limit

		setTimeout(() => {
			throttledFn("third");
			assert.strictEqual(callCount, 3);
			done();
		}, 10);
	});

	it("should reset throttle after limit period", (t, done) => {
		const throttledFn = throttle(testFunction, 30);

		// First call - should execute immediately
		throttledFn("first");
		assert.strictEqual(callCount, 1);

		// Second call - should be throttled
		throttledFn("second");
		assert.strictEqual(callCount, 1);

		setTimeout(() => {
			// Third call - should execute after throttle period
			throttledFn("third");
			assert.strictEqual(callCount, 2);
			assert.deepStrictEqual(lastArgs, ["third"]);
			done();
		}, 35);
	});

	it("should handle rapid successive calls correctly", (t, done) => {
		const throttledFn = throttle(testFunction, 50);

		// Call multiple times rapidly
		for (let i = 0; i < 10; i++) {
			throttledFn(`call-${i}`);
		}

		// Should only execute the first call
		assert.strictEqual(callCount, 1);
		assert.deepStrictEqual(lastArgs, ["call-0"]);

		setTimeout(() => {
			// Should be able to call again after throttle period
			throttledFn("after-throttle");
			assert.strictEqual(callCount, 2);
			assert.deepStrictEqual(lastArgs, ["after-throttle"]);
			done();
		}, 60);
	});

	it("should handle function that throws error", () => {
		const errorFunction = () => {
			callCount++;
			throw new Error("Test error");
		};

		const throttledFn = throttle(errorFunction, 30);

		// Should throw on first call
		assert.throws(() => {
			throttledFn();
		}, Error);

		assert.strictEqual(callCount, 1);

		// Subsequent calls should be throttled (not throw immediately)
		assert.doesNotThrow(() => {
			throttledFn();
		});

		// Should still be only one call
		assert.strictEqual(callCount, 1);
	});

	it("should handle different instances independently", (t, done) => {
		const throttledFn1 = throttle(testFunction, 50);
		const throttledFn2 = throttle(testFunction, 50);

		throttledFn1("first-fn1");
		throttledFn2("first-fn2");

		// Both should execute immediately
		assert.strictEqual(callCount, 2);

		throttledFn1("second-fn1");
		throttledFn2("second-fn2");

		// Should still be 2 (both throttled)
		assert.strictEqual(callCount, 2);

		setTimeout(() => {
			throttledFn1("third-fn1");
			throttledFn2("third-fn2");

			// Both should execute again
			assert.strictEqual(callCount, 4);
			done();
		}, 60);
	});

	it("should work with async functions", (t, done) => {
		let asyncCallCount = 0;

		const asyncFunction = async (...args) => {
			asyncCallCount++;
			lastArgs = args;
			return "async-result";
		};

		const throttledAsyncFn = throttle(asyncFunction, 30);

		throttledAsyncFn("async-test");
		assert.strictEqual(asyncCallCount, 1);

		setTimeout(() => {
			throttledAsyncFn("async-test-2");
			assert.strictEqual(asyncCallCount, 2);
			assert.deepStrictEqual(lastArgs, ["async-test-2"]);
			done();
		}, 40);
	});
});
