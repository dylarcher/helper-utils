import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as utils from './utils.js';

describe('utils exports', () => {
	it('should export all expected functions correctly', () => {
		// Create array of expected exports
		const expectedExports = ['getUniqueElements'];

		// Verify all expected exports exist
		expectedExports.forEach(functionName => {
			assert.strictEqual(
				typeof utils[functionName],
				'function',
				`${functionName} should be exported as a function`,
			);
		});

		// Verify the total count of exports
		assert.strictEqual(
			Object.keys(utils).length,
			expectedExports.length,
			'Utils exports count should match expected',
		);

		// Test specific exports
		assert.strictEqual(utils.getUniqueElements.name, 'getUniqueElements');

		// Test that the function works when imported from the barrel
		const result = utils.getUniqueElements([1, 2, 2, 3]);
		assert.deepStrictEqual(
			result,
			[1, 2, 3],
			'Function should work when imported from barrel',
		);
	});
});
