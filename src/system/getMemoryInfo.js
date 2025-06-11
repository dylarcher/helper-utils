import os from 'node:os'

/**
 * Get memory usage information.
 * @returns {{totalMemory: number, freeMemory: number}} Total and free system memory in bytes.
 */
export function getMemoryInfo() {
    return {
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
    }
}