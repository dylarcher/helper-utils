import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { querySelectorAllWrapper } from "./querySelectorAllWrapper.js";

describe("querySelectorAllWrapper(selector, container)", () => {
	it("should return empty array for null container", () => {
		const result = querySelectorAllWrapper(".test", null);
		assert.deepStrictEqual(result, []);
	});

	it("should return empty array for undefined container", () => {
		const result = querySelectorAllWrapper(".test", undefined);
		assert.deepStrictEqual(result, []);
	});

	it("should return empty array for container without querySelectorAll method", () => {
		const mockContainer = {};
		const result = querySelectorAllWrapper(".test", mockContainer);
		assert.deepStrictEqual(result, []);
	});

	it("should return empty array for container with null querySelectorAll method", () => {
		const mockContainer = { querySelectorAll: null };
		const result = querySelectorAllWrapper(".test", mockContainer);
		assert.deepStrictEqual(result, []);
	});

	it("should convert NodeList to Array with custom container", () => {
		const mockElements = [
			{ id: "element1", matches: () => true },
			{ id: "element2", matches: () => true },
		];

		const mockContainer = {
			querySelectorAll: (selector) => {
				assert.strictEqual(selector, ".test");
				return mockElements; // Return array-like object
			},
		};

		const result = querySelectorAllWrapper(".test", mockContainer);
		assert.ok(Array.isArray(result));
		assert.strictEqual(result.length, 2);
		assert.strictEqual(result[0].id, "element1");
		assert.strictEqual(result[1].id, "element2");
	});

	it("should handle empty NodeList", () => {
		const mockContainer = {
			querySelectorAll: () => [],
		};

		const result = querySelectorAllWrapper(".test", mockContainer);
		assert.ok(Array.isArray(result));
		assert.strictEqual(result.length, 0);
	});

	it("should handle complex selectors", () => {
		const mockElements = [{ id: "complex" }];

		const mockContainer = {
			querySelectorAll: (selector) => {
				assert.strictEqual(selector, "div.test[data-value='complex']");
				return mockElements;
			},
		};

		const result = querySelectorAllWrapper(
			"div.test[data-value='complex']",
			mockContainer,
		);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].id, "complex");
	});

	it("should handle querySelectorAll throwing error", () => {
		const mockContainer = {
			querySelectorAll: () => {
				throw new Error("querySelectorAll failed");
			},
		};

		assert.throws(
			() => {
				querySelectorAllWrapper(".test", mockContainer);
			},
			{ message: "querySelectorAll failed" },
		);
	});

	it("should work with various selector types", () => {
		const selectors = ["#id", ".class", "div", "[data-test]", ":first-child"];

		selectors.forEach((selector) => {
			const mockContainer = {
				querySelectorAll: (sel) => {
					assert.strictEqual(sel, selector);
					return [];
				},
			};

			const result = querySelectorAllWrapper(selector, mockContainer);
			assert.ok(Array.isArray(result));
		});
	});

	it("should handle container with querySelectorAll as non-function", () => {
		const mockContainer = { querySelectorAll: "not a function" };
		const result = querySelectorAllWrapper(".test", mockContainer);
		assert.deepStrictEqual(result, []);
	});

	it("should use document as default container", () => {
		// Mock global document
		const originalDocument = global.document;
		global.document = {
			querySelectorAll: (selector) => {
				assert.strictEqual(selector, ".test");
				return [{ id: "from-document" }];
			},
		};

		try {
			const result = querySelectorAllWrapper(".test");
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].id, "from-document");
		} finally {
			global.document = originalDocument;
		}
	});
});
