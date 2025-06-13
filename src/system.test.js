import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Import functions directly and verify they work
import * as allExports from './system.js';
import {
	createDirectory,
	decrypt,
	encrypt,
	env,
	execAsync,
	fileExists,
	generateHash,
	getBasename,
	getCPUInfo,
	getDirname,
	getExtension,
	getHostname,
	getMemoryInfo,
	getNetworkInterfaces,
	isDirectory,
	joinPaths,
	listDirectoryContents,
	readFileAsync,
	removeDirectory,
	resolvePath,
	uuid,
	writeFileAsync,
} from './system.js';

describe('system', () => {
	it('should export all expected functions correctly', () => {
		// Test that all exports are functions
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

		expectedExports.forEach((exportName) => {
			assert.strictEqual(typeof allExports[exportName], 'function');
		});

		// Check total number of exports matches expected
		assert.strictEqual(Object.keys(allExports).length, expectedExports.length);

		// Test some specific functions have the right names
		assert.strictEqual(allExports.createDirectory.name, 'createDirectory');
		assert.strictEqual(allExports.getBasename.name, 'getBasename');
		assert.strictEqual(allExports.uuid.name, 'uuid');
	});

	it('should export createDirectory function', () => {
		assert.strictEqual(typeof createDirectory, 'function');
	});

	it('should export decrypt function', () => {
		assert.strictEqual(typeof decrypt, 'function');
	});

	it('should export encrypt function', () => {
		assert.strictEqual(typeof encrypt, 'function');
	});

	it('should export env function', () => {
		assert.strictEqual(typeof env, 'function');
	});

	it('should export execAsync function', () => {
		assert.strictEqual(typeof execAsync, 'function');
	});

	it('should export fileExists function', () => {
		assert.strictEqual(typeof fileExists, 'function');
	});

	it('should export generateHash function', () => {
		assert.strictEqual(typeof generateHash, 'function');
	});

	it('should export getBasename function', () => {
		assert.strictEqual(typeof getBasename, 'function');
	});

	it('should export getCPUInfo function', () => {
		assert.strictEqual(typeof getCPUInfo, 'function');
	});

	it('should export getDirname function', () => {
		assert.strictEqual(typeof getDirname, 'function');
	});

	it('should export getExtension function', () => {
		assert.strictEqual(typeof getExtension, 'function');
	});

	it('should export getHostname function', () => {
		assert.strictEqual(typeof getHostname, 'function');
	});

	it('should export getMemoryInfo function', () => {
		assert.strictEqual(typeof getMemoryInfo, 'function');
	});

	it('should export getNetworkInterfaces function', () => {
		assert.strictEqual(typeof getNetworkInterfaces, 'function');
	});

	it('should export isDirectory function', () => {
		assert.strictEqual(typeof isDirectory, 'function');
	});

	it('should export joinPaths function', () => {
		assert.strictEqual(typeof joinPaths, 'function');
	});

	it('should export listDirectoryContents function', () => {
		assert.strictEqual(typeof listDirectoryContents, 'function');
	});

	it('should export readFileAsync function', () => {
		assert.strictEqual(typeof readFileAsync, 'function');
	});

	it('should export removeDirectory function', () => {
		assert.strictEqual(typeof removeDirectory, 'function');
	});

	it('should export resolvePath function', () => {
		assert.strictEqual(typeof resolvePath, 'function');
	});

	it('should export uuid function', () => {
		assert.strictEqual(typeof uuid, 'function');
	});

	it('should export writeFileAsync function', () => {
		assert.strictEqual(typeof writeFileAsync, 'function');
	});
});
