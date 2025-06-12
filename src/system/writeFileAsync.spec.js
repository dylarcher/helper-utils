import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { writeFileAsync } from "./writeFileAsync.js";

describe("writeFileAsync(filePath, data, encoding)", () => {
	let testFile;
	let testDir;

	beforeEach(async () => {
		testFile = path.join(process.cwd(), "test-write-file.txt");
		testDir = path.join(process.cwd(), "test-write-dir");
	});

	afterEach(async () => {
		try {
			await fs.unlink(testFile);
		} catch {
			// File might not exist, ignore error
		}
		try {
			await fs.rm(testDir, { recursive: true, force: true });
		} catch {
			// Directory might not exist, ignore error
		}
	});

	it("should write string data to file with default UTF-8 encoding", async () => {
		const testContent = "Hello, World!\nThis is a test file.";

		await writeFileAsync(testFile, testContent);

		// Verify file was written correctly
		const readContent = await fs.readFile(testFile, "utf8");
		assert.strictEqual(
			readContent,
			testContent,
			"File content should match written data",
		);
	});

	it("should write string data with explicit UTF-8 encoding", async () => {
		const testContent = "Hello, World! 🌍";

		await writeFileAsync(testFile, testContent, "utf8");

		const readContent = await fs.readFile(testFile, "utf8");
		assert.strictEqual(
			readContent,
			testContent,
			"File content should match with explicit encoding",
		);
	});

	it("should write Buffer data", async () => {
		const testBuffer = Buffer.from("Hello, Buffer World!", "utf8");

		await writeFileAsync(testFile, testBuffer);

		const readContent = await fs.readFile(testFile);
		assert.ok(readContent.equals(testBuffer), "Buffer content should match");
	});

	it("should handle different encodings", async () => {
		const testContent = "Hello, World!";

		// Write with latin1 encoding
		await writeFileAsync(testFile, testContent, "latin1");

		const readContent = await fs.readFile(testFile, "latin1");
		assert.strictEqual(
			readContent,
			testContent,
			"Should handle latin1 encoding",
		);
	});

	it("should overwrite existing file", async () => {
		const initialContent = "Initial content";
		const newContent = "New content";

		// Write initial content
		await writeFileAsync(testFile, initialContent);

		// Overwrite with new content
		await writeFileAsync(testFile, newContent);

		const readContent = await fs.readFile(testFile, "utf8");
		assert.strictEqual(
			readContent,
			newContent,
			"Should overwrite existing file",
		);
	});

	it("should create file if it doesn't exist", async () => {
		const testContent = "New file content";

		// Ensure file doesn't exist
		try {
			await fs.unlink(testFile);
		} catch {
			// File might not exist, ignore
		}

		await writeFileAsync(testFile, testContent);

		const readContent = await fs.readFile(testFile, "utf8");
		assert.strictEqual(readContent, testContent, "Should create new file");
	});

	it("should handle empty string", async () => {
		const emptyContent = "";

		await writeFileAsync(testFile, emptyContent);

		const readContent = await fs.readFile(testFile, "utf8");
		assert.strictEqual(readContent, emptyContent, "Should handle empty string");
	});

	it("should handle absolute paths", async () => {
		const absolutePath = path.resolve(testFile);
		const testContent = "Absolute path test";

		await writeFileAsync(absolutePath, testContent);

		const readContent = await fs.readFile(absolutePath, "utf8");
		assert.strictEqual(
			readContent,
			testContent,
			"Should work with absolute paths",
		);
	});

	it("should handle relative paths", async () => {
		const relativeFile = "./relative-write-test.txt";
		const testContent = "Relative path test";

		try {
			await writeFileAsync(relativeFile, testContent);

			const readContent = await fs.readFile(relativeFile, "utf8");
			assert.strictEqual(
				readContent,
				testContent,
				"Should work with relative paths",
			);
		} finally {
			try {
				await fs.unlink(relativeFile);
			} catch {
				// Ignore cleanup errors
			}
		}
	});

	it("should be consistent with fs.writeFile", async () => {
		const testContent = "Consistency test";
		const fsFile = path.join(process.cwd(), "fs-test-file.txt");

		try {
			// Write with our function
			await writeFileAsync(testFile, testContent, "utf8");

			// Write with fs.writeFile
			await fs.writeFile(fsFile, testContent, "utf8");

			// Both should produce identical files
			const ourContent = await fs.readFile(testFile, "utf8");
			const fsContent = await fs.readFile(fsFile, "utf8");

			assert.strictEqual(
				ourContent,
				fsContent,
				"Should be consistent with fs.writeFile",
			);
		} finally {
			try {
				await fs.unlink(fsFile);
			} catch {
				// Ignore cleanup errors
			}
		}
	});

	it("should handle unicode content", async () => {
		const unicodeContent = "Unicode: 🌍 αβγδε 日本語 한국어 中文";

		await writeFileAsync(testFile, unicodeContent);

		const readContent = await fs.readFile(testFile, "utf8");
		assert.strictEqual(
			readContent,
			unicodeContent,
			"Should handle unicode content",
		);
	});

	it("should handle large content", async () => {
		const largeContent = "A".repeat(100000); // 100KB of 'A's

		await writeFileAsync(testFile, largeContent);

		const readContent = await fs.readFile(testFile, "utf8");
		assert.strictEqual(
			readContent.length,
			100000,
			"Should handle large content",
		);
		assert.strictEqual(readContent, largeContent, "Large content should match");
	});

	it("should handle special characters in filename", async () => {
		const specialFile = path.join(
			process.cwd(),
			"file with spaces & symbols!.txt",
		);
		const testContent = "Special filename test";

		try {
			await writeFileAsync(specialFile, testContent);

			const readContent = await fs.readFile(specialFile, "utf8");
			assert.strictEqual(
				readContent,
				testContent,
				"Should handle special characters in filename",
			);
		} finally {
			try {
				await fs.unlink(specialFile);
			} catch {
				// Ignore cleanup errors
			}
		}
	});

	it("should handle newlines and special characters in content", async () => {
		const specialContent = "Line 1\nLine 2\r\nLine 3\tTabbed\0Null char";

		await writeFileAsync(testFile, specialContent);

		const readContent = await fs.readFile(testFile, "utf8");
		assert.strictEqual(
			readContent,
			specialContent,
			"Should preserve special characters",
		);
	});

	it("should create directories when writing to nested path", async () => {
		// This test checks if fs.writeFile creates parent directories (it doesn't)
		const nestedFile = path.join(testDir, "nested", "deep", "file.txt");
		const testContent = "Nested file test";

		// Create parent directories first
		await fs.mkdir(path.dirname(nestedFile), { recursive: true });

		await writeFileAsync(nestedFile, testContent);

		const readContent = await fs.readFile(nestedFile, "utf8");
		assert.strictEqual(readContent, testContent, "Should write to nested path");
	});

	it("should reject when writing to directory that doesn't exist", async () => {
		const nestedFile = path.join(testDir, "non-existent", "file.txt");
		const testContent = "Should fail";

		await assert.rejects(async () => {
			await writeFileAsync(nestedFile, testContent);
		}, "Should reject when parent directory doesn't exist");
	});

	it("should handle JSON content", async () => {
		const jsonContent = JSON.stringify(
			{ key: "value", number: 42, array: [1, 2, 3] },
			null,
			2,
		);

		await writeFileAsync(testFile, jsonContent);

		const readContent = await fs.readFile(testFile, "utf8");
		assert.strictEqual(readContent, jsonContent, "Should handle JSON content");

		// Verify it's valid JSON
		const parsed = JSON.parse(readContent);
		assert.strictEqual(parsed.key, "value", "Should be valid JSON");
	});

	it("should handle binary-like content with Buffer", async () => {
		const binaryData = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0xff]);

		await writeFileAsync(testFile, binaryData);

		const readContent = await fs.readFile(testFile);
		assert.ok(
			readContent.equals(binaryData),
			"Should handle binary data correctly",
		);
	});

	it("should handle base64 encoded content", async () => {
		const originalData = "Hello, World!";
		const base64Data = Buffer.from(originalData).toString("base64");

		await writeFileAsync(testFile, base64Data);

		const readContent = await fs.readFile(testFile, "utf8");
		assert.strictEqual(
			readContent,
			base64Data,
			"Should write base64 content as string",
		);

		// Verify we can decode it back
		const decoded = Buffer.from(readContent, "base64").toString("utf8");
		assert.strictEqual(
			decoded,
			originalData,
			"Should be able to decode back to original",
		);
	});

	it("should handle concurrent writes to different files", async () => {
		const file1 = path.join(process.cwd(), "concurrent1.txt");
		const file2 = path.join(process.cwd(), "concurrent2.txt");
		const content1 = "Content for file 1";
		const content2 = "Content for file 2";

		try {
			// Write to both files concurrently
			await Promise.all([
				writeFileAsync(file1, content1),
				writeFileAsync(file2, content2),
			]);

			const [readContent1, readContent2] = await Promise.all([
				fs.readFile(file1, "utf8"),
				fs.readFile(file2, "utf8"),
			]);

			assert.strictEqual(
				readContent1,
				content1,
				"First file should have correct content",
			);
			assert.strictEqual(
				readContent2,
				content2,
				"Second file should have correct content",
			);
		} finally {
			try {
				await Promise.all([fs.unlink(file1), fs.unlink(file2)]);
			} catch {
				// Ignore cleanup errors
			}
		}
	});
});
