import os from 'node:os';

/**
 * Retrieves the hostname of the operating system.
 * This function is a wrapper around Node.js's `os.hostname()`.
 * It is specific to Node.js environments.
 *
 * The exact format of the hostname is dependent on the underlying operating system
 * and network configuration.
 *
 * @returns {string} A string representing the hostname of the system (e.g., 'my-laptop', 'server01.example.com').
 * @throws {Error} Throws an error if the underlying system call to get the hostname fails.
 *   This is rare in typical execution environments.
 *
 * @example
 * try {
 *   const hostname = getHostname();
 *   console.info('System Hostname:', hostname);
 *   // Example output: System Hostname: MyComputerName
 *   // or: System Hostname: my-server.local
 * } catch (error) {
 *   console.error('Failed to get hostname:', error.message);
 * }
 */
export function getHostname() {
	// os.hostname() returns the hostname of the operating system as a string.
	// It can throw if the underlying system call fails, though this is uncommon.
	return os.hostname();
}
