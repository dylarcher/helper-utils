import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { toggleClass } from "./toggleClass.js";

// Mock Element class for testing
class MockElement {
	constructor(initialClasses = []) {
		this.classList = new Set(initialClasses);
		this.classList.toggle = (className, force) => {
			// If force parameter is provided (not undefined)
			if (force !== undefined) {
				if (force) {
					// Any truthy value forces add
					this.classList.add(className);
					return true;
				} else {
					// Any falsy value forces remove
					this.classList.delete(className);
					return false;
				}
			}
			// Normal toggle behavior when force is undefined
			if (this.classList.has(className)) {
				this.classList.delete(className);
				return false;
			}
			this.classList.add(className);
			return true;
		};
	}

	get className() {
		return Array.from(this.classList).join(" ");
	}
}

describe("toggleClass(element, className, force)", () => {
	let mockElement;

	beforeEach(() => {
		mockElement = new MockElement(["existing-class", "active"]);
	});

	it("should toggle class on when not present", () => {
		toggleClass(mockElement, "new-class");

		assert.ok(mockElement.classList.has("new-class"));
		assert.ok(mockElement.classList.has("existing-class"));
		assert.ok(mockElement.classList.has("active"));
	});

	it("should toggle class off when present", () => {
		toggleClass(mockElement, "active");

		assert.ok(!mockElement.classList.has("active"));
		assert.ok(mockElement.classList.has("existing-class"));
	});

	it("should force add class when force is true", () => {
		// Class doesn't exist
		toggleClass(mockElement, "forced-class", true);
		assert.ok(mockElement.classList.has("forced-class"));

		// Class already exists - should remain
		toggleClass(mockElement, "forced-class", true);
		assert.ok(mockElement.classList.has("forced-class"));
	});

	it("should force remove class when force is false", () => {
		// Class exists
		toggleClass(mockElement, "active", false);
		assert.ok(!mockElement.classList.has("active"));

		// Class doesn't exist - should remain absent
		toggleClass(mockElement, "nonexistent", false);
		assert.ok(!mockElement.classList.has("nonexistent"));
	});

	it("should not throw error for null element", () => {
		assert.doesNotThrow(() => {
			toggleClass(null, "test-class");
		});
	});

	it("should not throw error for undefined element", () => {
		assert.doesNotThrow(() => {
			toggleClass(undefined, "test-class");
		});
	});

	it("should not throw error for element without classList", () => {
		const elementWithoutClassList = {};

		assert.doesNotThrow(() => {
			toggleClass(elementWithoutClassList, "test-class");
		});
	});

	it("should not throw error for element with null classList", () => {
		const elementWithNullClassList = { classList: null };

		assert.doesNotThrow(() => {
			toggleClass(elementWithNullClassList, "test-class");
		});
	});

	it("should not throw error for empty className", () => {
		assert.doesNotThrow(() => {
			toggleClass(mockElement, "");
		});
	});

	it("should not throw error for null className", () => {
		assert.doesNotThrow(() => {
			toggleClass(mockElement, null);
		});
	});

	it("should not throw error for undefined className", () => {
		assert.doesNotThrow(() => {
			toggleClass(mockElement, undefined);
		});
	});

	it("should handle classes with special characters", () => {
		const element = new MockElement(["class-with-dash"]);

		toggleClass(element, "class_with_underscore");
		assert.ok(element.classList.has("class_with_underscore"));

		toggleClass(element, "class-with-dash");
		assert.ok(!element.classList.has("class-with-dash"));

		toggleClass(element, "class123");
		assert.ok(element.classList.has("class123"));
	});

	it("should be case sensitive", () => {
		const element = new MockElement(["TestClass"]);

		toggleClass(element, "testclass");
		assert.ok(element.classList.has("TestClass"));
		assert.ok(element.classList.has("testclass"));

		toggleClass(element, "TestClass");
		assert.ok(!element.classList.has("TestClass"));
		assert.ok(element.classList.has("testclass"));
	});

	it("should handle multiple toggles correctly", () => {
		const element = new MockElement([]);

		// Add
		toggleClass(element, "test");
		assert.ok(element.classList.has("test"));

		// Remove
		toggleClass(element, "test");
		assert.ok(!element.classList.has("test"));

		// Add again
		toggleClass(element, "test");
		assert.ok(element.classList.has("test"));
	});

	it("should work with force parameter edge cases", () => {
		const element = new MockElement(["existing"]);

		// Force with truthy values
		toggleClass(element, "test1", 1);
		assert.ok(element.classList.has("test1"));

		toggleClass(element, "test2", "true");
		assert.ok(element.classList.has("test2"));

		// Force with falsy values (but not explicitly false)
		toggleClass(element, "test3", 0);
		assert.ok(!element.classList.has("test3"));

		toggleClass(element, "test4", "");
		assert.ok(!element.classList.has("test4"));
	});

	it("should handle element with broken classList.toggle method", () => {
		const brokenElement = {
			classList: {
				toggle: () => {
					throw new Error("Toggle method error");
				},
			},
		};

		// Should not throw error
		assert.doesNotThrow(() => {
			toggleClass(brokenElement, "test");
		});
	});

	it("should preserve other classes during toggle", () => {
		const element = new MockElement(["class1", "class2", "class3"]);

		toggleClass(element, "class2");

		assert.ok(element.classList.has("class1"));
		assert.ok(!element.classList.has("class2"));
		assert.ok(element.classList.has("class3"));
	});

	it("should handle DOM-like element with real classList behavior", () => {
		const domLikeElement = {
			classList: {
				classes: new Set(["btn"]),
				toggle: function (className, force) {
					if (force === true) {
						this.classes.add(className);
						return true;
					}
					if (force === false) {
						this.classes.delete(className);
						return false;
					}
					if (this.classes.has(className)) {
						this.classes.delete(className);
						return false;
					}
					this.classes.add(className);
					return true;
				},
				has: function (className) {
					return this.classes.has(className);
				},
			},
		};

		// Toggle on
		toggleClass(domLikeElement, "active");
		assert.ok(domLikeElement.classList.classes.has("active"));

		// Toggle off
		toggleClass(domLikeElement, "active");
		assert.ok(!domLikeElement.classList.classes.has("active"));

		// Force on
		toggleClass(domLikeElement, "forced", true);
		assert.ok(domLikeElement.classList.classes.has("forced"));
	});

	it("should handle undefined force parameter", () => {
		const element = new MockElement(["test"]);

		// Should behave as normal toggle
		toggleClass(element, "test", undefined);
		assert.ok(!element.classList.has("test"));

		toggleClass(element, "test", undefined);
		assert.ok(element.classList.has("test"));
	});
});
