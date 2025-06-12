import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setAttribute } from "src/browser/setAttribute.js";

// Mock Element class for testing
class MockElement {
	constructor() {
		this.attributes = {};
	}

	setAttribute(name, value) {
		this.attributes[name] = String(value);
	}

	getAttribute(name) {
		return this.attributes[name] || null;
	}
}

describe("setAttribute(element, attributeName, value)", () => {
	let mockElement;

	beforeEach(() => {
		mockElement = new MockElement();
	});

	it("should set attribute on valid element", () => {
		setAttribute(mockElement, "id", "test-id");

		assert.strictEqual(mockElement.attributes.id, "test-id");
	});

	it("should set multiple different attributes", () => {
		setAttribute(mockElement, "id", "main");
		setAttribute(mockElement, "class", "container");
		setAttribute(mockElement, "data-value", "123");

		assert.strictEqual(mockElement.attributes.id, "main");
		assert.strictEqual(mockElement.attributes.class, "container");
		assert.strictEqual(mockElement.attributes["data-value"], "123");
	});

	it("should overwrite existing attribute", () => {
		setAttribute(mockElement, "title", "Original Title");
		setAttribute(mockElement, "title", "New Title");

		assert.strictEqual(mockElement.attributes.title, "New Title");
	});

	it("should convert non-string values to strings", () => {
		setAttribute(mockElement, "data-number", 42);
		setAttribute(mockElement, "data-boolean", true);
		setAttribute(mockElement, "data-null", null);
		setAttribute(mockElement, "data-undefined", undefined);

		assert.strictEqual(mockElement.attributes["data-number"], "42");
		assert.strictEqual(mockElement.attributes["data-boolean"], "true");
		assert.strictEqual(mockElement.attributes["data-null"], "null");
		assert.strictEqual(mockElement.attributes["data-undefined"], "undefined");
	});

	it("should handle empty string value", () => {
		setAttribute(mockElement, "placeholder", "");

		assert.strictEqual(mockElement.attributes.placeholder, "");
	});

	it("should handle whitespace in attribute name", () => {
		// Note: Real DOM would reject this, but testing the function's behavior
		setAttribute(mockElement, "data test", "value");

		assert.strictEqual(mockElement.attributes["data test"], "value");
	});

	it("should handle special characters in attribute name", () => {
		setAttribute(mockElement, "data-special-chars_123", "value");

		assert.strictEqual(
			mockElement.attributes["data-special-chars_123"],
			"value",
		);
	});

	it("should not throw for null element", () => {
		assert.doesNotThrow(() => {
			setAttribute(null, "id", "test");
		});
	});

	it("should not throw for undefined element", () => {
		assert.doesNotThrow(() => {
			setAttribute(undefined, "id", "test");
		});
	});

	it("should not throw for element without setAttribute method", () => {
		const brokenElement = {};

		assert.doesNotThrow(() => {
			setAttribute(brokenElement, "id", "test");
		});
	});

	it("should not throw for element with null setAttribute method", () => {
		const elementWithNullMethod = { setAttribute: null };

		assert.doesNotThrow(() => {
			setAttribute(elementWithNullMethod, "id", "test");
		});
	});

	it("should not set attribute for empty attribute name", () => {
		const originalAttributes = { ...mockElement.attributes };

		setAttribute(mockElement, "", "value");

		assert.deepStrictEqual(mockElement.attributes, originalAttributes);
	});

	it("should not set attribute for null attribute name", () => {
		const originalAttributes = { ...mockElement.attributes };

		setAttribute(mockElement, null, "value");

		assert.deepStrictEqual(mockElement.attributes, originalAttributes);
	});

	it("should not set attribute for undefined attribute name", () => {
		const originalAttributes = { ...mockElement.attributes };

		setAttribute(mockElement, undefined, "value");

		assert.deepStrictEqual(mockElement.attributes, originalAttributes);
	});

	it("should handle common HTML attributes", () => {
		const commonAttributes = {
			id: "main-content",
			class: "container active",
			style: "color: red; font-size: 14px;",
			"data-id": "12345",
			"aria-label": "Main content area",
			role: "main",
			tabindex: "0",
			title: "Main content",
			href: "https://example.com",
			src: "/images/logo.png",
		};

		Object.entries(commonAttributes).forEach(([name, value]) => {
			setAttribute(mockElement, name, value);
		});

		Object.entries(commonAttributes).forEach(([name, value]) => {
			assert.strictEqual(mockElement.attributes[name], value);
		});
	});

	it("should handle setAttribute throwing error", () => {
		const errorElement = {
			setAttribute: () => {
				throw new Error("setAttribute failed");
			},
		};

		// Should not throw error
		assert.doesNotThrow(() => {
			setAttribute(errorElement, "id", "test");
		});
	});

	it("should work with DOM-like element", () => {
		const domLikeElement = {
			attributes: {},
			setAttribute: function (name, value) {
				this.attributes[name] = String(value);
			},
		};

		setAttribute(domLikeElement, "custom-attr", "custom-value");

		assert.strictEqual(
			domLikeElement.attributes["custom-attr"],
			"custom-value",
		);
	});

	it("should handle complex attribute values", () => {
		const complexValues = {
			"data-json": "{\"key\": \"value\", \"number\": 123}",
			"data-array": "[1, 2, 3, 4, 5]",
			"data-special": "value with spaces & special chars!@#$%",
			"data-unicode": "café naïve 🚀 résumé",
			"data-multiline": "line 1\nline 2\nline 3",
		};

		Object.entries(complexValues).forEach(([name, value]) => {
			setAttribute(mockElement, name, value);
			assert.strictEqual(mockElement.attributes[name], value);
		});
	});

	it("should handle repeated attribute setting", () => {
		for (let i = 0; i < 10; i++) {
			setAttribute(mockElement, "counter", i.toString());
		}

		assert.strictEqual(mockElement.attributes.counter, "9");
	});

	it("should preserve attribute case sensitivity", () => {
		setAttribute(mockElement, "DataValue", "test");
		setAttribute(mockElement, "datavalue", "test2");
		setAttribute(mockElement, "DATAVALUE", "test3");

		assert.strictEqual(mockElement.attributes.DataValue, "test");
		assert.strictEqual(mockElement.attributes.datavalue, "test2");
		assert.strictEqual(mockElement.attributes.DATAVALUE, "test3");
	});
});
