import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { readFileAsync } from "./readFileAsync.js";

describe("readFileAsync(filePath, encoding)", () => {
	let testFile;
	let testContent;

	beforeEach(async () => {
		testFile = path.join(process.cwd(), "test-read-file.txt");
		testContent = "Hello, World!\nThis is a test file.\n日本語のテキスト";
		await fs.writeFile(testFile, testContent, "utf8");
	});

	afterEach(async () => {
		try {
			await fs.unlink(testFile);
		} catch {
			// File might not exist, ignore error
		}
	});

	it("should read file content with default UTF-8 encoding", async () => {
		const content = await readFileAsync(testFile);

		assert.strictEqual(
			content,
			testContent,
			"Should read file content correctly",
		);
		assert.strictEqual(
			typeof content,
			"string",
			"Should return string content",
		);
	});

	it("should read file content with explicit UTF-8 encoding", async () => {
		const content = await readFileAsync(testFile, "utf8");

		assert.strictEqual(
			content,
			testContent,
			"Should read file content with explicit encoding",
		);
	});

	it("should handle different encodings", async () => {
		const binaryFile = path.join(process.cwd(), "test-binary.txt");
		const binaryContent = Buffer.from("Hello, World!", "utf8");
		await fs.writeFile(binaryFile, binaryContent);

		try {
			// Read as buffer-like string
			const content = await readFileAsync(binaryFile, "latin1");
			assert.strictEqual(
				typeof content,
				"string",
				"Should return string for latin1 encoding",
			);

			// Read as base64
			const base64Content = await readFileAsync(binaryFile, "base64");
			assert.strictEqual(
				typeof base64Content,
				"string",
				"Should return string for base64 encoding",
			);
		} finally {
			await fs.unlink(binaryFile);
		}
	});

	it("should handle empty files", async () => {
		const emptyFile = path.join(process.cwd(), "empty-file.txt");
		await fs.writeFile(emptyFile, "");

		try {
			const content = await readFileAsync(emptyFile);
			assert.strictEqual(
				content,
				"",
				"Should return empty string for empty file",
			);
		} finally {
			await fs.unlink(emptyFile);
		}
	});

	it("should handle absolute paths", async () => {
		const absolutePath = path.resolve(testFile);
		const content = await readFileAsync(absolutePath);

		assert.strictEqual(content, testContent, "Should work with absolute paths");
	});

	it("should handle relative paths", async () => {
		const relativeFile = "./relative-test-file.txt";
		await fs.writeFile(relativeFile, "Relative file content");

		try {
			const content = await readFileAsync(relativeFile);
			assert.strictEqual(
				content,
				"Relative file content",
				"Should work with relative paths",
			);
		} finally {
			await fs.unlink(relativeFile);
		}
	});

	it("should be consistent with fs.readFile", async () => {
		const ourResult = await readFileAsync(testFile, "utf8");
		const fsResult = await fs.readFile(testFile, "utf8");

		assert.strictEqual(
			ourResult,
			fsResult,
			"Should return same result as fs.readFile",
		);
	});

	it("should reject for non-existent file", async () => {
		const nonExistentFile = path.join(process.cwd(), "non-existent-file.txt");

		await assert.rejects(async () => {
			await readFileAsync(nonExistentFile);
		}, "Should reject for non-existent file");
	});

	it("should reject when trying to read a directory", async () => {
		const testDir = path.join(process.cwd(), "test-directory");
		await fs.mkdir(testDir);

		try {
			await assert.rejects(async () => {
				await readFileAsync(testDir);
			}, "Should reject when trying to read a directory");
		} finally {
			await fs.rmdir(testDir);
		}
	});

	it("should handle unicode content", async () => {
		const unicodeFile = path.join(process.cwd(), "unicode-file.txt");
		const unicodeContent = "Unicode: 🌍 αβγδε 日本語 한국어 中文";
		await fs.writeFile(unicodeFile, unicodeContent, "utf8");

		try {
			const content = await readFileAsync(unicodeFile);
			assert.strictEqual(
				content,
				unicodeContent,
				"Should handle unicode content correctly",
			);
		} finally {
			await fs.unlink(unicodeFile);
		}
	});

	it("should handle large files", async () => {
		const largeFile = path.join(process.cwd(), "large-file.txt");
		const largeContent = "A".repeat(100000); // 100KB of 'A's
		await fs.writeFile(largeFile, largeContent);

		try {
			const content = await readFileAsync(largeFile);
			assert.strictEqual(
				content.length,
				100000,
				"Should read large file completely",
			);
			assert.strictEqual(
				content,
				largeContent,
				"Should read large file content correctly",
			);
		} finally {
			await fs.unlink(largeFile);
		}
	});

	it("should handle files with special characters in names", async () => {
		const specialFile = path.join(
			process.cwd(),
			"file with spaces & symbols!.txt",
		);
		const specialContent = "Content with special filename";
		await fs.writeFile(specialFile, specialContent);

		try {
			const content = await readFileAsync(specialFile);
			assert.strictEqual(
				content,
				specialContent,
				"Should handle special characters in filename",
			);
		} finally {
			await fs.unlink(specialFile);
		}
	});

	it("should handle newlines and special characters in content", async () => {
		const newlineFile = path.join(process.cwd(), "newline-file.txt");
		const newlineContent = "Line 1\nLine 2\r\nLine 3\tTabbed\0Null char";
		await fs.writeFile(newlineFile, newlineContent);

		try {
			const content = await readFileAsync(newlineFile);
			assert.strictEqual(
				content,
				newlineContent,
				"Should preserve newlines and special characters",
			);
		} finally {
			await fs.unlink(newlineFile);
		}
	});

	it("should handle JSON files", async () => {
		const jsonFile = path.join(process.cwd(), "test.json");
		const jsonContent = JSON.stringify(
			{ key: "value", number: 42, array: [1, 2, 3] },
			null,
			2,
		);
		await fs.writeFile(jsonFile, jsonContent);

		try {
			const content = await readFileAsync(jsonFile);
			assert.strictEqual(
				content,
				jsonContent,
				"Should read JSON files correctly",
			);

			// Verify it's valid JSON by parsing
			const parsed = JSON.parse(content);
			assert.strictEqual(parsed.key, "value", "Should be valid JSON content");
		} finally {
			await fs.unlink(jsonFile);
		}
	});

	it("should handle binary-like content with different encodings", async () => {
		const binaryFile = path.join(process.cwd(), "binary-file.bin");
		const binaryData = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0xff]);
		await fs.writeFile(binaryFile, binaryData);

		try {
			// Read with different encodings
			const hexContent = await readFileAsync(binaryFile, "hex");
			assert.strictEqual(
				typeof hexContent,
				"string",
				"Should return string for hex encoding",
			);

			const latin1Content = await readFileAsync(binaryFile, "latin1");
			assert.strictEqual(
				typeof latin1Content,
				"string",
				"Should return string for latin1 encoding",
			);
		} finally {
			await fs.unlink(binaryFile);
		}
	});
});
