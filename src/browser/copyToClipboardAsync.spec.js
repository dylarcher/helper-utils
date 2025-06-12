import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { copyToClipboardAsync } from "src/browser/copyToClipboardAsync.js";

describe("copyToClipboardAsync(text)", () => {
	let originalNavigator;

	beforeEach(() => {
		// Save the original navigator
		originalNavigator = global.navigator;
	});

	it("should copy text to clipboard successfully", async () => {
		// Mock navigator.clipboard
		global.navigator = {
			clipboard: {
				writeText: async (text) => {
					// Simulate successful clipboard write
					return Promise.resolve();
				},
			},
		};

		await assert.doesNotReject(() => copyToClipboardAsync("test text"));
	});

	it("should reject if navigator.clipboard is not available", async () => {
		// Mock navigator without clipboard
		global.navigator = {};

		await assert.rejects(() => copyToClipboardAsync("test text"), {
			name: "Error",
			message:
				"Clipboard API not available. Use a fallback or ensure secure context (HTTPS).",
		});
	});

	it("should reject if clipboard.writeText fails", async () => {
		const testError = new Error("Clipboard write failed");

		// Mock navigator.clipboard with failing writeText
		global.navigator = {
			clipboard: {
				writeText: async () => {
					throw testError;
				},
			},
		};

		await assert.rejects(() => copyToClipboardAsync("test text"), testError);
	});

	it("should handle empty string", async () => {
		global.navigator = {
			clipboard: {
				writeText: async (text) => {
					assert.strictEqual(text, "");
					return Promise.resolve();
				},
			},
		};

		await assert.doesNotReject(() => copyToClipboardAsync(""));
	});

	it("should handle special characters", async () => {
		const specialText = "Hello\nWorld\t🌟";

		global.navigator = {
			clipboard: {
				writeText: async (text) => {
					assert.strictEqual(text, specialText);
					return Promise.resolve();
				},
			},
		};

		await assert.doesNotReject(() => copyToClipboardAsync(specialText));
	});

	// Cleanup after each test
	beforeEach(() => {
		global.navigator = originalNavigator;
	});
});
