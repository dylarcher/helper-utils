/**
 * Retrieves basic operating system and browser environment information.
 * This function is intended for use in browser environments and relies on the
 * `navigator` object. The information provided may be less detailed than
 * OS information available in Node.js environments and can potentially be spoofed by the user.
 *
 * @returns {{platform: string, userAgent: string, language: string, vendor: string, connection?: string, error?: string}}
 *   An object containing available browser and OS-related information.
 *   - `platform`: The platform reported by the browser (e.g., 'Win32', 'MacIntel', 'Linux x86_64').
 *   - `userAgent`: The full user-agent string from the browser.
 *   - `language`: The preferred language of the user, usually the language of the browser UI.
 *   - `vendor`: The vendor name of the browser.
 *   - `connection` (optional): Information about the network connection, if available (e.g., 'WiFi', '4g').
 *     Note: `navigator.connection` properties might not be available in all browsers or specific properties might be missing.
 *   - `error` (optional): Error message if `navigator` object is not available.
 *   Returns default "unknown" values or an error message if `navigator` object is not available.
 *
 * @example
 * const browserOSInfo = getOSInfo();
 * console.info(`Platform: ${browserOSInfo.platform}`);
 * console.info(`User Agent: ${browserOSInfo.userAgent}`);
 * console.info(`Language: ${browserOSInfo.language}`);
 * console.info(`Browser Vendor: ${browserOSInfo.vendor}`);
 * if (browserOSInfo.connection) {
 *   console.info(`Connection Type: ${browserOSInfo.connection}`);
 * }
 *
 * // Example Output (will vary by browser and OS):
 * // Platform: Win32
 * // User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36
 * // Language: en-US
 * // Browser Vendor: Google Inc.
 * // Connection Type: effective-type: 4g, rtt: 50, downlink: 10, saveData: false (details vary)
 */
export function getOSInfo() {
	// Check if we're in a Node.js environment first
	if (
		typeof process !== 'undefined' &&
		process.versions &&
		process.versions.node
	) {
		return {
			platform: 'unknown',
			userAgent: 'unknown',
			language: 'unknown',
			vendor: 'unknown',
			connection: 'unknown',
			error:
				'Navigator object not available. This function is intended for browser environments.',
		};
	}
	if (typeof navigator !== 'undefined') {
		const connection =
			/** @type {any} */ (navigator).connection ||
			/** @type {any} */ (navigator).mozConnection ||
			/** @type {any} */ (navigator).webkitConnection;
		let connectionInfo = 'unknown';
		if (connection) {
			// Construct a string from available connection properties
			const parts = [];
			if (connection.effectiveType) {
				parts.push(`effective-type: ${connection.effectiveType}`);
			}
			if (connection.rtt) {
				parts.push(`rtt: ${connection.rtt}`);
			}
			if (connection.downlink) {
				parts.push(`downlink: ${connection.downlink}`);
			}
			if (typeof connection.saveData !== 'undefined') {
				parts.push(`saveData: ${connection.saveData}`);
			}
			connectionInfo =
				parts.length > 0 ? parts.join(', ') : 'available (no specific details)';
		}
		return {
			platform: navigator.platform || 'unknown',
			userAgent: navigator.userAgent || 'unknown',
			language: navigator.language || 'unknown',
			vendor: navigator.vendor || 'unknown',
			connection: connectionInfo,
		};
	}
	return {
		platform: 'unknown',
		userAgent: 'unknown',
		language: 'unknown',
		vendor: 'unknown',
		connection: 'unknown',
		error:
			'Navigator object not available. This function is intended for browser environments.',
	};
}
//# sourceMappingURL=getOSInfo.js.map
