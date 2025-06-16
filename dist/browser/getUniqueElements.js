/**
 * Returns an array with unique elements from the input array.
 *
 * @param {Array<any>} arr - The input array.
 * @returns {Array<any>} A new array containing only the unique elements from the input array,
 * maintaining the order of first appearance. Returns an empty array if the input is not an array.
 */
export function getUniqueElements(arr) {
	if (!Array.isArray(arr)) {
		// Consistent with common utility libraries, return empty for invalid input.
		// Alternatively, could throw TypeError('Input must be an array');
		return [];
	}
	return [...new Set(arr)];
}
//# sourceMappingURL=getUniqueElements.js.map
