import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Import from index.js to test the main entry point
import * as index from './index.js';
import * as browser from './browser.js';
import * as system from './system.js';

describe('index.js module integration', () => {
	it('should properly re-export all browser utilities', () => {
		const browserExports = [
			'addClass',
			'copyToClipboardAsync',
			'createElement',
			'debounce',
			'fetchJSON',
			'findClosest',
			'getCookie',
			'getGlobal',
			'getLocalStorageJSON',
			'getOSInfo',
			'getStyle',
			'getUniqueElements',
			'hasClass',
			'hideElement',
			'once',
			'onDelegate',
			'parseQueryParams',
			'querySelectorAllWrapper',
			'querySelectorWrapper',
			'querySelectorWrapperAll',
			'removeClass',
			'removeElement',
			'setAttribute',
			'setLocalStorageJSON',
			'setStyle',
			'throttle',
			'toggleClass',
			'uuid',
		];

		browserExports.forEach(exportName => {
			assert.strictEqual(
				typeof index[exportName],
				'function',
				`${exportName} should be available from index.js`,
			);
		});
	});

	it('should properly re-export all system utilities', () => {
		const systemExports = [
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
			'writeFileAsync',
		];

		systemExports.forEach(exportName => {
			assert.strictEqual(
				typeof index[exportName],
				'function',
				`${exportName} should be available from index.js`,
			);
		});
	});

	it('should handle conflicting exports correctly', () => {
		// Both browser and system modules export 'uuid'
		// The system version should win due to import order in index.js
		assert.strictEqual(typeof index.uuid, 'function');
		assert.strictEqual(
			index.uuid,
			system.uuid,
			'uuid from index should be the system version',
		);
	});

	it('should maintain all expected exports from both modules', () => {
		// Get unique export names from both modules
		const browserKeys = Object.keys(browser);
		const systemKeys = Object.keys(system);
		const allUniqueKeys = [...new Set([...browserKeys, ...systemKeys])];

		// Verify all unique exports are available
		allUniqueKeys.forEach(key => {
			assert.strictEqual(
				typeof index[key],
				'function',
				`${key} should be exported from index.js`,
			);
		});

		// Verify total count matches unique exports
		assert.strictEqual(
			Object.keys(index).length,
			allUniqueKeys.length,
			'Index should export all unique functions from both modules',
		);
	});

	it('should preserve function identity for browser-only exports', () => {
		const browserOnlyExports = Object.keys(browser).filter(
			key => !Object.keys(system).includes(key),
		);

		browserOnlyExports.forEach(exportName => {
			assert.strictEqual(
				index[exportName],
				browser[exportName],
				`${exportName} should be the same function reference from browser module`,
			);
		});
	});

	it('should preserve function identity for system-only exports', () => {
		const systemOnlyExports = Object.keys(system).filter(
			key => !Object.keys(browser).includes(key),
		);

		systemOnlyExports.forEach(exportName => {
			assert.strictEqual(
				index[exportName],
				system[exportName],
				`${exportName} should be the same function reference from system module`,
			);
		});
	});
});
