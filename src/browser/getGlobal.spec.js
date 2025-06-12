import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getGlobal } from "./getGlobal.js";

describe("getGlobal()", () => {
	it("should return a global object", () => {
		const result = getGlobal();
		assert.strictEqual(typeof result, "object");
		assert.ok(result !== null);
	});

	it("should accept an options parameter", () => {
		const options = { test: true };
		const result = getGlobal(options);
		assert.strictEqual(typeof result, "object");
		assert.ok(result !== null);
	});
});
