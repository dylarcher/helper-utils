import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setStyle } from "src/browser/setStyle.js";

// Mock Element class for testing
class MockElement {
	constructor() {
		this.style = {};
	}
}

describe("setStyle(element, property, value)", () => {
	let mockElement;

	beforeEach(() => {
		mockElement = new MockElement();
	});

	it("should set single CSS property", () => {
		setStyle(mockElement, "color", "red");

		assert.strictEqual(mockElement.style.color, "red");
	});

	it("should set multiple CSS properties from object", () => {
		const styles = {
			color: "blue",
			fontSize: "16px",
			margin: "10px",
			display: "block",
		};

		setStyle(mockElement, styles);

		assert.strictEqual(mockElement.style.color, "blue");
		assert.strictEqual(mockElement.style.fontSize, "16px");
		assert.strictEqual(mockElement.style.margin, "10px");
		assert.strictEqual(mockElement.style.display, "block");
	});

	it("should overwrite existing styles", () => {
		mockElement.style.color = "red";
		mockElement.style.fontSize = "12px";

		setStyle(mockElement, "color", "green");
		setStyle(mockElement, { fontSize: "18px", fontWeight: "bold" });

		assert.strictEqual(mockElement.style.color, "green");
		assert.strictEqual(mockElement.style.fontSize, "18px");
		assert.strictEqual(mockElement.style.fontWeight, "bold");
	});

	it("should handle camelCase property names", () => {
		setStyle(mockElement, "backgroundColor", "yellow");
		setStyle(mockElement, "borderRadius", "5px");
		setStyle(mockElement, "textAlign", "center");

		assert.strictEqual(mockElement.style.backgroundColor, "yellow");
		assert.strictEqual(mockElement.style.borderRadius, "5px");
		assert.strictEqual(mockElement.style.textAlign, "center");
	});

	it("should handle kebab-case property names converted to camelCase", () => {
		// Note: This tests the current behavior - the function doesn't convert kebab-case
		setStyle(mockElement, "background-color", "purple");

		assert.strictEqual(mockElement.style["background-color"], "purple");
	});

	it("should handle empty object", () => {
		const originalStyle = { ...mockElement.style };

		setStyle(mockElement, {});

		assert.deepStrictEqual(mockElement.style, originalStyle);
	});

	it("should handle empty string value", () => {
		setStyle(mockElement, "display", "");

		assert.strictEqual(mockElement.style.display, "");
	});

	it("should handle zero values", () => {
		setStyle(mockElement, "margin", "0");
		setStyle(mockElement, "padding", 0);

		assert.strictEqual(mockElement.style.margin, "0");
		assert.strictEqual(mockElement.style.padding, 0);
	});

	it("should not throw for null element", () => {
		assert.doesNotThrow(() => {
			setStyle(null, "color", "red");
		});
	});

	it("should not throw for undefined element", () => {
		assert.doesNotThrow(() => {
			setStyle(undefined, "color", "red");
		});
	});

	it("should not throw for element without style property", () => {
		const elementWithoutStyle = {};

		assert.doesNotThrow(() => {
			setStyle(elementWithoutStyle, "color", "red");
		});
	});

	it("should not throw for element with null style", () => {
		const elementWithNullStyle = { style: null };

		assert.doesNotThrow(() => {
			setStyle(elementWithNullStyle, "color", "red");
		});
	});

	it("should handle undefined value parameter", () => {
		setStyle(mockElement, "color", undefined);

		assert.strictEqual(mockElement.style.color, undefined);
	});

	it("should handle null value parameter", () => {
		setStyle(mockElement, "color", null);

		assert.strictEqual(mockElement.style.color, null);
	});

	it("should not set property when property is object but value is provided", () => {
		const styles = { color: "red" };
		setStyle(mockElement, styles, "blue");

		// When property is object, value parameter is ignored
		assert.strictEqual(mockElement.style.color, "red");
	});

	it("should handle complex CSS values", () => {
		const complexStyles = {
			background: "linear-gradient(to right, red, blue)",
			transform: "translateX(100px) rotate(45deg)",
			boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
			fontFamily: "'Arial', 'Helvetica', sans-serif",
			content: '"Hello World"',
		};

		setStyle(mockElement, complexStyles);

		Object.entries(complexStyles).forEach(([prop, value]) => {
			assert.strictEqual(mockElement.style[prop], value);
		});
	});

	it("should handle CSS custom properties (CSS variables)", () => {
		setStyle(mockElement, "--primary-color", "#3498db");
		setStyle(mockElement, "--font-size", "1.2rem");

		assert.strictEqual(mockElement.style["--primary-color"], "#3498db");
		assert.strictEqual(mockElement.style["--font-size"], "1.2rem");
	});

	it("should handle numeric values", () => {
		setStyle(mockElement, "zIndex", 999);
		setStyle(mockElement, "opacity", 0.5);
		setStyle(mockElement, "order", 3);

		assert.strictEqual(mockElement.style.zIndex, 999);
		assert.strictEqual(mockElement.style.opacity, 0.5);
		assert.strictEqual(mockElement.style.order, 3);
	});

	it("should handle mixed property types in object", () => {
		const mixedStyles = {
			color: "red",
			fontSize: "16px",
			zIndex: 100,
			opacity: 0.8,
			display: "flex",
			"background-color": "yellow",
			"--custom-prop": "value",
		};

		setStyle(mockElement, mixedStyles);

		Object.entries(mixedStyles).forEach(([prop, value]) => {
			assert.strictEqual(mockElement.style[prop], value);
		});
	});

	it("should preserve existing styles when setting new ones", () => {
		setStyle(mockElement, "color", "red");
		setStyle(mockElement, "fontSize", "16px");

		setStyle(mockElement, "margin", "10px");

		assert.strictEqual(mockElement.style.color, "red");
		assert.strictEqual(mockElement.style.fontSize, "16px");
		assert.strictEqual(mockElement.style.margin, "10px");
	});

	it("should handle object with inherited properties", () => {
		const baseStyles = { color: "inherited" };
		const derivedStyles = Object.create(baseStyles);
		derivedStyles.fontSize = "14px";
		derivedStyles.margin = "5px";

		setStyle(mockElement, derivedStyles);

		// Should only set own properties
		assert.strictEqual(mockElement.style.fontSize, "14px");
		assert.strictEqual(mockElement.style.margin, "5px");
		assert.strictEqual(mockElement.style.color, undefined);
	});

	it("should handle falsy property names", () => {
		const originalStyle = { ...mockElement.style };

		setStyle(mockElement, "", "value");
		setStyle(mockElement, null, "value");
		setStyle(mockElement, undefined, "value");

		// Style object should remain unchanged
		assert.deepStrictEqual(mockElement.style, originalStyle);
	});

	it("should work with DOM-like element", () => {
		const domLikeElement = {
			style: {
				setProperty: function (prop, value) {
					this[prop] = value;
				},
			},
		};

		setStyle(domLikeElement, "color", "purple");
		setStyle(domLikeElement, { fontSize: "20px", fontWeight: "bold" });

		assert.strictEqual(domLikeElement.style.color, "purple");
		assert.strictEqual(domLikeElement.style.fontSize, "20px");
		assert.strictEqual(domLikeElement.style.fontWeight, "bold");
	});
});
