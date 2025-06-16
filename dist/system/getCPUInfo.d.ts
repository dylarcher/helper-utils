/**
 * @typedef {object} CpuTimes
 * @property {number} user - The number of milliseconds the CPU has spent in user mode.
 * @property {number} nice - The number of milliseconds the CPU has spent in nice mode.
 * @property {number} sys - The number of milliseconds the CPU has spent in sys mode.
 * @property {number} idle - The number of milliseconds the CPU has spent in idle mode.
 * @property {number} irq - The number of milliseconds the CPU has spent in irq mode.
 */
/**
 * @typedef {object} SimplifiedCpuInfo
 * @property {string} model - The model name of the CPU. Defaults to 'unknown' if not available.
 * @property {number} speed - The clock speed of the CPU in MHz. Defaults to 0 if the speed is invalid or not available.
 * @property {CpuTimes} times - An object detailing the CPU time spent in different modes (user, nice, sys, idle, irq).
 */
/**
 * Retrieves information about each logical CPU core on the system.
 * This function is specific to Node.js environments as it uses `os.cpus()`.
 * It returns a simplified structure for each CPU compared to the raw `os.CpuInfo`.
 *
 * @param {import('node:os').CpuInfo[]} [cpuData] - Optional. Pre-fetched CPU data, primarily for testing purposes.
 *   If not provided, `os.cpus()` will be called.
 * @returns {SimplifiedCpuInfo[]} An array of objects, where each object contains `model`, `speed`,
 *   and `times` (an object with user, nice, sys, idle, irq times) for a logical CPU core.
 *   Returns an empty array if `os.cpus()` returns an empty array or if `cpuData` is an empty array.
 *
 * @example
 * const cpuInfo = getCPUInfo();
 * if (cpuInfo.length > 0) {
 *   console.info(`System has ${cpuInfo.length} logical CPU cores.`);
 *   const firstCpu = cpuInfo[0];
 *   console.info('First CPU Core Info:');
 *   console.info(`  Model: ${firstCpu.model}`);
 *   console.info(`  Speed: ${firstCpu.speed} MHz`);
 *   console.info(`  Times (ms):`);
 *   console.info(`    User: ${firstCpu.times.user}`);
 *   console.info(`    Idle: ${firstCpu.times.idle}`);
 *   // ... and other times (nice, sys, irq)
 * } else {
 *   console.info('Could not retrieve CPU information.');
 * }
 *
 * // Example structure of a returned object in the array:
 * // {
 * //   model: 'Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz',
 * //   speed: 2208, // or some other speed value
 * //   times: {
 * //     user: 1234560,
 * //     nice: 0,
 * //     sys: 876540,
 * //     idle: 98765430,
 * //     irq: 0
 * //   }
 * // }
 */
export function getCPUInfo(cpuData?: import("node:os").CpuInfo[]): SimplifiedCpuInfo[];
export type CpuTimes = {
    /**
     * - The number of milliseconds the CPU has spent in user mode.
     */
    user: number;
    /**
     * - The number of milliseconds the CPU has spent in nice mode.
     */
    nice: number;
    /**
     * - The number of milliseconds the CPU has spent in sys mode.
     */
    sys: number;
    /**
     * - The number of milliseconds the CPU has spent in idle mode.
     */
    idle: number;
    /**
     * - The number of milliseconds the CPU has spent in irq mode.
     */
    irq: number;
};
export type SimplifiedCpuInfo = {
    /**
     * - The model name of the CPU. Defaults to 'unknown' if not available.
     */
    model: string;
    /**
     * - The clock speed of the CPU in MHz. Defaults to 0 if the speed is invalid or not available.
     */
    speed: number;
    /**
     * - An object detailing the CPU time spent in different modes (user, nice, sys, idle, irq).
     */
    times: CpuTimes;
};
