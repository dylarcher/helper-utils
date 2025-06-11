/**
 * Get memory usage information.
 * @returns {{totalMemory: number, freeMemory: number}} Total and free system memory in bytes.
 */
export function getMemoryInfo(): {
    totalMemory: number;
    freeMemory: number;
};
