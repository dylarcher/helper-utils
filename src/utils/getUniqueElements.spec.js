import { getUniqueElements } from './getUniqueElements.js';

const PERF_TEST_ENABLED = false; // Set to true to enable performance tests

describe('getUniqueElements', () => {
  it('should return an array with unique numbers', () => {
    expect(getUniqueElements([1, 2, 2, 3, 4, 4, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return an array with unique strings', () => {
    expect(getUniqueElements(['apple', 'banana', 'apple', 'orange', 'banana'])).toEqual(['apple', 'banana', 'orange']);
  });

  it('should handle an array with mixed types and preserve uniqueness by value/reference', () => {
    const obj = { id: 1 };
    const arr = [1, 'a', 2, 'a', obj, obj, 3, 'b', 1];
    // Set behavior: primitives are compared by value, objects by reference.
    expect(getUniqueElements(arr)).toEqual([1, 'a', 2, obj, 3, 'b']);
  });

  it('should return an empty array when given an empty array', () => {
    expect(getUniqueElements([])).toEqual([]);
  });

  it('should return the same array if all elements are already unique', () => {
    expect(getUniqueElements([1, 2, 3, 'a', 'b'])).toEqual([1, 2, 3, 'a', 'b']);
  });

  it('should handle an array with various primitive types correctly', () => {
    expect(getUniqueElements([null, undefined, null, true, false, true, 0, 0, ''])).toEqual([null, undefined, true, false, 0, '']);
  });

  describe('non-array inputs', () => {
    it('should return an empty array for null input', () => {
      expect(getUniqueElements(null)).toEqual([]);
    });

    it('should return an empty array for undefined input', () => {
      expect(getUniqueElements(undefined)).toEqual([]);
    });

    it('should return an empty array for string input', () => {
      expect(getUniqueElements('hello')).toEqual([]);
    });

    it('should return an empty array for number input', () => {
      expect(getUniqueElements(123)).toEqual([]);
    });

    it('should return an empty array for object input', () => {
      expect(getUniqueElements({ a: 1, b: 2 })).toEqual([]);
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

      console.log(`[INFO] Running getUniqueElements performance test with ${arraySize} elements / ${uniqueElementsCount} unique.`);
      console.time('getUniqueElements performance');
      const result = getUniqueElements(largeArray);
      console.timeEnd('getUniqueElements performance');

      // Basic validation of the result
      expect(result.length).toBe(uniqueElementsCount);
      // Verify that it actually contains one of the expected unique elements
      expect(result.includes(`element_${uniqueElementsCount - 1}`)).toBe(true);
    });
  });
});
