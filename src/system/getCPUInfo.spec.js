import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import { getCPUInfo } from './getCPUInfo.js';

describe('getCPUInfo()', () => {
	it('should return an array of CPU information', () => {
		const cpuInfo = getCPUInfo();

		assert.ok(Array.isArray(cpuInfo), 'Should return an array');
		assert.ok(cpuInfo.length > 0, 'Should return at least one CPU core info');
	});

	it('should return CPU info objects with expected properties', () => {
		const cpuInfo = getCPUInfo();
		const firstCpu = cpuInfo[0];

		assert.ok(
			typeof firstCpu === 'object',
			'Each CPU info should be an object',
		);
		assert.ok(
			typeof firstCpu.model === 'string',
			'Should have model property as string',
		);
		assert.ok(
			typeof firstCpu.speed === 'number',
			'Should have speed property as number',
		);
		assert.ok(
			typeof firstCpu.times === 'object',
			'Should have times property as object',
		);

		// Check times object properties
		assert.ok(
			typeof firstCpu.times.user === 'number',
			'times.user should be a number',
		);
		assert.ok(
			typeof firstCpu.times.nice === 'number',
			'times.nice should be a number',
		);
		assert.ok(
			typeof firstCpu.times.sys === 'number',
			'times.sys should be a number',
		);
		assert.ok(
			typeof firstCpu.times.idle === 'number',
			'times.idle should be a number',
		);
		assert.ok(
			typeof firstCpu.times.irq === 'number',
			'times.irq should be a number',
		);
	});

	it('should correctly map data from os.cpus()', () => {
		const osResult = os.cpus();
		// If os.cpus() returns empty or undefined (highly unlikely for a running system),
		// getCPUInfo should also return empty.
		if (!osResult || osResult.length === 0) {
			assert.deepStrictEqual(getCPUInfo(), [], 'Should return empty array if os.cpus() is empty/null.');
			return;
		}

		const ourResult = getCPUInfo(); // Uses actual os.cpus()

		assert.strictEqual(ourResult.length, osResult.length, 'Should return same number of CPUs as os.cpus()');
		for (let i = 0; i < ourResult.length; i++) {
			assert.strictEqual(ourResult[i].model, osResult[i].model || 'unknown', 'Model should match or be unknown');
			assert.strictEqual(ourResult[i].speed, osResult[i].speed > 0 ? osResult[i].speed : 0, 'Speed should match or be 0');
			assert.deepStrictEqual(ourResult[i].times, osResult[i].times, 'Times should match');
		}
	});

	it('should return empty array if cpuData is null', () => {
		const result = getCPUInfo(null);
		assert.deepStrictEqual(result, [], 'Should return empty array for null cpuData.');
	});

	it('should return empty array if cpuData is an empty array', () => {
		const result = getCPUInfo([]);
		assert.deepStrictEqual(result, [], 'Should return empty array for empty cpuData array.');
	});

	it('should use actual os.cpus() if cpuData is undefined', () => {
		// This test effectively checks the same as 'should correctly map data from os.cpus()'
		// when getCPUInfo is called with no arguments or with 'undefined'.
		const osResult = os.cpus();
		const ourResult = getCPUInfo(undefined); // Explicitly pass undefined

		if (!osResult || osResult.length === 0) {
			assert.deepStrictEqual(ourResult, [], 'Should return empty array if os.cpus() is empty/null when cpuData is undefined.');
			return;
		}
		assert.strictEqual(ourResult.length, osResult.length, 'Should process os.cpus() when cpuData is undefined.');
		assert.strictEqual(ourResult[0].model, osResult[0].model || 'unknown');
	});

	it('should return consistent results on multiple calls', () => {
		const result1 = getCPUInfo();
		const result2 = getCPUInfo();

		assert.strictEqual(
			result1.length,
			result2.length,
			'Should return same number of CPUs',
		);
		assert.strictEqual(
			result1[0].model,
			result2[0].model,
			'CPU model should be consistent',
		);
		assert.strictEqual(
			result1[0].speed,
			result2[0].speed,
			'CPU speed should be consistent',
		);
	});

	it('should handle CPUs with missing or empty model', () => {
		const mockCPUs = [
			{
				model: '',
				speed: 2400,
				times: { user: 100, nice: 0, sys: 50, idle: 1000, irq: 5 },
			},
			{
				model: null,
				speed: 2400,
				times: { user: 100, nice: 0, sys: 50, idle: 1000, irq: 5 },
			},
			{
				model: undefined,
				speed: 2400,
				times: { user: 100, nice: 0, sys: 50, idle: 1000, irq: 5 },
			},
		];

		const result = getCPUInfo(mockCPUs);

		assert.strictEqual(
			result.length,
			3,
			'Should return correct number of CPUs',
		);
		result.forEach((cpu, index) => {
			assert.strictEqual(
				cpu.model,
				'unknown',
				`CPU ${index} should have fallback model 'unknown'`,
			);
			assert.strictEqual(
				cpu.speed,
				2400,
				`CPU ${index} should have correct speed`,
			);
		});
	});

	it('should handle CPUs with negative or zero speed', () => {
		const mockCPUs = [
			{
				model: 'Test CPU 1',
				speed: -100,
				times: { user: 100, nice: 0, sys: 50, idle: 1000, irq: 5 },
			},
			{
				model: 'Test CPU 2',
				speed: 0,
				times: { user: 100, nice: 0, sys: 50, idle: 1000, irq: 5 },
			},
			{
				model: 'Test CPU 3',
				speed: -50,
				times: { user: 100, nice: 0, sys: 50, idle: 1000, irq: 5 },
			},
		];

		const result = getCPUInfo(mockCPUs);

		assert.strictEqual(
			result.length,
			3,
			'Should return correct number of CPUs',
		);
		result.forEach((cpu, index) => {
			assert.strictEqual(
				cpu.speed,
				0,
				`CPU ${index} should have fallback speed 0 for non-positive values`,
			);
			assert.ok(cpu.model.length > 0, `CPU ${index} should have valid model`);
		});
	});

	it('should handle mixed edge cases', () => {
		const mockCPUs = [
			{
				model: '',
				speed: -100,
				times: { user: 100, nice: 0, sys: 50, idle: 1000, irq: 5 },
			},
			{
				model: null,
				speed: 0,
				times: { user: 100, nice: 0, sys: 50, idle: 1000, irq: 5 },
			},
			{
				model: undefined,
				speed: -50,
				times: { user: 100, nice: 0, sys: 50, idle: 1000, irq: 5 },
			},
		];

		const result = getCPUInfo(mockCPUs);

		assert.strictEqual(
			result.length,
			3,
			'Should return correct number of CPUs',
		);
		result.forEach((cpu, index) => {
			assert.strictEqual(
				cpu.model,
				'unknown',
				`CPU ${index} should have fallback model 'unknown'`,
			);
			assert.strictEqual(
				cpu.speed,
				0,
				`CPU ${index} should have fallback speed 0`,
			);
			assert.ok(
				typeof cpu.times === 'object',
				`CPU ${index} should have times object`,
			);
		});
	});

	it('should have reasonable CPU speed values', () => {
		const cpuInfo = getCPUInfo();

		cpuInfo.forEach((cpu, index) => {
			//! assert.ok(cpu.speed > 0, `CPU ${index} speed should be positive`);
			assert.ok(
				cpu.speed < 10000,
				`CPU ${index} speed should be reasonable (< 10GHz)`,
			);
		});
	});

	it('should have non-empty CPU model', () => {
		const cpuInfo = getCPUInfo();

		cpuInfo.forEach((cpu, index) => {
			assert.ok(cpu.model.length > 0, `CPU ${index} model should not be empty`);
			assert.ok(
				typeof cpu.model === 'string',
				`CPU ${index} model should be a string`,
			);
		});
	});

	it('should have valid times values', () => {
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

	it('should return multiple CPU cores on multi-core systems', () => {
		const cpuInfo = getCPUInfo();

		// Most modern systems have multiple cores, but we can't guarantee it
		// Just ensure the structure is consistent for all returned cores
		cpuInfo.forEach((cpu, index) => {
			assert.ok(typeof cpu === 'object', `CPU ${index} should be an object`);
			assert.ok('model' in cpu, `CPU ${index} should have model property`);
			assert.ok('speed' in cpu, `CPU ${index} should have speed property`);
			assert.ok('times' in cpu, `CPU ${index} should have times property`);
		});
	});
});
