import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "./createElement.js";
import { setupBrowserMocks, restoreGlobals } from "../../utils/test.utils.js";

// Mock Element class for testing
class MockElement {
	constructor(tagName, className = "", id = "") {
		this.tagName = tagName.toLowerCase();
		this.className = className;
		this.id = id;
		this.textContent = "";
	}
}

describe("createElement(tagName, attributes, children)", () => {
	beforeEach(() => {
		setupBrowserMocks();
	});

	afterEach(() => {
		restoreGlobals();
	});

	it("should create an element with specified tag name", () => {
		const element = createElement("div");
		assert.strictEqual(element.tagName, "div");
	});

	it("should create an element with attributes", () => {
		const attributes = {
			id: "test-id",
			class: "test-class",
			"data-value": "123",
		};

		const element = createElement("div", attributes);
		assert.strictEqual(element.attributes.id, "test-id");
		assert.strictEqual(element.attributes.class, "test-class");
		assert.strictEqual(element.attributes["data-value"], "123");
	});

	it("should create an element with string child", () => {
		const element = createElement("p", {}, "Hello World");
		assert.strictEqual(element.childNodes.length, 1);
		assert.strictEqual(element.childNodes[0].textContent, "Hello World");
	});

	it("should create an element with Node child", () => {
		const childElement = new MockElement("span");
		const element = createElement("div", {}, childElement);

		assert.strictEqual(element.childNodes.length, 1);
		assert.strictEqual(element.childNodes[0], childElement);
	});

	it("should create an element with array of children", () => {
		const childElement = new MockElement("span");
		const children = ["Hello ", childElement, " World"];

		const element = createElement("div", {}, children);
		assert.strictEqual(element.childNodes.length, 3);
		assert.strictEqual(element.childNodes[0].textContent, "Hello ");
		assert.strictEqual(element.childNodes[1], childElement);
		assert.strictEqual(element.childNodes[2].textContent, " World");
	});

	it("should handle empty attributes object", () => {
		const element = createElement("div", {});
		assert.deepStrictEqual(element.attributes, {});
	});

	it("should handle undefined attributes", () => {
		const element = createElement("div");
		assert.ok(element.attributes !== undefined);
	});

	it("should handle empty children array", () => {
		const element = createElement("div", {}, []);
		assert.strictEqual(element.childNodes.length, 0);
	});

	it("should handle mixed children types in array", () => {
		const spanElement = new MockElement("span");
		const children = ["Text 1", spanElement, "Text 2"];

		const element = createElement("div", {}, children);
		assert.strictEqual(element.childNodes.length, 3);
		assert.strictEqual(element.childNodes[0].textContent, "Text 1");
		assert.strictEqual(element.childNodes[1], spanElement);
		assert.strictEqual(element.childNodes[2].textContent, "Text 2");
	});

	it("should only set own properties from attributes object", () => {
		const attributes = Object.create({ inheritedProp: "inherited" });
		attributes.ownProp = "own";

		const element = createElement("div", attributes);
		assert.strictEqual(element.attributes.ownProp, "own");
		assert.strictEqual(element.attributes.inheritedProp, undefined);
	});
});
