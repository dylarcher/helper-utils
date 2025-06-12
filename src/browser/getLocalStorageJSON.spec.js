import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getLocalStorageJSON } from "src/browser/getLocalStorageJSON.js";

describe("getLocalStorageJSON(key)", () => {
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
			getItem: (key) => mockStorage.get(key) || null,
			setItem: (key, value) => mockStorage.set(key, value),
			removeItem: (key) => mockStorage.delete(key),
			clear: () => mockStorage.clear(),
		};
	});

	it("should parse and return valid JSON object", () => {
		const testData = { name: "John", age: 30, active: true };
		mockStorage.set("testKey", JSON.stringify(testData));

		const result = getLocalStorageJSON("testKey");
		assert.deepStrictEqual(result, testData);
	});

	it("should parse and return valid JSON array", () => {
		const testData = ["apple", "banana", "cherry"];
		mockStorage.set("fruits", JSON.stringify(testData));

		const result = getLocalStorageJSON("fruits");
		assert.deepStrictEqual(result, testData);
	});

	it("should parse and return valid JSON primitive", () => {
		mockStorage.set("number", JSON.stringify(42));
		mockStorage.set("string", JSON.stringify("hello"));
		mockStorage.set("boolean", JSON.stringify(true));
		mockStorage.set("null", JSON.stringify(null));

		assert.strictEqual(getLocalStorageJSON("number"), 42);
		assert.strictEqual(getLocalStorageJSON("string"), "hello");
		assert.strictEqual(getLocalStorageJSON("boolean"), true);
		assert.strictEqual(getLocalStorageJSON("null"), null);
	});

	it("should return null for non-existent key", () => {
		const result = getLocalStorageJSON("nonExistentKey");
		assert.strictEqual(result, null);
	});

	it("should return null for empty string value", () => {
		mockStorage.set("emptyKey", "");

		const result = getLocalStorageJSON("emptyKey");
		assert.strictEqual(result, null);
	});

	it("should return null and log error for invalid JSON", () => {
		mockStorage.set("invalidJSON", "{ invalid json }");

		const result = getLocalStorageJSON("invalidJSON");

		assert.strictEqual(result, null);
		assert.strictEqual(consoleErrors.length, 1);
		assert.ok(
			consoleErrors[0][0].includes(
				"Error getting JSON from localStorage for key \"invalidJSON\"",
			),
		);
	});

	it("should handle localStorage getItem throwing error", () => {
		global.localStorage.getItem = () => {
			throw new Error("localStorage not available");
		};

		const result = getLocalStorageJSON("anyKey");

		assert.strictEqual(result, null);
		assert.strictEqual(consoleErrors.length, 1);
		assert.ok(
			consoleErrors[0][0].includes(
				"Error getting JSON from localStorage for key \"anyKey\"",
			),
		);
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

		mockStorage.set("complexData", JSON.stringify(complexData));

		const result = getLocalStorageJSON("complexData");
		assert.deepStrictEqual(result, complexData);
	});

	it("should handle special characters in values", () => {
		const specialData = {
			message: "Hello\nWorld\t🌟",
			emoji: "😀🎉🚀",
			unicode: "café naïve résumé",
		};

		mockStorage.set("specialChars", JSON.stringify(specialData));

		const result = getLocalStorageJSON("specialChars");
		assert.deepStrictEqual(result, specialData);
	});

	it("should handle JSON with escaped characters", () => {
		const dataWithEscapes = {
			quote: 'He said "Hello"',
			backslash: "C:\\Users\\John",
			newline: "Line 1\nLine 2",
		};

		mockStorage.set("escapedData", JSON.stringify(dataWithEscapes));

		const result = getLocalStorageJSON("escapedData");
		assert.deepStrictEqual(result, dataWithEscapes);
	});

	// Cleanup after each test
	beforeEach(() => {
		global.localStorage = originalLocalStorage;
		global.restoreConsoleError();
	});
});
