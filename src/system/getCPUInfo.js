import os from 'node:os';

/**
 * Get CPU information.
 * @param {os.CpuInfo[]} [cpuData] - Optional CPU data for testing purposes
 * @returns {os.CpuInfo[]} An array of objects containing information about each logical CPU core.
 */

export function getCPUInfo(cpuData) {
	const cpus = cpuData || os.cpus();
	return cpus.map((cpu) => ({
		model: cpu.model || 'unknown',
		speed: cpu.speed > 0 ? cpu.speed : 0, // Default to 0 if speed is invalid
		times: cpu.times,
	}));
}
