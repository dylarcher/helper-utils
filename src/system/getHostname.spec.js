import { describe, it } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import { getHostname } from "./getHostname.js";

describe("getHostname()", () => {
	it("should return a string", () => {
		const hostname = getHostname();
		assert.strictEqual(typeof hostname, "string", "Should return a string");
	});

	it("should return a non-empty hostname", () => {
		const hostname = getHostname();
		assert.ok(hostname.length > 0, "Hostname should not be empty");
	});

	it("should be consistent with os.hostname()", () => {
		const ourResult = getHostname();
		const osResult = os.hostname();

		assert.strictEqual(
			ourResult,
			osResult,
			"Should return same result as os.hostname()",
		);
	});

	it("should return consistent results on multiple calls", () => {
		const hostname1 = getHostname();
		const hostname2 = getHostname();

		assert.strictEqual(
			hostname1,
			hostname2,
			"Should return consistent hostname across calls",
		);
	});

	it("should return valid hostname format", () => {
		const hostname = getHostname();

		// Hostname should not contain invalid characters (basic validation)
		// Valid hostnames can contain letters, numbers, dots, and hyphens
		assert.ok(
			/^[a-zA-Z0-9.-]+$/.test(hostname),
			"Hostname should contain only valid characters",
		);
	});

	it("should not return null or undefined", () => {
		const hostname = getHostname();

		assert.notStrictEqual(hostname, null, "Should not return null");
		assert.notStrictEqual(hostname, undefined, "Should not return undefined");
	});

	it("should have reasonable length", () => {
		const hostname = getHostname();

		// Hostnames are typically between 1 and 253 characters
		assert.ok(hostname.length >= 1, "Hostname should be at least 1 character");
		assert.ok(
			hostname.length <= 253,
			"Hostname should not exceed 253 characters",
		);
	});

	it("should not start or end with hyphen", () => {
		const hostname = getHostname();

		// Valid hostnames don't start or end with hyphens
		if (hostname.includes("-")) {
			assert.ok(
				!hostname.startsWith("-"),
				"Hostname should not start with hyphen",
			);
			assert.ok(!hostname.endsWith("-"), "Hostname should not end with hyphen");
		}
	});

	it("should handle system hostname correctly", () => {
		const hostname = getHostname();

		// The hostname should be a valid string that represents the system's hostname
		// This will vary by system, but should be consistent with what the OS reports
		assert.ok(typeof hostname === "string", "Should be a string");
		assert.ok(hostname.length > 0, "Should not be empty");

		// Verify it matches the system's actual hostname
		const systemHostname = os.hostname();
		assert.strictEqual(
			hostname,
			systemHostname,
			"Should match system hostname",
		);
	});
});
