import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getGlobal } from "src/browser/getGlobal.js";

describe("getGlobal()", () => {
	let originalGlobal, originalGlobalThis, originalSelf, originalWindow;

	beforeEach(() => {
		// Save original values
		originalGlobal = global.global;
		originalGlobalThis = global.globalThis;
		originalSelf = global.self;
		originalWindow = global.window;
	});

	it("should return global when available", () => {
		global.global = { type: "global" };
		global.globalThis = undefined;
		global.self = undefined;
		global.window = undefined;

		const result = getGlobal();
		assert.deepStrictEqual(result, { type: "global" });
	});

	it("should return globalThis when global is not available", () => {
		global.global = undefined;
		global.globalThis = { type: "globalThis" };
		global.self = undefined;
		global.window = undefined;

		const result = getGlobal();
		assert.deepStrictEqual(result, { type: "globalThis" });
	});

	it("should return self when global and globalThis are not available", () => {
		global.global = undefined;
		global.globalThis = undefined;
		global.self = { type: "self" };
		global.window = undefined;

		const result = getGlobal();
		assert.deepStrictEqual(result, { type: "self" });
	});

	it("should return window when global, globalThis, and self are not available", () => {
		global.global = undefined;
		global.globalThis = undefined;
		global.self = undefined;
		global.window = { type: "window" };

		const result = getGlobal();
		assert.deepStrictEqual(result, { type: "window" });
	});

	it("should return this as fallback when all others are undefined", () => {
		global.global = undefined;
		global.globalThis = undefined;
		global.self = undefined;
		global.window = undefined;

		// In this test environment, 'this' in the module context should be available
		const result = getGlobal();
		assert.ok(result !== undefined);
	});

	it("should prioritize global over other options", () => {
		global.global = { type: "global", priority: 1 };
		global.globalThis = { type: "globalThis", priority: 2 };
		global.self = { type: "self", priority: 3 };
		global.window = { type: "window", priority: 4 };

		const result = getGlobal();
		assert.strictEqual(result.type, "global");
		assert.strictEqual(result.priority, 1);
	});

	it("should handle null values correctly", () => {
		global.global = null;
		global.globalThis = { type: "globalThis" };
		global.self = undefined;
		global.window = undefined;

		const result = getGlobal();
		assert.deepStrictEqual(result, { type: "globalThis" });
	});

	it("should handle falsy values correctly", () => {
		global.global = false;
		global.globalThis = 0;
		global.self = "";
		global.window = { type: "window" };

		const result = getGlobal();
		assert.deepStrictEqual(result, { type: "window" });
	});

	it("should work with actual global object in Node.js environment", () => {
		// Restore actual global for this test
		global.global = originalGlobal;
		global.globalThis = originalGlobalThis;
		global.self = originalSelf;
		global.window = originalWindow;

		const result = getGlobal();
		// In Node.js, should return the actual global object
		assert.ok(result !== undefined);
		assert.ok(typeof result === "object");
	});

	// Cleanup after each test
	beforeEach(() => {
		global.global = originalGlobal;
		global.globalThis = originalGlobalThis;
		global.self = originalSelf;
		global.window = originalWindow;
	});
});
