import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Import functions directly and verify they work
import * as allExports from './utils.js';
import { getUniqueElements } from './utils.js';

describe('utils', () => {
	it('should export all expected functions correctly', () => {
		// Test that all exports are functions
		const expectedExports = ['getUniqueElements'];

		expectedExports.forEach(exportName => {
			assert.strictEqual(typeof allExports[exportName], 'function');
		});

		// Check total number of exports matches expected
		assert.strictEqual(Object.keys(allExports).length, expectedExports.length);

		// Test some specific functions have the right names
		assert.strictEqual(allExports.getUniqueElements.name, 'getUniqueElements');
	});

	it('should export getUniqueElements function', () => {
		assert.strictEqual(typeof getUniqueElements, 'function');
	});
});
