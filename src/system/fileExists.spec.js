import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileExists } from "./fileExists.js";

describe("fileExists(filePath)", () => {
	let testFile;
	let testDir;

	beforeEach(async () => {
		testFile = path.join(process.cwd(), "test-file.txt");
		testDir = path.join(process.cwd(), "test-dir");
	});

	afterEach(async () => {
		try {
			await fs.unlink(testFile);
		} catch {
			// File might not exist, ignore error
		}
		try {
			await fs.rmdir(testDir);
		} catch {
			// Directory might not exist, ignore error
		}
	});

	it("should return true when file exists", async () => {
		await fs.writeFile(testFile, "test content");

		const result = await fileExists(testFile);
		assert.strictEqual(result, true, "Should return true for existing file");
	});

	it("should return false when file does not exist", async () => {
		const nonExistentFile = path.join(process.cwd(), "non-existent-file.txt");

		const result = await fileExists(nonExistentFile);
		assert.strictEqual(
			result,
			false,
			"Should return false for non-existent file",
		);
	});

	it("should return true when directory exists", async () => {
		await fs.mkdir(testDir);

		const result = await fileExists(testDir);
		assert.strictEqual(
			result,
			true,
			"Should return true for existing directory",
		);
	});

	it("should return false when directory does not exist", async () => {
		const nonExistentDir = path.join(process.cwd(), "non-existent-dir");

		const result = await fileExists(nonExistentDir);
		assert.strictEqual(
			result,
			false,
			"Should return false for non-existent directory",
		);
	});

	it("should handle absolute paths", async () => {
		const absolutePath = path.resolve(testFile);
		await fs.writeFile(absolutePath, "test content");

		const result = await fileExists(absolutePath);
		assert.strictEqual(result, true, "Should work with absolute paths");
	});

	it("should handle relative paths", async () => {
		const relativePath = "./test-relative-file.txt";
		await fs.writeFile(relativePath, "test content");

		try {
			const result = await fileExists(relativePath);
			assert.strictEqual(result, true, "Should work with relative paths");
		} finally {
			// Clean up the relative file
			try {
				await fs.unlink(relativePath);
			} catch {
				// Ignore cleanup errors
			}
		}
	});

	it("should handle empty file paths", async () => {
		const result = await fileExists("");
		assert.strictEqual(result, false, "Should return false for empty path");
	});

	it("should handle special characters in file names", async () => {
		const specialFile = path.join(
			process.cwd(),
			"test file with spaces & symbols!.txt",
		);
		await fs.writeFile(specialFile, "test content");

		try {
			const result = await fileExists(specialFile);
			assert.strictEqual(
				result,
				true,
				"Should handle special characters in file names",
			);
		} finally {
			// Clean up
			try {
				await fs.unlink(specialFile);
			} catch {
				// Ignore cleanup errors
			}
		}
	});

	it("should handle nested directory paths", async () => {
		const nestedDir = path.join(process.cwd(), "nested", "deep", "directory");
		await fs.mkdir(nestedDir, { recursive: true });

		try {
			const result = await fileExists(nestedDir);
			assert.strictEqual(result, true, "Should work with nested directories");
		} finally {
			// Clean up
			try {
				await fs.rm(path.join(process.cwd(), "nested"), {
					recursive: true,
					force: true,
				});
			} catch {
				// Ignore cleanup errors
			}
		}
	});

	it("should handle permission denied scenarios gracefully", async () => {
		// This test might not work on all systems, but should not throw
		const restrictedPath = "/root/restricted-file.txt";

		const result = await fileExists(restrictedPath);
		assert.strictEqual(
			typeof result,
			"boolean",
			"Should return a boolean even for restricted paths",
		);
	});

	it("should handle symbolic links", async () => {
		const targetFile = path.join(process.cwd(), "target-file.txt");
		const linkFile = path.join(process.cwd(), "link-file.txt");

		await fs.writeFile(targetFile, "target content");

		try {
			await fs.symlink(targetFile, linkFile);

			const result = await fileExists(linkFile);
			assert.strictEqual(
				result,
				true,
				"Should return true for existing symbolic links",
			);
		} catch (error) {
			// Symbolic links might not be supported on all systems
			if (error.code !== "EPERM" && error.code !== "ENOSYS") {
				throw error;
			}
		} finally {
			// Clean up
			try {
				await fs.unlink(targetFile);
				await fs.unlink(linkFile);
			} catch {
				// Ignore cleanup errors
			}
		}
	});
});
