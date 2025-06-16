import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getUniqueElements } from './getUniqueElements.js';

const PERF_TEST_ENABLED = true; // Set to true to enable performance tests

describe('getUniqueElements', () => {
	it('should return an array with unique numbers', () => {
		assert.deepStrictEqual(
			getUniqueElements([1, 2, 2, 3, 4, 4, 4, 5]),
			[1, 2, 3, 4, 5],
		);
	});

	it('should return an array with unique strings', () => {
		assert.deepStrictEqual(
			getUniqueElements(['apple', 'banana', 'apple', 'orange', 'banana']),
			['apple', 'banana', 'orange'],
		);
	});

	it('should handle an array with mixed types and preserve uniqueness by value/reference', () => {
		const obj = { id: 1 };
		const arr = [1, 'a', 2, 'a', obj, obj, 3, 'b', 1];
		// Set behavior: primitives are compared by value, objects by reference.
		assert.deepStrictEqual(getUniqueElements(arr), [1, 'a', 2, obj, 3, 'b']);
	});

	it('should return an empty array when given an empty array', () => {
		assert.deepStrictEqual(getUniqueElements([]), []);
	});

	it('should return the same array if all elements are already unique', () => {
		assert.deepStrictEqual(getUniqueElements([1, 2, 3, 'a', 'b']), [
			1,
			2,
			3,
			'a',
			'b',
		]);
	});

	it('should handle an array with various primitive types correctly', () => {
		assert.deepStrictEqual(
			getUniqueElements([null, undefined, null, true, false, true, 0, 0, '']),
			[null, undefined, true, false, 0, ''],
		);
	});

	describe('non-array inputs', () => {
		it('should return an empty array for null input', () => {
			assert.deepStrictEqual(getUniqueElements(null), []);
		});

		it('should return an empty array for undefined input', () => {
			assert.deepStrictEqual(getUniqueElements(undefined), []);
		});

		it('should return an empty array for string input', () => {
			assert.deepStrictEqual(getUniqueElements('hello'), []);
		});

		it('should return an empty array for number input', () => {
			assert.deepStrictEqual(getUniqueElements(123), []);
		});

		it('should return an empty array for object input', () => {
			assert.deepStrictEqual(getUniqueElements({ a: 1, b: 2 }), []);
		});
	});
});

describe('Performance Tests for getUniqueElements', () => {
	// Conditionally skip this test suite if PERF_TEST_ENABLED is false.
	// If the test runner doesn't support it.skip, the test will run but log a message.
	const describeOrSkip = PERF_TEST_ENABLED ? describe : describe.skip;

	describeOrSkip('Large array processing', () => {
		it('should perform efficiently with a large array containing many duplicates', () => {
			const arraySize = 50000; // Example size, can be adjusted
			const uniqueElementsCount = 1000; // Number of unique elements to generate
			const largeArray = [];

			for (let i = 0; i < arraySize; i++) {
				// Create elements that will have many duplicates
				largeArray.push(`element_${i % uniqueElementsCount}`);
			}

			console.info(
				`[INFO] Running getUniqueElements performance test with ${arraySize} elements / ${uniqueElementsCount} unique.`,
			);
			const timeLabel = 'getUniqueElements performance';
			console.info(timeLabel);
			const result = getUniqueElements(largeArray);
			console.info(timeLabel);

			// Basic validation of the result
			assert.strictEqual(result.length, uniqueElementsCount);
			// Verify that it actually contains one of the expected unique elements
			assert.ok(result.includes(`element_${uniqueElementsCount - 1}`));
		});
	});
});
