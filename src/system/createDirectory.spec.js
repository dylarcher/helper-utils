import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createDirectory } from './createDirectory.js';

describe('createDirectory(dirPath, options)', () => {
	let testDir;

	beforeEach(() => {
		testDir = path.join(process.cwd(), 'test-temp-dir');
	});

	afterEach(async () => {
		try {
			await fs.rm(testDir, { recursive: true, force: true });
		} catch {
			// Directory might not exist, ignore error
		}
	});

	it('should create a directory with default recursive option', async () => {
		const result = await createDirectory(testDir);

		const stats = await fs.stat(testDir);
		assert.ok(stats.isDirectory(), 'Directory should be created');
		assert.strictEqual(
			result,
			testDir,
			'Should return the created directory path',
		);
	});

	it('should create nested directories when recursive is true', async () => {
		const nestedDir = path.join(testDir, 'nested', 'deep');
		await createDirectory(nestedDir, { recursive: true });

		const stats = await fs.stat(nestedDir);
		assert.ok(stats.isDirectory(), 'Nested directory should be created');
	});

	it('should use custom options', async () => {
		const result = await createDirectory(testDir, { recursive: false });

		const stats = await fs.stat(testDir);
		assert.ok(stats.isDirectory(), 'Directory should be created');
	});

	it('should not throw if directory already exists with recursive option', async () => {
		await createDirectory(testDir);

		// Should not throw
		await assert.doesNotReject(async () => {
			await createDirectory(testDir, { recursive: true });
		});
	});

	it('should throw error when creating nested directory without recursive option', async () => {
		const nestedDir = path.join(testDir, 'nested', 'deep');

		await assert.rejects(async () => {
			await createDirectory(nestedDir, { recursive: false });
		});
	});
});
