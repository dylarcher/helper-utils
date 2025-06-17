// Import the 'os' module from Node.js.
// The 'os' module provides operating system-related utility methods and properties.
import os from 'node:os';
/**
 * Defines the structure for CPU time statistics.
 * These times are reported in milliseconds.
 * @typedef {object} CpuTimes
 * @property {number} user - Milliseconds the CPU spent in user mode.
 * @property {number} nice - Milliseconds the CPU spent in "nice" mode (niced user processes on POSIX).
 * @property {number} sys - Milliseconds the CPU spent in system (kernel) mode.
 * @property {number} idle - Milliseconds the CPU spent in idle mode.
 * @property {number} irq - Milliseconds the CPU spent servicing interrupts (Interrupt ReQuest).
 */
/**
 * Defines the simplified structure for information about a single logical CPU core.
 * @typedef {object} SimplifiedCpuInfo
 * @property {string} model - The model name of the CPU core (e.g., "Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz").
 *                            Defaults to 'unknown' if the information is not available.
 * @property {number} speed - The clock speed of the CPU core in MHz (e.g., 2200 for 2.2GHz).
 *                            Defaults to 0 if the speed is not available or invalid (e.g., negative).
 * @property {CpuTimes} times - An object containing the cumulative time (in milliseconds) this CPU core
 *                              has spent in various states (user, nice, sys, idle, irq) since system boot.
 */
/**
 * Retrieves simplified information about each logical CPU core on the system.
 * This function is specific to Node.js environments as it relies on `os.cpus()`.
 *
 * It calls `os.cpus()` to get raw CPU data and then maps this data to a more
 * consistent and slightly simplified structure defined by `SimplifiedCpuInfo`.
 *
 * The `os.cpus()` method returns an array of objects, each representing a logical CPU core.
 * Each object contains details like `model`, `speed` (in MHz), and a `times` object
 * (with `user`, `nice`, `sys`, `idle`, `irq` properties in milliseconds).
 * This function provides default values ('unknown' for model, 0 for speed) if the
 * underlying data is missing or invalid for those fields.
 *
 * @param {import('node:os').CpuInfo[]} [cpuData] - Optional. Pre-fetched CPU data, typically
 *   an array of `os.CpuInfo` objects. This parameter is primarily intended for testing
 *   or for scenarios where `os.cpus()` data has already been retrieved. If not provided
 *   or if falsy (excluding `null`), the function will call `os.cpus()` internally.
 *   If `null` is explicitly passed, an empty array is returned.
 * @returns {SimplifiedCpuInfo[]} An array of `SimplifiedCpuInfo` objects. Each object
 *   corresponds to a logical CPU core found on the system. Returns an empty array if
 *   `os.cpus()` returns no data, if `cpuData` is explicitly `null`, or if the provided
 *   `cpuData` is an empty array.
 *
 * @example
 * const cpuInformation = getCPUInfo();
 *
 * if (cpuInformation.length > 0) {
 *   console.log(`Total logical CPU cores: ${cpuInformation.length}`);
 *   cpuInformation.forEach((cpu, index) => {
 *     console.log(`--- Core ${index + 1} ---`);
 *     console.log(`  Model: ${cpu.model}`);
 *     console.log(`  Speed: ${cpu.speed} MHz`);
 *     console.log(`  Times (ms):`);
 *     console.log(`    User: ${cpu.times.user}`);
 *     console.log(`    Nice: ${cpu.times.nice}`);
 *     console.log(`    Sys:  ${cpu.times.sys}`);
 *     console.log(`    Idle: ${cpu.times.idle}`);
 *     console.log(`    IRQ:  ${cpu.times.irq}`);
 *   });
 * } else {
 *   console.log('No CPU information could be retrieved.');
 * }
 *
 * // Example of what one object in the returned array might look like:
 * // {
 * //   model: 'Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz',
 * //   speed: 2592, // Speed in MHz
 * //   times: {
 * //     user: 5363800, // Milliseconds spent in user mode
 * //     nice: 0,       // Milliseconds spent in nice mode
 * //     sys: 2213170,  // Milliseconds spent in system mode
 * //     idle: 41370410, // Milliseconds spent in idle mode
 * //     irq: 0         // Milliseconds spent servicing interrupts
 * //   }
 * // }
 */
export function getCPUInfo(cpuData) {
    // Step 1: Handle explicit null input for `cpuData`.
    // If `cpuData` is explicitly passed as `null`, return an empty array immediately.
    if (cpuData === null) {
        return [];
    }
    // Step 2: Determine the source of CPU information.
    // If `cpuData` is provided (and is not null, due to the check above), use it.
    // Otherwise, call `os.cpus()` to fetch live CPU information from the operating system.
    // `os.cpus()` returns an array of `os.CpuInfo` objects, one for each logical CPU core.
    // If `cpuData` is `undefined` or any other falsy value (except `null`), `os.cpus()` is called.
    const cpus = cpuData || os.cpus();
    // Step 3: Check if CPU data is available.
    // If `cpus` is falsy (e.g., `os.cpus()` somehow returned `null` or `undefined`, though typically it returns an array)
    // or if the `cpus` array is empty, return an empty array.
    if (!cpus || cpus.length === 0) {
        return [];
    }
    // Step 4: Map the raw CPU data to the `SimplifiedCpuInfo` structure.
    // Iterate over each `cpu` object in the `cpus` array.
    return cpus.map(cpu => ({
        // `cpu.model`: A string identifying the CPU model. Provide 'unknown' if not available.
        model: cpu.model || 'unknown',
        // `cpu.speed`: CPU clock speed in MHz. Ensure speed is a positive number; default to 0 if it's not
        // (e.g., if `cpu.speed` is 0, negative, or not a number, though `os.CpuInfo` types it as number).
        speed: cpu.speed > 0 ? cpu.speed : 0,
        // `cpu.times`: An object containing CPU time statistics (user, nice, sys, idle, irq) in milliseconds.
        // This object is copied directly. Its structure matches the `CpuTimes` typedef.
        times: cpu.times,
    }));
}
//# sourceMappingURL=getCPUInfo.js.map