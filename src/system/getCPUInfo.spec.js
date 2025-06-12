import { describe, it } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import { getCPUInfo } from "./getCPUInfo.js";

describe("getCPUInfo()", () => {
	it("should return an array of CPU information", () => {
		const cpuInfo = getCPUInfo();

		assert.ok(Array.isArray(cpuInfo), "Should return an array");
		assert.ok(cpuInfo.length > 0, "Should return at least one CPU core info");
	});

	it("should return CPU info objects with expected properties", () => {
		const cpuInfo = getCPUInfo();
		const firstCpu = cpuInfo[0];

		assert.ok(
			typeof firstCpu === "object",
			"Each CPU info should be an object",
		);
		assert.ok(
			typeof firstCpu.model === "string",
			"Should have model property as string",
		);
		assert.ok(
			typeof firstCpu.speed === "number",
			"Should have speed property as number",
		);
		assert.ok(
			typeof firstCpu.times === "object",
			"Should have times property as object",
		);

		// Check times object properties
		assert.ok(
			typeof firstCpu.times.user === "number",
			"times.user should be a number",
		);
		assert.ok(
			typeof firstCpu.times.nice === "number",
			"times.nice should be a number",
		);
		assert.ok(
			typeof firstCpu.times.sys === "number",
			"times.sys should be a number",
		);
		assert.ok(
			typeof firstCpu.times.idle === "number",
			"times.idle should be a number",
		);
		assert.ok(
			typeof firstCpu.times.irq === "number",
			"times.irq should be a number",
		);
	});

	it("should be consistent with os.cpus()", () => {
		const ourResult = getCPUInfo();
		const osResult = os.cpus();

		assert.deepStrictEqual(
			ourResult,
			osResult,
			"Should return same result as os.cpus()",
		);
	});

	it("should return consistent results on multiple calls", () => {
		const result1 = getCPUInfo();
		const result2 = getCPUInfo();

		assert.strictEqual(
			result1.length,
			result2.length,
			"Should return same number of CPUs",
		);
		assert.strictEqual(
			result1[0].model,
			result2[0].model,
			"CPU model should be consistent",
		);
		assert.strictEqual(
			result1[0].speed,
			result2[0].speed,
			"CPU speed should be consistent",
		);
	});

	it("should have reasonable CPU speed values", () => {
		const cpuInfo = getCPUInfo();

		cpuInfo.forEach((cpu, index) => {
			assert.ok(cpu.speed > 0, `CPU ${index} speed should be positive`);
			assert.ok(
				cpu.speed < 10000,
				`CPU ${index} speed should be reasonable (< 10GHz)`,
			);
		});
	});

	it("should have non-empty CPU model", () => {
		const cpuInfo = getCPUInfo();

		cpuInfo.forEach((cpu, index) => {
			assert.ok(cpu.model.length > 0, `CPU ${index} model should not be empty`);
			assert.ok(
				typeof cpu.model === "string",
				`CPU ${index} model should be a string`,
			);
		});
	});

	it("should have valid times values", () => {
		const cpuInfo = getCPUInfo();

		cpuInfo.forEach((cpu, index) => {
			const times = cpu.times;
			assert.ok(
				times.user >= 0,
				`CPU ${index} user time should be non-negative`,
			);
			assert.ok(
				times.nice >= 0,
				`CPU ${index} nice time should be non-negative`,
			);
			assert.ok(times.sys >= 0, `CPU ${index} sys time should be non-negative`);
			assert.ok(
				times.idle >= 0,
				`CPU ${index} idle time should be non-negative`,
			);
			assert.ok(times.irq >= 0, `CPU ${index} irq time should be non-negative`);
		});
	});

	it("should return multiple CPU cores on multi-core systems", () => {
		const cpuInfo = getCPUInfo();

		// Most modern systems have multiple cores, but we can't guarantee it
		// Just ensure the structure is consistent for all returned cores
		cpuInfo.forEach((cpu, index) => {
			assert.ok(typeof cpu === "object", `CPU ${index} should be an object`);
			assert.ok("model" in cpu, `CPU ${index} should have model property`);
			assert.ok("speed" in cpu, `CPU ${index} should have speed property`);
			assert.ok("times" in cpu, `CPU ${index} should have times property`);
		});
	});
});
