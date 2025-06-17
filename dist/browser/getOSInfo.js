/**
 * Retrieves basic operating system (OS) and browser environment information.
 * This function is designed for client-side execution within a web browser and relies
 * heavily on the `navigator` object.
 *
 * The information gathered includes:
 * - Platform: From `navigator.platform`. This can indicate the general class of device or OS (e.g., "Win32", "MacIntel", "Linux x86_64").
 * - User Agent: From `navigator.userAgent`. A string sent by the browser containing details about the browser, OS, and rendering engine.
 * - Language: From `navigator.language`. The preferred language of the user, typically the browser's UI language.
 * - Vendor: From `navigator.vendor`. The vendor name of the browser (e.g., "Google Inc.", "Apple Computer, Inc.").
 * - Connection: Information about the network connection from `navigator.connection` (if available),
 *   such as effective type, round-trip time (RTT), and downlink speed.
 *
 * Important Considerations:
 * - Accuracy: The information, especially `navigator.userAgent` and `navigator.platform`, can be
 *   easily spoofed by browser extensions or user settings. It should not be solely relied upon for critical security or functionality decisions.
 * - Privacy: Modern browsers are increasingly restricting the amount of detail available through these properties
 *   to protect user privacy (e.g., User-Agent reduction). `navigator.userAgentData` (User-Agent Client Hints API)
 *   is a newer API designed to provide this information in a more privacy-preserving way, but this function
 *   currently uses the traditional `navigator` properties.
 * - Availability: If the `navigator` object is not available (e.g., in some non-browser environments or
 *   highly restricted contexts), or if specific properties are missing, the function returns "unknown" for those fields
 *   and may include an error message.
 * - Node.js: This function explicitly checks for Node.js environments and returns "unknown" with an error message,
 *   as `navigator` is a browser-specific object.
 *
 * @returns {{platform: string, userAgent: string, language: string, vendor: string, connection?: string, error?: string}}
 *   An object containing the retrieved browser and OS-related information.
 *   - `platform`: The platform string (e.g., 'Win32', 'MacIntel', 'iPhone'). Defaults to "unknown".
 *   - `userAgent`: The full user-agent string. Defaults to "unknown".
 *   - `language`: The browser's language (e.g., 'en-US'). Defaults to "unknown".
 *   - `vendor`: The browser's vendor string (e.g., 'Google Inc.'). Defaults to "unknown".
 *   - `connection` (optional): A string summarizing available network connection details (e.g.,
 *     'effective-type: 4g, rtt: 50, downlink: 10, saveData: false'). Defaults to "unknown".
 *     This field is constructed from properties of the `navigator.connection` object.
 *   - `error` (optional): An error message if `navigator` is not available or if run in Node.js.
 *
 * @example
 * const browserInfo = getOSInfo();
 * console.log(`Platform: ${browserInfo.platform}`);
 * console.log(`User Agent: ${browserInfo.userAgent}`);
 * console.log(`Language: ${browserInfo.language}`);
 * console.log(`Vendor: ${browserInfo.vendor}`);
 * if (browserInfo.connection && browserInfo.connection !== "unknown") {
 *   console.log(`Connection details: ${browserInfo.connection}`);
 * }
 * if (browserInfo.error) {
 *   console.warn(`Error retrieving info: ${browserInfo.error}`);
 * }
 *
 * // Example Output (will vary significantly based on browser, OS, and network):
 * // Platform: Win32
 * // User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
 * // Language: en-US
 * // Vendor: Google Inc.
 * // Connection details: effective-type: 4g, rtt: 100, downlink: 7.55, saveData: false
 */
export function getOSInfo() {
    // First, check if the code is running in a Node.js environment.
    // `process`, `process.versions`, and `process.versions.node` are characteristic of Node.js.
    if (typeof process !== 'undefined' &&
        process.versions &&
        process.versions.node) {
        // If in Node.js, `navigator` object is not available.
        // Return default "unknown" values and an error message.
        return {
            platform: 'unknown',
            userAgent: 'unknown',
            language: 'unknown',
            vendor: 'unknown',
            connection: 'unknown',
            error: 'Navigator object not available. This function is intended for browser environments.',
        };
    }
    // Check if the `navigator` object is available (standard in browser environments).
    if (typeof navigator !== 'undefined') {
        // Attempt to get network connection information.
        // The Network Information API (`navigator.connection`) provides details about the system's network connection.
        // It might be prefixed in older browsers (`mozConnection`, `webkitConnection`).
        const connection = 
        /** @type {any} */ (navigator).connection || // Standard
            /** @type {any} */ (navigator).mozConnection || // Firefox legacy
            /** @type {any} */ (navigator).webkitConnection; // WebKit legacy
        let connectionInfo = 'unknown'; // Default value if connection API is not available or has no details.
        if (connection) {
            // If the connection object exists, try to extract useful properties.
            const parts = [];
            if (connection.effectiveType) {
                // `effectiveType`: e.g., 'slow-2g', '2g', '3g', '4g'. Indicates effective connection speed.
                parts.push(`effective-type: ${connection.effectiveType}`);
            }
            if (connection.rtt) {
                // `rtt`: Round-trip time in milliseconds.
                parts.push(`rtt: ${connection.rtt}`);
            }
            if (connection.downlink) {
                // `downlink`: Effective bandwidth estimate in megabits per second.
                parts.push(`downlink: ${connection.downlink}`);
            }
            if (typeof connection.saveData !== 'undefined') {
                // `saveData`: Boolean indicating if the user has enabled data saving mode.
                parts.push(`saveData: ${connection.saveData}`);
            }
            // If any parts were collected, join them into a string. Otherwise, indicate API is available but no specifics.
            connectionInfo =
                parts.length > 0 ? parts.join(', ') : 'available (no specific details)';
        }
        // Construct the return object with information from the navigator object.
        // Provide "unknown" as a fallback if a specific navigator property is not available (e.g., undefined or null).
        return {
            // `navigator.platform`: A string representing the platform on which the browser is running (e.g., "Win32", "MacIntel").
            // Can be misleading and is being deprecated in favor of User-Agent Client Hints.
            platform: navigator.platform || 'unknown',
            // `navigator.userAgent`: The user-agent string for the current browser.
            // Subject to User-Agent reduction, which limits its granularity for privacy.
            userAgent: navigator.userAgent || 'unknown',
            // `navigator.language`: The preferred language of the user, usually the language of the browser UI (e.g., "en-US").
            language: navigator.language || 'unknown',
            // `navigator.vendor`: A string representing the vendor of the current browser (e.g., "Google Inc.").
            vendor: navigator.vendor || 'unknown',
            // The processed connection information string.
            connection: connectionInfo,
        };
    }
    // If `navigator` object itself is not available (highly unlikely in a standard browser, but a fallback).
    return {
        platform: 'unknown',
        userAgent: 'unknown',
        language: 'unknown',
        vendor: 'unknown',
        connection: 'unknown',
        error: 'Navigator object not available. This function is intended for browser environments.',
    };
}
//# sourceMappingURL=getOSInfo.js.map