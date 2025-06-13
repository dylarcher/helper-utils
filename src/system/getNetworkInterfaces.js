import os from 'node:os';

/**
 * Get network interface information.
 * @returns {NodeJS.Dict<os.NetworkInterfaceInfo[]>} An object containing network interface information.
 */
export function getNetworkInterfaces() {
	return os.networkInterfaces();
}
