import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as system from './system.js';

describe('system exports', () => {
	it('should export all system modules correctly', () => {
		// Create array of expected exports
		const expectedExports = [
			'createDirectory',
			'decrypt',
			'encrypt',
			'env',
			'execAsync',
			'fileExists',
			'generateHash',
			'getBasename',
			'getCPUInfo',
			'getDirname',
			'getExtension',
			'getHostname',
			'getMemoryInfo',
			'getNetworkInterfaces',
			'isDirectory',
			'joinPaths',
			'listDirectoryContents',
			'readFileAsync',
			'removeDirectory',
			'resolvePath',
			'uuid',
			'writeFileAsync',
		];

		// Verify all expected exports exist
		expectedExports.forEach(elementName => {
			assert.strictEqual(
				typeof system[elementName],
				'function',
				`${elementName} should be exported as a function`,
			);
		});

		// Verify the total count of exports
		assert.strictEqual(
			Object.keys(system).length,
			expectedExports.length,
			'System exports count should match expected',
		);

		// Test some specific exports
		assert.strictEqual(system.getBasename.name, 'getBasename');
		assert.strictEqual(system.getDirname.name, 'getDirname');
		assert.strictEqual(system.uuid.name, 'uuid');
	});
});
