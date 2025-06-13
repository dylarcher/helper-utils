import os from 'node:os';

/**
 * Get the system hostname.
 * @returns {string} The hostname.
 */
export function getHostname() {
	return os.hostname();
}
