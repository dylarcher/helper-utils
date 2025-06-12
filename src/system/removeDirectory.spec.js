import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { removeDirectory } from "./removeDirectory.js";

describe("removeDirectory(dirPath, options)", () => {
	let testDir;
	let nestedTestDir;

	beforeEach(async () => {
		testDir = path.join(process.cwd(), "test-remove-directory");
		nestedTestDir = path.join(process.cwd(), "test-nested-remove");
	});

	afterEach(async () => {
		// Clean up any remaining test directories
		try {
			await fs.rm(testDir, { recursive: true, force: true });
		} catch {
			// Directory might not exist, ignore error
		}
		try {
			await fs.rm(nestedTestDir, { recursive: true, force: true });
		} catch {
			// Directory might not exist, ignore error
		}
	});

	it("should remove empty directory with default options", async () => {
		await fs.mkdir(testDir);

		await removeDirectory(testDir);

		// Verify directory is removed
		await assert.rejects(async () => {
			await fs.stat(testDir);
		}, "Directory should be removed");
	});

	it("should remove directory with recursive option", async () => {
		// Create nested structure
		await fs.mkdir(nestedTestDir, { recursive: true });
		await fs.mkdir(path.join(nestedTestDir, "subdir"));
		await fs.writeFile(path.join(nestedTestDir, "file.txt"), "content");
		await fs.writeFile(
			path.join(nestedTestDir, "subdir", "nested-file.txt"),
			"nested content",
		);

		await removeDirectory(nestedTestDir, { recursive: true });

		// Verify directory is removed
		await assert.rejects(async () => {
			await fs.stat(nestedTestDir);
		}, "Directory should be removed recursively");
	});

	it("should fail to remove non-empty directory without recursive option", async () => {
		await fs.mkdir(testDir);
		await fs.writeFile(path.join(testDir, "file.txt"), "content");

		await assert.rejects(async () => {
			await removeDirectory(testDir, { recursive: false });
		}, "Should fail to remove non-empty directory without recursive option");
	});

	it("should remove directory with force option", async () => {
		await fs.mkdir(testDir);

		await removeDirectory(testDir, { force: true });

		// Verify directory is removed
		await assert.rejects(async () => {
			await fs.stat(testDir);
		}, "Directory should be removed with force option");
	});

	it("should handle non-existent directory with force option", async () => {
		const nonExistentDir = path.join(process.cwd(), "non-existent-directory");

		// Should not throw with force option
		await assert.doesNotReject(async () => {
			await removeDirectory(nonExistentDir, { force: true });
		}, "Should not throw for non-existent directory with force option");
	});

	it("should reject for non-existent directory without force option", async () => {
		const nonExistentDir = path.join(process.cwd(), "non-existent-directory");

		await assert.rejects(async () => {
			await removeDirectory(nonExistentDir, { recursive: false, force: false });
		}, "Should reject for non-existent directory without force option");
	});

	it("should handle absolute paths", async () => {
		const absolutePath = path.resolve(testDir);
		await fs.mkdir(absolutePath);

		await removeDirectory(absolutePath);

		await assert.rejects(async () => {
			await fs.stat(absolutePath);
		}, "Should remove directory with absolute path");
	});

	it("should handle relative paths", async () => {
		const relativeDir = "./relative-remove-test";
		await fs.mkdir(relativeDir);

		await removeDirectory(relativeDir);

		await assert.rejects(async () => {
			await fs.stat(relativeDir);
		}, "Should remove directory with relative path");
	});

	it("should remove deeply nested directories", async () => {
		const deepDir = path.join(nestedTestDir, "a", "b", "c", "d", "e");
		await fs.mkdir(deepDir, { recursive: true });
		await fs.writeFile(path.join(deepDir, "deep-file.txt"), "deep content");

		await removeDirectory(nestedTestDir, { recursive: true });

		await assert.rejects(async () => {
			await fs.stat(nestedTestDir);
		}, "Should remove deeply nested directories");
	});

	it("should be consistent with fs.rm", async () => {
		// Test with recursive and force options
		await fs.mkdir(testDir);
		await fs.writeFile(path.join(testDir, "file.txt"), "content");

		// Our function should behave like fs.rm
		await removeDirectory(testDir, { recursive: true, force: true });

		await assert.rejects(async () => {
			await fs.stat(testDir);
		}, "Should behave like fs.rm");
	});

	it("should handle special characters in directory names", async () => {
		const specialDir = path.join(
			process.cwd(),
			"test dir with spaces & symbols!",
		);
		await fs.mkdir(specialDir);

		try {
			await removeDirectory(specialDir);

			await assert.rejects(async () => {
				await fs.stat(specialDir);
			}, "Should remove directory with special characters");
		} catch (error) {
			// Clean up if test fails
			try {
				await fs.rmdir(specialDir);
			} catch {
				// Ignore cleanup errors
			}
			throw error;
		}
	});

	it("should handle directories with many files", async () => {
		await fs.mkdir(testDir);

		// Create many files
		for (let i = 0; i < 50; i++) {
			await fs.writeFile(path.join(testDir, `file${i}.txt`), `Content ${i}`);
		}

		await removeDirectory(testDir, { recursive: true });

		await assert.rejects(async () => {
			await fs.stat(testDir);
		}, "Should remove directory with many files");
	});

	it("should handle mixed content (files and subdirectories)", async () => {
		await fs.mkdir(testDir);
		await fs.writeFile(path.join(testDir, "file1.txt"), "content1");
		await fs.mkdir(path.join(testDir, "subdir1"));
		await fs.writeFile(
			path.join(testDir, "subdir1", "nested-file.txt"),
			"nested content",
		);
		await fs.mkdir(path.join(testDir, "subdir2"));
		await fs.writeFile(path.join(testDir, "file2.txt"), "content2");

		await removeDirectory(testDir, { recursive: true });

		await assert.rejects(async () => {
			await fs.stat(testDir);
		}, "Should remove directory with mixed content");
	});

	it("should reject when trying to remove a file", async () => {
		const testFile = path.join(process.cwd(), "test-file.txt");
		await fs.writeFile(testFile, "content");

		try {
			await assert.rejects(async () => {
				await removeDirectory(testFile);
			}, "Should reject when trying to remove a file");
		} finally {
			await fs.unlink(testFile);
		}
	});

	it("should handle symbolic links to directories", async () => {
		const targetDir = path.join(process.cwd(), "target-directory");
		const linkDir = path.join(process.cwd(), "link-directory");

		await fs.mkdir(targetDir);

		try {
			await fs.symlink(targetDir, linkDir);

			// Remove the symbolic link (not the target)
			await removeDirectory(linkDir);

			// Link should be removed, but target should still exist
			await assert.rejects(async () => {
				await fs.stat(linkDir);
			}, "Symbolic link should be removed");

			// Target should still exist
			const targetStats = await fs.stat(targetDir);
			assert.ok(
				targetStats.isDirectory(),
				"Target directory should still exist",
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
});
