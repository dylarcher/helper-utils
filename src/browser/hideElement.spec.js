import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { hideElement } from "./hideElement.js";

// Mock Element class for testing
class MockElement {
	constructor() {
		this.style = {
			properties: {},
			setProperty: (property, value) => {
				this.style.properties[property] = value;
			},
		};
	}
}

describe("hideElement(element)", () => {
	let mockElement;

	beforeEach(() => {
		mockElement = new MockElement();
	});

	it("should set display to none on valid element", () => {
		hideElement(mockElement);

		assert.strictEqual(mockElement.style.properties.display, "none");
	});

	it("should not throw error for null element", () => {
		assert.doesNotThrow(() => {
			hideElement(null);
		});
	});

	it("should not throw error for undefined element", () => {
		assert.doesNotThrow(() => {
			hideElement(undefined);
		});
	});

	it("should not throw error for element without style property", () => {
		const elementWithoutStyle = {};

		assert.doesNotThrow(() => {
			hideElement(elementWithoutStyle);
		});
	});

	it("should not throw error for element with null style", () => {
		const elementWithNullStyle = { style: null };

		assert.doesNotThrow(() => {
			hideElement(elementWithNullStyle);
		});
	});

	it("should work with real DOM-like element", () => {
		const domLikeElement = {
			style: {
				setProperty: function (property, value) {
					this[property] = value;
				},
			},
		};

		hideElement(domLikeElement);
		assert.strictEqual(domLikeElement.style.display, "none");
	});

	it("should handle element with style but no setProperty method", () => {
		const brokenElement = {
			style: {},
		};

		assert.doesNotThrow(() => {
			hideElement(brokenElement);
		});
	});

	it("should override existing display property", () => {
		mockElement.style.properties.display = "block";

		hideElement(mockElement);
		assert.strictEqual(mockElement.style.properties.display, "none");
	});

	it("should work multiple times on same element", () => {
		hideElement(mockElement);
		hideElement(mockElement);
		hideElement(mockElement);

		assert.strictEqual(mockElement.style.properties.display, "none");
	});

	it("should handle style.setProperty throwing an error", () => {
		const element = {
			style: {
				setProperty: () => {
					throw new Error("Simulated error");
				},
			},
		};

		// Should not throw
		assert.doesNotThrow(() => {
			hideElement(element);
		});
	});
});
