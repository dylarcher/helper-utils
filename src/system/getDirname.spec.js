import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { getDirname } from "./getDirname.js";

describe("getDirname(p)", () => {
	it("should return directory name from file path", () => {
		const result = getDirname("/path/to/file.txt");
		assert.strictEqual(result, "/path/to", "Should return directory path");
	});

	it("should handle Windows-style paths", () => {
		const result = getDirname("C:\\path\\to\\file.txt");
		assert.strictEqual(
			result,
			"C:\\path\\to",
			"Should handle Windows path separators",
		);
	});

	it("should handle Unix-style paths", () => {
		const result = getDirname("/usr/local/bin/node");
		assert.strictEqual(result, "/usr/local/bin", "Should handle Unix paths");
	});

	it("should handle paths ending with separator", () => {
		const result = getDirname("/path/to/directory/");
		assert.strictEqual(
			result,
			"/path/to",
			"Should return parent directory when path ends with separator",
		);
	});

	it("should handle relative paths", () => {
		const result = getDirname("./path/to/file.txt");
		assert.strictEqual(result, "./path/to", "Should handle relative paths");
	});

	it("should handle paths with no directory", () => {
		const result = getDirname("file.txt");
		assert.strictEqual(
			result,
			".",
			"Should return current directory for files with no path",
		);
	});

	it("should handle root path", () => {
		const result = getDirname("/");
		assert.strictEqual(result, "/", "Should handle root path");
	});

	it("should handle current directory path", () => {
		const result = getDirname(".");
		assert.strictEqual(result, ".", "Should handle current directory");
	});

	it("should handle parent directory path", () => {
		const result = getDirname("..");
		assert.strictEqual(result, ".", "Should handle parent directory");
	});

	it("should handle nested relative paths", () => {
		const result = getDirname("../parent/file.txt");
		assert.strictEqual(
			result,
			"../parent",
			"Should handle nested relative paths",
		);
	});

	it("should handle paths with multiple consecutive separators", () => {
		const result = getDirname("/path//to///file.txt");
		assert.strictEqual(
			result,
			"/path//to",
			"Should handle multiple consecutive separators",
		);
	});

	it("should handle complex paths with spaces and special characters", () => {
		const result = getDirname("/path/to/file with spaces & symbols!.txt");
		assert.strictEqual(result, "/path/to", "Should handle special characters");
	});

	it("should handle hidden files and directories", () => {
		const result1 = getDirname("/path/to/.hidden");
		const result2 = getDirname("/path/.hidden/file.txt");

		assert.strictEqual(result1, "/path/to", "Should handle hidden files");
		assert.strictEqual(
			result2,
			"/path/.hidden",
			"Should handle hidden directories",
		);
	});

	it("should be consistent with Node.js path.dirname", () => {
		const testPaths = [
			"/path/to/file.txt",
			"C:\\Windows\\System32\\file.exe",
			"file.txt",
			"/path/to/directory/",
			".",
			"..",
			"/",
			"./relative/path.txt",
			"../parent/file.txt",
			"/path/to/.hidden",
			"",
			"/path//to///file.txt",
		];

		testPaths.forEach((testPath) => {
			const ourResult = getDirname(testPath);
			const nodeResult = path.dirname(testPath);
			assert.strictEqual(
				ourResult,
				nodeResult,
				`Should match Node.js result for path: ${testPath}`,
			);
		});
	});

	it("should handle deeply nested paths", () => {
		const deepPath = "/a/b/c/d/e/f/g/h/i/j/file.txt";
		const result = getDirname(deepPath);
		assert.strictEqual(
			result,
			"/a/b/c/d/e/f/g/h/i/j",
			"Should handle deeply nested paths",
		);
	});

	it("should handle paths with file extensions in directory names", () => {
		const result = getDirname("/path/to/directory.ext/file.txt");
		assert.strictEqual(
			result,
			"/path/to/directory.ext",
			"Should handle directory names with extensions",
		);
	});

	it("should handle UNC paths on Windows", () => {
		const result = getDirname("\\\\server\\share\\path\\file.txt");
		const nodeResult = path.dirname("\\\\server\\share\\path\\file.txt");
		assert.strictEqual(
			result,
			nodeResult,
			"Should handle UNC paths like Node.js",
		);
	});

	it("should handle empty string", () => {
		const result = getDirname("");
		const nodeResult = path.dirname("");
		assert.strictEqual(
			result,
			nodeResult,
			"Should handle empty string like Node.js",
		);
	});

	it("should handle paths with only separators", () => {
		const testPaths = ["//", "\\\\", "///"];

		testPaths.forEach((testPath) => {
			const ourResult = getDirname(testPath);
			const nodeResult = path.dirname(testPath);
			assert.strictEqual(
				ourResult,
				nodeResult,
				`Should match Node.js result for path: ${testPath}`,
			);
		});
	});
});
