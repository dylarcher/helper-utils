/**
 * Returns a new array containing only the unique elements from the input array,
 * preserving the order of first appearance of each element.
 *
 * This function leverages the `Set` object, which inherently stores only unique values.
 *
 * How uniqueness is determined by `Set`:
 * - For primitive types (numbers, strings, booleans, null, undefined, symbols, bigint):
 *   `Set` uses a comparison similar to the `===` operator (or `SameValueZero` algorithm),
 *   meaning `5` is distinct from `"5"`, `null` is distinct from `undefined`. `NaN` is
 *   treated as equal to itself (so only one `NaN` will be kept).
 * - For object types (including arrays, functions):
 *   Uniqueness is based on reference equality. Two distinct objects with the same
 *   content will be considered different and both will be included in the result.
 *   Only if the exact same object reference appears multiple times will it be considered a duplicate.
 *
 * If the input `arr` is not an array, the function returns an empty array.
 *
 * @template T - The type of elements in the array.
 * @param {Array<T>} arr - The input array from which to extract unique elements.
 * @returns {Array<T>} A new array containing only the unique elements from the input array,
 *                     in the order of their first appearance. Returns an empty array if the
 *                     input is not a valid array.
 *
 * @example
 * // Example 1: Array with duplicate numbers
 * const numbers = [1, 2, 2, 3, 4, 4, 5];
 * console.log(getUniqueElements(numbers)); // Output: [1, 2, 3, 4, 5]
 *
 * @example
 * // Example 2: Array with duplicate strings
 * const strings = ["apple", "banana", "apple", "orange", "banana"];
 * console.log(getUniqueElements(strings)); // Output: ["apple", "banana", "orange"]
 *
 * @example
 * // Example 3: Array with mixed types and duplicates
 * const mixed = [1, "hello", true, "hello", 1, null, undefined, null];
 * console.log(getUniqueElements(mixed)); // Output: [1, "hello", true, null, undefined]
 *
 * @example
 * // Example 4: Array with objects (reference equality)
 * const obj1 = { id: 1, name: "A" };
 * const obj2 = { id: 2, name: "B" };
 * const obj3 = { id: 1, name: "A" }; // Different object, same content as obj1
 * const objects = [obj1, obj2, obj1, obj3, obj2];
 * const uniqueObjects = getUniqueElements(objects);
 * console.log(uniqueObjects); // Output: [ { id: 1, name: "A" }, { id: 2, name: "B" }, { id: 1, name: "A" } ]
 * // uniqueObjects will contain obj1, obj2, and obj3 because obj1 and obj3 are different references.
 *
 * @example
 * // Example 5: Array with NaN
 * const nans = [NaN, 1, NaN, 2];
 * console.log(getUniqueElements(nans)); // Output: [NaN, 1, 2] (Only one NaN is kept)
 *
 * @example
 * // Example 6: Empty array
 * console.log(getUniqueElements([])); // Output: []
 *
 * @example
 * // Example 7: Input is not an array
 * console.log(getUniqueElements("not an array")); // Output: []
 * console.log(getUniqueElements(null));         // Output: []
 * console.log(getUniqueElements(undefined));    // Output: []
 */
export function getUniqueElements(arr) {
    // Step 1: Validate the input.
    // Check if the provided `arr` is actually an array.
    if (!Array.isArray(arr)) {
        // If `arr` is not an array (e.g., null, undefined, string, object),
        // return an empty array. This provides a consistent and safe default.
        // An alternative approach could be to throw a TypeError, but returning
        // an empty array is often preferred for utility functions like this.
        return [];
    }
    // Step 2: Create a Set from the array and then convert it back to an array.
    // - `new Set(arr)`: This creates a new Set object from the elements of `arr`.
    //   The `Set` object automatically handles uniqueness: it only stores one instance
    //   of each distinct value.
    //   - For primitive values (numbers, strings, booleans), `Set` uses value equality (similar to `===`, with `NaN` being equal to `NaN`).
    //   - For object references (including arrays, functions), `Set` uses reference equality (two objects are the same only if they are the exact same instance).
    //   The order of elements in the `Set` generally follows their first insertion order from the input array.
    //
    // - `[... ]`: The spread syntax is used here to convert the `Set` object back into a new array.
    //   The elements are taken from the `Set` in their insertion order, effectively preserving
    //   the order of the first appearance of each unique element from the original `arr`.
    return [...new Set(arr)];
}
//# sourceMappingURL=getUniqueElements.js.map