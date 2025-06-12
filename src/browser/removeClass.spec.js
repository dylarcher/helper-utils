import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { removeClass } from "src/browser/removeClass.js";

// Mock Element class for testing
class MockElement {
	constructor(initialClasses = []) {
		this.classList = new Set(initialClasses);
		this.classList.remove = (...classNames) => {
			classNames.forEach((className) => {
				if (className) {
					this.classList.delete(className);
				}
			});
		};
	}

	get className() {
		return Array.from(this.classList).join(" ");
	}
}

describe("removeClass(element, ...classNames)", () => {
	let mockElement;

	beforeEach(() => {
		mockElement = new MockElement(["class1", "class2", "active", "visible"]);
	});

	it("should remove a single class from element", () => {
		removeClass(mockElement, "class1");

		assert.ok(!mockElement.classList.has("class1"));
		assert.ok(mockElement.classList.has("class2"));
		assert.ok(mockElement.classList.has("active"));
	});

	it("should remove multiple classes from element", () => {
		removeClass(mockElement, "class1", "active");

		assert.ok(!mockElement.classList.has("class1"));
		assert.ok(!mockElement.classList.has("active"));
		assert.ok(mockElement.classList.has("class2"));
		assert.ok(mockElement.classList.has("visible"));
	});

	it("should not throw error when removing non-existent class", () => {
		assert.doesNotThrow(() => {
			removeClass(mockElement, "nonexistent");
		});

		// Original classes should remain
		assert.ok(mockElement.classList.has("class1"));
		assert.ok(mockElement.classList.has("class2"));
	});

	it("should filter out falsy class names", () => {
		const originalSize = mockElement.classList.size;

		removeClass(mockElement, "class1", null, "class2", undefined, "", false, 0);

		assert.ok(!mockElement.classList.has("class1"));
		assert.ok(!mockElement.classList.has("class2"));
		assert.ok(mockElement.classList.has("active"));
		assert.ok(mockElement.classList.has("visible"));
	});

	it("should handle empty class name gracefully", () => {
		const originalClasses = Array.from(mockElement.classList);

		removeClass(mockElement, "");

		// All classes should remain unchanged
		originalClasses.forEach((className) => {
			assert.ok(mockElement.classList.has(className));
		});
	});

	it("should not throw error for null element", () => {
		assert.doesNotThrow(() => {
			removeClass(null, "class1");
		});
	});

	it("should not throw error for undefined element", () => {
		assert.doesNotThrow(() => {
			removeClass(undefined, "class1");
		});
	});

	it("should not throw error for element without classList", () => {
		const elementWithoutClassList = {};

		assert.doesNotThrow(() => {
			removeClass(elementWithoutClassList, "class1");
		});
	});

	it("should handle element with null classList", () => {
		const elementWithNullClassList = { classList: null };

		assert.doesNotThrow(() => {
			removeClass(elementWithNullClassList, "class1");
		});
	});

	it("should remove all specified classes even if some don't exist", () => {
		removeClass(
			mockElement,
			"class1",
			"nonexistent",
			"active",
			"another-missing",
		);

		assert.ok(!mockElement.classList.has("class1"));
		assert.ok(!mockElement.classList.has("active"));
		assert.ok(mockElement.classList.has("class2"));
		assert.ok(mockElement.classList.has("visible"));
	});

	it("should handle duplicate class names in parameter list", () => {
		removeClass(mockElement, "class1", "class1", "class1");

		assert.ok(!mockElement.classList.has("class1"));
		assert.ok(mockElement.classList.has("class2"));
	});

	it("should work with classes containing special characters", () => {
		const specialElement = new MockElement([
			"class-with-dash",
			"class_with_underscore",
			"class123",
		]);

		removeClass(specialElement, "class-with-dash", "class123");

		assert.ok(!specialElement.classList.has("class-with-dash"));
		assert.ok(!specialElement.classList.has("class123"));
		assert.ok(specialElement.classList.has("class_with_underscore"));
	});

	it("should preserve other classes when removing specific ones", () => {
		const element = new MockElement([
			"nav",
			"nav-item",
			"nav-item-active",
			"visible",
		]);

		removeClass(element, "nav-item-active");

		assert.ok(!element.classList.has("nav-item-active"));
		assert.ok(element.classList.has("nav"));
		assert.ok(element.classList.has("nav-item"));
		assert.ok(element.classList.has("visible"));
	});

	it("should handle removing all classes", () => {
		const allClasses = Array.from(mockElement.classList);
		removeClass(mockElement, ...allClasses);

		assert.strictEqual(mockElement.classList.size, 0);
		assert.strictEqual(mockElement.className, "");
	});

	it("should be case sensitive", () => {
		const element = new MockElement(["TestClass", "testclass"]);

		removeClass(element, "TestClass");

		assert.ok(!element.classList.has("TestClass"));
		assert.ok(element.classList.has("testclass"));
	});

	it("should work with classList.remove method variations", () => {
		// Test with element that has different classList implementation
		const customElement = {
			classList: {
				classes: new Set(["a", "b", "c"]),
				remove: function (...classNames) {
					const filtered = classNames.filter(Boolean);
					filtered.forEach((name) => this.classes.delete(name));
				},
			},
		};

		removeClass(customElement, "a", null, "c", undefined);

		assert.ok(!customElement.classList.classes.has("a"));
		assert.ok(!customElement.classList.classes.has("c"));
		assert.ok(customElement.classList.classes.has("b"));
	});
});
