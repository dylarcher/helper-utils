import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { isDirectory } from "./isDirectory.js";

describe("isDirectory(dirPath)", () => {
	let testFile;
	let testDir;

	beforeEach(async () => {
		testFile = path.join(process.cwd(), "test-file.txt");
		testDir = path.join(process.cwd(), "test-directory");
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

	it("should return true for existing directory", async () => {
		await fs.mkdir(testDir);

		const result = await isDirectory(testDir);
		assert.strictEqual(
			result,
			true,
			"Should return true for existing directory",
		);
	});

	it("should return false for existing file", async () => {
		await fs.writeFile(testFile, "test content");

		const result = await isDirectory(testFile);
		assert.strictEqual(result, false, "Should return false for existing file");
	});

	it("should return false for non-existent path", async () => {
		const nonExistentPath = path.join(process.cwd(), "non-existent-path");

		const result = await isDirectory(nonExistentPath);
		assert.strictEqual(
			result,
			false,
			"Should return false for non-existent path",
		);
	});

	it("should handle absolute paths", async () => {
		const absolutePath = path.resolve(testDir);
		await fs.mkdir(absolutePath);

		const result = await isDirectory(absolutePath);
		assert.strictEqual(result, true, "Should work with absolute paths");
	});

	it("should handle relative paths", async () => {
		const relativePath = "./test-relative-dir";
		await fs.mkdir(relativePath);

		try {
			const result = await isDirectory(relativePath);
			assert.strictEqual(result, true, "Should work with relative paths");
		} finally {
			// Clean up
			try {
				await fs.rmdir(relativePath);
			} catch {
				// Ignore cleanup errors
			}
		}
	});

	it("should handle nested directories", async () => {
		const nestedDir = path.join(process.cwd(), "nested", "deep", "directory");
		await fs.mkdir(nestedDir, { recursive: true });

		try {
			const result = await isDirectory(nestedDir);
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

	it("should handle current directory", async () => {
		const result = await isDirectory(".");
		assert.strictEqual(result, true, "Current directory should return true");
	});

	it("should handle parent directory", async () => {
		const result = await isDirectory("..");
		assert.strictEqual(result, true, "Parent directory should return true");
	});

	it("should handle root directory", async () => {
		const result = await isDirectory("/");
		assert.strictEqual(result, true, "Root directory should return true");
	});

	it("should handle empty string path", async () => {
		const result = await isDirectory("");
		assert.strictEqual(result, false, "Empty string should return false");
	});

	it("should handle special characters in directory names", async () => {
		const specialDir = path.join(
			process.cwd(),
			"test dir with spaces & symbols!",
		);
		await fs.mkdir(specialDir);

		try {
			const result = await isDirectory(specialDir);
			assert.strictEqual(
				result,
				true,
				"Should handle special characters in directory names",
			);
		} finally {
			// Clean up
			try {
				await fs.rmdir(specialDir);
			} catch {
				// Ignore cleanup errors
			}
		}
	});

	it("should handle permission denied scenarios gracefully", async () => {
		// This test might not work on all systems, but should not throw
		const restrictedPath = "/root";

		const result = await isDirectory(restrictedPath);
		assert.strictEqual(
			typeof result,
			"boolean",
			"Should return a boolean even for restricted paths",
		);
	});

	it("should handle symbolic links to directories", async () => {
		const targetDir = path.join(process.cwd(), "target-directory");
		const linkDir = path.join(process.cwd(), "link-directory");

		await fs.mkdir(targetDir);

		try {
			await fs.symlink(targetDir, linkDir);

			const result = await isDirectory(linkDir);
			assert.strictEqual(
				result,
				true,
				"Should return true for symbolic links to directories",
			);
		} catch (error) {
			// Symbolic links might not be supported on all systems
			if (error.code !== "EPERM" && error.code !== "ENOSYS") {
				throw error;
			}
		} finally {
			// Clean up
			try {
				await fs.rmdir(targetDir);
				await fs.unlink(linkDir);
			} catch {
				// Ignore cleanup errors
			}
		}
	});

	it("should handle symbolic links to files", async () => {
		const targetFile = path.join(process.cwd(), "target-file.txt");
		const linkFile = path.join(process.cwd(), "link-file.txt");

		await fs.writeFile(targetFile, "target content");

		try {
			await fs.symlink(targetFile, linkFile);

			const result = await isDirectory(linkFile);
			assert.strictEqual(
				result,
				false,
				"Should return false for symbolic links to files",
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

	it("should handle broken symbolic links", async () => {
		const nonExistentTarget = path.join(process.cwd(), "non-existent-target");
		const brokenLink = path.join(process.cwd(), "broken-link");

		try {
			await fs.symlink(nonExistentTarget, brokenLink);

			const result = await isDirectory(brokenLink);
			assert.strictEqual(
				result,
				false,
				"Should return false for broken symbolic links",
			);
		} catch (error) {
			// Symbolic links might not be supported on all systems
			if (error.code !== "EPERM" && error.code !== "ENOSYS") {
				throw error;
			}
		} finally {
			// Clean up
			try {
				await fs.unlink(brokenLink);
			} catch {
				// Ignore cleanup errors
			}
		}
	});
});
