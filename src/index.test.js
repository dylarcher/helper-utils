import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Import from the main index.js file to test it directly
import * as allExports from './index.js';

// Import individual modules for comparison
import * as browserExports from './browser.js';
import * as systemExports from './system.js';

describe('index.js exports', () => {
	it('should re-export all browser functions', () => {
		const expectedBrowserExports = [
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

		expectedBrowserExports.forEach((exportName) => {
			assert.strictEqual(
				typeof allExports[exportName],
				'function',
				`${exportName} should be re-exported from index.js`,
			);

			// Verify it's the same function as in browser.js
			assert.strictEqual(
				allExports[exportName],
				browserExports[exportName],
				`${exportName} should be the same function from browser.js`,
			);
		});
	});

	it('should re-export all system functions', () => {
		const expectedSystemExports = [
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

		expectedSystemExports.forEach((exportName) => {
			assert.strictEqual(
				typeof allExports[exportName],
				'function',
				`${exportName} should be re-exported from index.js`,
			);

			// Verify it's the same function as in system.js
			assert.strictEqual(
				allExports[exportName],
				systemExports[exportName],
				`${exportName} should be the same function from system.js`,
			);
		});
	});

	it('should handle uuid function name collision correctly', () => {
		// Both browser and system export uuid, verify one is accessible
		assert.strictEqual(typeof allExports.uuid, 'function');

		// Since system.js is imported after browser.js in index.js,
		// the system uuid should override the browser uuid
		assert.strictEqual(
			allExports.uuid,
			systemExports.uuid,
			'uuid should be the system version due to import order',
		);
	});

	it('should export the expected total number of functions', () => {
		const browserCount = Object.keys(browserExports).length;
		const systemCount = Object.keys(systemExports).length;

		// Subtract 1 because uuid is exported by both but only counts once
		const expectedTotal = browserCount + systemCount - 1;

		assert.strictEqual(
			Object.keys(allExports).length,
			expectedTotal,
			`Total exports should be ${expectedTotal} (browser: ${browserCount} + system: ${systemCount} - 1 duplicate uuid)`,
		);
	});

	it('should maintain function aliases from browser module', () => {
		// Verify that querySelectorWrapperAll is still an alias for querySelectorAllWrapper
		assert.strictEqual(
			allExports.querySelectorWrapperAll,
			allExports.querySelectorAllWrapper,
			'querySelectorWrapperAll should be an alias for querySelectorAllWrapper',
		);
	});
});
