import os from 'node:os';

/**
 * Get CPU information.
 * @returns {os.CpuInfo[]} An array of objects containing information about each logical CPU core.
 */
export function getCPUInfo() {
	return os.cpus();
}
