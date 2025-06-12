import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as crypto from "node:crypto";
import { decrypt } from "./decrypt.js";

describe("decrypt(encryptedTextWithIv, key)", () => {
	const testKey = crypto.randomBytes(32); // 256-bit key for AES-256

	it("should decrypt text encrypted with AES-256-CBC", () => {
		const originalText = "Hello, World!";
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv("aes-256-cbc", testKey, iv);

		let encrypted = cipher.update(originalText, "utf8", "hex");
		encrypted += cipher.final("hex");
		const encryptedWithIv = `${iv.toString("hex")}:${encrypted}`;

		const decryptedText = decrypt(encryptedWithIv, testKey);
		assert.strictEqual(
			decryptedText,
			originalText,
			"Decrypted text should match original",
		);
	});

	it("should decrypt empty string", () => {
		const originalText = "";
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv("aes-256-cbc", testKey, iv);

		let encrypted = cipher.update(originalText, "utf8", "hex");
		encrypted += cipher.final("hex");
		const encryptedWithIv = `${iv.toString("hex")}:${encrypted}`;

		const decryptedText = decrypt(encryptedWithIv, testKey);
		assert.strictEqual(
			decryptedText,
			originalText,
			"Decrypted empty string should match",
		);
	});

	it("should decrypt unicode text", () => {
		const originalText = "Hello 🌍! Unicode: αβγδε";
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv("aes-256-cbc", testKey, iv);

		let encrypted = cipher.update(originalText, "utf8", "hex");
		encrypted += cipher.final("hex");
		const encryptedWithIv = `${iv.toString("hex")}:${encrypted}`;

		const decryptedText = decrypt(encryptedWithIv, testKey);
		assert.strictEqual(
			decryptedText,
			originalText,
			"Decrypted unicode text should match original",
		);
	});

	it("should throw error for invalid format (no colon)", () => {
		const invalidFormat = "invalidencryptedtext";

		assert.throws(
			() => {
				decrypt(invalidFormat, testKey);
			},
			{
				message: "Invalid encrypted text format. Expected ivHex:encryptedHex",
			},
		);
	});

	it("should throw error for invalid format (empty IV)", () => {
		const invalidFormat = ":encryptedtext";

		assert.throws(
			() => {
				decrypt(invalidFormat, testKey);
			},
			{
				message: "Invalid encrypted text format. Expected ivHex:encryptedHex",
			},
		);
	});

	it("should throw error for invalid format (empty encrypted text)", () => {
		const invalidFormat = "1234567890abcdef1234567890abcdef:";

		assert.throws(
			() => {
				decrypt(invalidFormat, testKey);
			},
			{
				message: "Invalid encrypted text format. Expected ivHex:encryptedHex",
			},
		);
	});

	it("should throw error for invalid hex in IV", () => {
		const invalidIv = "invalidhex:1234567890abcdef";

		assert.throws(() => {
			decrypt(invalidIv, testKey);
		});
	});

	it("should throw error with wrong key", () => {
		const originalText = "Hello, World!";
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv("aes-256-cbc", testKey, iv);

		let encrypted = cipher.update(originalText, "utf8", "hex");
		encrypted += cipher.final("hex");
		const encryptedWithIv = `${iv.toString("hex")}:${encrypted}`;

		const wrongKey = crypto.randomBytes(32);

		assert.throws(() => {
			decrypt(encryptedWithIv, wrongKey);
		});
	});
});
