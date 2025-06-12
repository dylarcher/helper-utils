import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { getBasename } from "./getBaseName.js";

describe("getBasename(p, ext)", () => {
	it("should return filename from path without extension parameter", () => {
		const result = getBasename("/path/to/file.txt");
		assert.strictEqual(
			result,
			"file.txt",
			"Should return filename with extension",
		);
	});

	it("should return filename without extension when extension parameter provided", () => {
		const result = getBasename("/path/to/file.txt", ".txt");
		assert.strictEqual(
			result,
			"file",
			"Should return filename without specified extension",
		);
	});

	it("should handle Windows-style paths", () => {
		const result = getBasename("C:\\path\\to\\file.txt");
		assert.strictEqual(
			result,
			"file.txt",
			"Should handle Windows path separators",
		);
	});

	it("should handle Unix-style paths", () => {
		const result = getBasename("/usr/local/bin/node");
		assert.strictEqual(result, "node", "Should handle Unix paths");
	});

	it("should return directory name when path ends with separator", () => {
		const result = getBasename("/path/to/directory/");
		assert.strictEqual(
			result,
			"directory",
			"Should return directory name when path ends with separator",
		);
	});

	it("should handle paths with no directory", () => {
		const result = getBasename("file.txt");
		assert.strictEqual(result, "file.txt", "Should handle filename only");
	});

	it("should handle empty extension parameter", () => {
		const result = getBasename("/path/to/file.txt", "");
		assert.strictEqual(
			result,
			"file.txt",
			"Should return full filename when empty extension provided",
		);
	});

	it("should handle partial extension matches", () => {
		const result = getBasename("/path/to/file.txt", ".tx");
		assert.strictEqual(
			result,
			"file.txt",
			"Should not remove partial extension matches",
		);
	});

	it("should handle files with multiple dots", () => {
		const result1 = getBasename("/path/to/file.tar.gz");
		const result2 = getBasename("/path/to/file.tar.gz", ".gz");

		assert.strictEqual(
			result1,
			"file.tar.gz",
			"Should return full filename with multiple dots",
		);
		assert.strictEqual(
			result2,
			"file.tar",
			"Should remove only specified extension",
		);
	});

	it("should handle files with no extension", () => {
		const result = getBasename("/path/to/README");
		assert.strictEqual(
			result,
			"README",
			"Should handle files without extension",
		);
	});

	it("should handle hidden files (starting with dot)", () => {
		const result1 = getBasename("/path/to/.gitignore");
		const result2 = getBasename("/path/to/.env.local", ".local");

		assert.strictEqual(result1, ".gitignore", "Should handle hidden files");
		assert.strictEqual(
			result2,
			".env",
			"Should handle hidden files with extension removal",
		);
	});

	it("should handle root path", () => {
		const result = getBasename("/");
		assert.strictEqual(result, "/", "Should handle root path");
	});

	it("should handle current directory path", () => {
		const result = getBasename(".");
		assert.strictEqual(result, ".", "Should handle current directory");
	});

	it("should handle parent directory path", () => {
		const result = getBasename("..");
		assert.strictEqual(result, "..", "Should handle parent directory");
	});

	it("should handle complex paths with spaces and special characters", () => {
		const result = getBasename(
			"/path/to/file with spaces & symbols!.txt",
			".txt",
		);
		assert.strictEqual(
			result,
			"file with spaces & symbols!",
			"Should handle special characters",
		);
	});

	it("should be consistent with Node.js path.basename", () => {
		const testPaths = [
			"/path/to/file.txt",
			"C:\\Windows\\System32\\file.exe",
			"file.txt",
			"/path/to/directory/",
			".",
			"..",
			"/",
			"/path/to/.hidden",
			"/path/to/file.tar.gz",
		];

		testPaths.forEach((testPath) => {
			const ourResult = getBasename(testPath);
			const nodeResult = path.basename(testPath);
			assert.strictEqual(
				ourResult,
				nodeResult,
				`Should match Node.js result for path: ${testPath}`,
			);
		});
	});

	it("should be consistent with Node.js path.basename with extension parameter", () => {
		const testCases = [
			["/path/to/file.txt", ".txt"],
			["/path/to/file.tar.gz", ".gz"],
			["/path/to/.env.local", ".local"],
			["file.js", ".js"],
			["README", ".md"],
		];

		testCases.forEach(([testPath, ext]) => {
			const ourResult = getBasename(testPath, ext);
			const nodeResult = path.basename(testPath, ext);
			assert.strictEqual(
				ourResult,
				nodeResult,
				`Should match Node.js result for path: ${testPath} with extension: ${ext}`,
			);
		});
	});

	it("should handle empty string path", () => {
		const result = getBasename("");
		const nodeResult = path.basename("");
		assert.strictEqual(
			result,
			nodeResult,
			"Should handle empty string like Node.js path.basename",
		);
	});
});
