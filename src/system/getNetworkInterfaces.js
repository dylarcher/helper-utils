import os from 'node:os';

/**
 * Retrieves detailed information about the system's network interfaces.
 * This function is a wrapper around Node.js's `os.networkInterfaces()`.
 * It is specific to Node.js environments.
 *
 * The returned object has keys representing the network interface name (e.g., 'eth0', 'lo', 'Wi-Fi').
 * Each key maps to an array of `NetworkInterfaceInfo` objects, as each interface can have
 * multiple assigned network addresses (e.g., an IPv4 and an IPv6 address).
 *
 * @returns {Record<string, import('node:os').NetworkInterfaceInfo[]> | undefined} An object where each key
 *   is a network interface name (e.g., 'en0', 'lo0') and the value is an array of objects,
 *   each describing an assigned network address for that interface.
 *   Returns `undefined` if the system call fails (though `os.networkInterfaces` typically returns
 *   an empty object or available interfaces even on error, specific error throws are rare).
 * @throws {Error} Throws an error if the underlying system call to get network interface
 *   information fundamentally fails (this is highly unlikely in most environments).
 *
 * @example
 * try {
 *   const interfaces = getNetworkInterfaces();
 *   if (interfaces) {
 *     console.info('Network Interface Information:');
 *     for (const interfaceName in interfaces) {
 *       console.info(`  Interface: ${interfaceName}`);
 *       const interfaceDetails = interfaces[interfaceName];
 *       if (interfaceDetails) {
 *         interfaceDetails.forEach((detail, index) => {
 *           console.info(`    Address ${index + 1}:`);
 *           console.info(`      Family: ${detail.family}`);       // e.g., 'IPv4' or 'IPv6'
 *           console.info(`      Address: ${detail.address}`);    // e.g., '192.168.1.100'
 *           console.info(`      Netmask: ${detail.netmask}`);    // e.g., '255.255.255.0'
 *           console.info(`      MAC: ${detail.mac}`);          // e.g., '01:23:45:67:89:ab'
 *           console.info(`      Internal: ${detail.internal}`);  // true if a loopback interface
 *           if (detail.cidr) {
 *             console.info(`      CIDR: ${detail.cidr}`);        // e.g., '192.168.1.100/24'
 *           }
 *         });
 *       }
 *     }
 *   } else {
 *     console.info('No network interface information available or call failed.');
 *   }
 * } catch (error) {
 *   console.error('Failed to get network interfaces:', error.message);
 * }
 *
 * // Example partial output:
 * // Network Interface Information:
 * //   Interface: lo0
 * //     Address 1:
 * //       Family: IPv6
 * //       Address: ::1
 * //       Netmask: ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff
 * //       MAC: 00:00:00:00:00:00
 * //       Internal: true
 * //       CIDR: ::1/128
 * //     Address 2:
 * //       Family: IPv4
 * //       Address: 127.0.0.1
 * //       Netmask: 255.0.0.0
 * //       MAC: 00:00:00:00:00:00
 * //       Internal: true
 * //       CIDR: 127.0.0.1/8
 * //   Interface: en0
 * //     Address 1:
 * //       Family: IPv4
 * //       Address: 192.168.1.xyz
 * //       Netmask: 255.255.255.0
 * //       MAC: ab:cd:ef:12:34:56
 * //       Internal: false
 * //       CIDR: 192.168.1.xyz/24
 * //     Address 2:
 * //       Family: IPv6
 * //       Address: fe80::abc:def:1234:5678
 * //       Netmask: ffff:ffff:ffff:ffff::
 * //       MAC: ab:cd:ef:12:34:56
 * //       Internal: false
 * //       CIDR: fe80::abc:def:1234:5678/64
 */
export function getNetworkInterfaces() {
	// os.networkInterfaces() returns an object mapping network interface names
	// to arrays of NetworkInterfaceInfo objects.
	// It can, in very rare cases, throw if the system call fails.
	// It might return undefined in some edge cases according to some typings, though typically an object.
	return /** @type {Record<string, import('node:os').NetworkInterfaceInfo[]> | undefined} */ (
		os.networkInterfaces()
	);
}
