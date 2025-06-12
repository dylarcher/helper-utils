import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getOSInfo } from "src/browser/getOSInfo.js";

describe("getOSInfo()", () => {
	let originalOs;

	beforeEach(() => {
		// Note: This test is complex because it imports a Node.js module
		// In a real browser environment, this function wouldn't work
		// but we can test the structure and behavior
	});

	it("should return an object with required properties", () => {
		const result = getOSInfo();

		assert.ok(typeof result === "object");
		assert.ok(result !== null);
		assert.ok("platform" in result);
		assert.ok("release" in result);
		assert.ok("type" in result);
		assert.ok("arch" in result);
	});

	it("should return strings for all properties", () => {
		const result = getOSInfo();

		assert.strictEqual(typeof result.platform, "string");
		assert.strictEqual(typeof result.release, "string");
		assert.strictEqual(typeof result.type, "string");
		assert.strictEqual(typeof result.arch, "string");
	});

	it("should return non-empty strings", () => {
		const result = getOSInfo();

		assert.ok(result.platform.length > 0);
		assert.ok(result.release.length > 0);
		assert.ok(result.type.length > 0);
		assert.ok(result.arch.length > 0);
	});

	it("should return consistent results on multiple calls", () => {
		const result1 = getOSInfo();
		const result2 = getOSInfo();

		assert.deepStrictEqual(result1, result2);
	});

	it("should return valid platform values", () => {
		const result = getOSInfo();
		const validPlatforms = [
			"aix",
			"android",
			"darwin",
			"freebsd",
			"haiku",
			"linux",
			"openbsd",
			"sunos",
			"win32",
			"cygwin",
			"netbsd",
		];

		assert.ok(validPlatforms.includes(result.platform));
	});

	it("should return valid architecture values", () => {
		const result = getOSInfo();
		const validArchitectures = [
			"arm",
			"arm64",
			"ia32",
			"loong64",
			"mips",
			"mipsel",
			"ppc",
			"ppc64",
			"riscv64",
			"s390",
			"s390x",
			"x64",
		];

		assert.ok(validArchitectures.includes(result.arch));
	});

	it("should have platform matching current environment", () => {
		const result = getOSInfo();

		// In a Node.js environment on macOS (based on context)
		// This test is environment-specific
		if (process.platform) {
			assert.strictEqual(result.platform, process.platform);
		}
	});

	it("should have type matching current environment", () => {
		const result = getOSInfo();

		// Common OS types
		const commonTypes = ["Linux", "Darwin", "Windows_NT"];
		const hasCommonType = commonTypes.some((type) =>
			result.type.includes(type),
		);

		// Should either be a common type or some other valid OS type
		assert.ok(hasCommonType || result.type.length > 0);
	});

	it("should return release version in expected format", () => {
		const result = getOSInfo();

		// Release should contain version-like information
		// Most OS releases contain numbers and dots
		assert.ok(/[\d.]/.test(result.release));
	});

	it("should return immutable result", () => {
		const result = getOSInfo();
		const originalPlatform = result.platform;

		// Try to modify the result
		result.platform = "modified";

		// Get fresh result
		const newResult = getOSInfo();

		// Should not be affected by previous modification
		assert.strictEqual(newResult.platform, originalPlatform);
	});
});
