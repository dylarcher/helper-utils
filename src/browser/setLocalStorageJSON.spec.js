import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { setLocalStorageJSON } from "src/browser/setLocalStorageJSON.js";

describe("setLocalStorageJSON(key, value)", () => {
	let originalLocalStorage;
	let mockStorage;
	let consoleErrors;

	beforeEach(() => {
		originalLocalStorage = global.localStorage;
		consoleErrors = [];

		// Mock console.error to capture error messages
		const originalConsoleError = console.error;
		console.error = (...args) => {
			consoleErrors.push(args);
		};

		// Restore console.error after each test
		global.restoreConsoleError = () => {
			console.error = originalConsoleError;
		};

		// Create mock localStorage
		mockStorage = new Map();
		global.localStorage = {
			setItem: (key, value) => mockStorage.set(key, value),
			getItem: (key) => mockStorage.get(key) || null,
			removeItem: (key) => mockStorage.delete(key),
			clear: () => mockStorage.clear(),
		};
	});

	it("should stringify and store simple object", () => {
		const testData = { name: "John", age: 30 };
		const result = setLocalStorageJSON("user", testData);

		assert.strictEqual(result, true);
		assert.strictEqual(mockStorage.get("user"), JSON.stringify(testData));
	});

	it("should stringify and store array", () => {
		const testData = ["apple", "banana", "cherry"];
		const result = setLocalStorageJSON("fruits", testData);

		assert.strictEqual(result, true);
		assert.strictEqual(mockStorage.get("fruits"), JSON.stringify(testData));
	});

	it("should stringify and store primitive values", () => {
		assert.strictEqual(setLocalStorageJSON("number", 42), true);
		assert.strictEqual(setLocalStorageJSON("string", "hello"), true);
		assert.strictEqual(setLocalStorageJSON("boolean", true), true);
		assert.strictEqual(setLocalStorageJSON("null", null), true);

		assert.strictEqual(mockStorage.get("number"), "42");
		assert.strictEqual(mockStorage.get("string"), '"hello"');
		assert.strictEqual(mockStorage.get("boolean"), "true");
		assert.strictEqual(mockStorage.get("null"), "null");
	});

	it("should handle complex nested objects", () => {
		const complexData = {
			user: {
				profile: {
					name: "Alice",
					preferences: {
						theme: "dark",
						notifications: true,
						languages: ["en", "es", "fr"],
					},
				},
				metadata: {
					created: "2023-01-01",
					lastLogin: null,
				},
			},
			settings: [
				{ key: "autoSave", value: true },
				{ key: "timeout", value: 300 },
			],
		};

		const result = setLocalStorageJSON("complexData", complexData);

		assert.strictEqual(result, true);

		// Verify it can be parsed back correctly
		const stored = mockStorage.get("complexData");
		const parsed = JSON.parse(stored);
		assert.deepStrictEqual(parsed, complexData);
	});

	it("should handle special characters in values", () => {
		const specialData = {
			message: "Hello\nWorld\t🌟",
			emoji: "😀🎉🚀",
			unicode: "café naïve résumé",
		};

		const result = setLocalStorageJSON("specialChars", specialData);

		assert.strictEqual(result, true);

		const stored = mockStorage.get("specialChars");
		const parsed = JSON.parse(stored);
		assert.deepStrictEqual(parsed, specialData);
	});

	it("should overwrite existing values", () => {
		const firstData = { version: 1 };
		const secondData = { version: 2 };

		setLocalStorageJSON("data", firstData);
		assert.strictEqual(mockStorage.get("data"), JSON.stringify(firstData));

		setLocalStorageJSON("data", secondData);
		assert.strictEqual(mockStorage.get("data"), JSON.stringify(secondData));
	});

	it("should return false and log error when localStorage.setItem throws", () => {
		global.localStorage.setItem = () => {
			throw new Error("localStorage not available");
		};

		const result = setLocalStorageJSON("test", { data: "value" });

		assert.strictEqual(result, false);
		assert.strictEqual(consoleErrors.length, 1);
		assert.ok(
			consoleErrors[0][0].includes(
				"Error setting JSON in localStorage for key \"test\"",
			),
		);
	});

	it("should return false and log error when JSON.stringify throws", () => {
		// Create an object that can't be stringified (circular reference)
		const circularObj = {};
		circularObj.self = circularObj;

		const result = setLocalStorageJSON("circular", circularObj);

		assert.strictEqual(result, false);
		assert.strictEqual(consoleErrors.length, 1);
		assert.ok(
			consoleErrors[0][0].includes(
				"Error setting JSON in localStorage for key \"circular\"",
			),
		);
	});

	it("should handle undefined values", () => {
		const result = setLocalStorageJSON("undefined", undefined);

		assert.strictEqual(result, true);
		assert.strictEqual(mockStorage.get("undefined"), "null"); // JSON.stringify(undefined) becomes "null"
	});

	it("should handle function values", () => {
		const result = setLocalStorageJSON("function", () => "test");

		assert.strictEqual(result, true);
		assert.strictEqual(mockStorage.get("function"), "null"); // Functions become null in JSON
	});

	it("should handle objects with toJSON method", () => {
		const objWithToJSON = {
			value: "original",
			toJSON: function () {
				return { value: "serialized" };
			},
		};

		const result = setLocalStorageJSON("customSerialization", objWithToJSON);

		assert.strictEqual(result, true);

		const stored = mockStorage.get("customSerialization");
		const parsed = JSON.parse(stored);
		assert.deepStrictEqual(parsed, { value: "serialized" });
	});

	it("should handle Date objects", () => {
		const dateObj = new Date("2023-01-01T12:00:00Z");

		const result = setLocalStorageJSON("date", dateObj);

		assert.strictEqual(result, true);
		assert.strictEqual(mockStorage.get("date"), `"${dateObj.toISOString()}"`);
	});

	it("should handle empty objects and arrays", () => {
		assert.strictEqual(setLocalStorageJSON("emptyObj", {}), true);
		assert.strictEqual(setLocalStorageJSON("emptyArr", []), true);

		assert.strictEqual(mockStorage.get("emptyObj"), "{}");
		assert.strictEqual(mockStorage.get("emptyArr"), "[]");
	});

	it("should handle very large objects", () => {
		const largeObj = {};
		for (let i = 0; i < 1000; i++) {
			largeObj[`key${i}`] = `value${i}`;
		}

		const result = setLocalStorageJSON("large", largeObj);

		assert.strictEqual(result, true);

		const stored = mockStorage.get("large");
		const parsed = JSON.parse(stored);
		assert.deepStrictEqual(parsed, largeObj);
	});

	it("should handle objects with symbol properties (ignored)", () => {
		const symbolKey = Symbol("test");
		const objWithSymbol = {
			normalProp: "value",
			[symbolKey]: "symbol value",
		};

		const result = setLocalStorageJSON("withSymbol", objWithSymbol);

		assert.strictEqual(result, true);

		const stored = mockStorage.get("withSymbol");
		const parsed = JSON.parse(stored);
		assert.deepStrictEqual(parsed, { normalProp: "value" }); // Symbol property ignored
	});

	// Cleanup after each test
	beforeEach(() => {
		global.localStorage = originalLocalStorage;
		global.restoreConsoleError();
	});
});
