import os from 'node:os';

/**
 * Retrieves information about the system's memory usage.
 * This function is a wrapper around Node.js's `os.totalmem()` and `os.freemem()`.
 * It is specific to Node.js environments.
 *
 * - `totalMemory`: The total amount of system memory in bytes.
 * - `freeMemory`: The amount of free system memory in bytes.
 *
 * @returns {{totalMemory: number, freeMemory: number}} An object containing the total
 *   and free system memory in bytes.
 * @throws {Error} Throws an error if the underlying system calls to get memory
 *   information fail. This is rare in typical execution environments.
 *
 * @example
 * try {
 *   const memoryInfo = getMemoryInfo();
 *   console.info('System Memory Information:');
 *   console.info(`  Total Memory: ${(memoryInfo.totalMemory / (1024 * 1024 * 1024)).toFixed(2)} GB`);
 *   console.info(`  Free Memory:  ${(memoryInfo.freeMemory / (1024 * 1024 * 1024)).toFixed(2)} GB`);
 *   console.info(`  Used Memory:  ${((memoryInfo.totalMemory - memoryInfo.freeMemory) / (1024 * 1024 * 1024)).toFixed(2)} GB`);
 *   console.info(`  Raw total (bytes): ${memoryInfo.totalMemory}`);
 *   console.info(`  Raw free (bytes): ${memoryInfo.freeMemory}`);
 * } catch (error) {
 *   console.error('Failed to get memory information:', error.message);
 * }
 *
 * // Example output:
 * // System Memory Information:
 * //   Total Memory: 16.00 GB
 * //   Free Memory:  8.50 GB
 * //   Used Memory:  7.50 GB
 * //   Raw total (bytes): 17179869184
 * //   Raw free (bytes): 9126805504
 * // (Actual values will vary based on the system)
 */
export function getMemoryInfo() {
	// os.totalmem() and os.freemem() return the total and free system memory in bytes.
	// These functions can throw if the underlying system calls fail, though this is uncommon.
	return {
		totalMemory: os.totalmem(),
		freeMemory: os.freemem(),
	};
}
