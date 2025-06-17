/**
 * Retrieves the hostname of the operating system on which the Node.js process is running.
 * This function is a direct wrapper around Node.js's `os.hostname()` method and is
 * intended for use in Node.js environments.
 *
 * The hostname is typically a string that identifies the machine on a network.
 * Its exact format and value depend on the operating system's configuration and
 * network settings. It could be a simple name (e.g., "my-laptop"), a name with a local
 * domain (e.g., "my-server.local"), or a fully qualified domain name (FQDN)
 * (e.g., "webserver01.mydomain.com").
 *
 * @returns {string} A string representing the hostname of the system.
 *                   For example, 'my-pc', 'server.example.org'.
 * @throws {Error | SystemError} Throws an error if the underlying system call to retrieve
 *                               the hostname fails. This is generally rare in typical
 *                               Node.js execution environments but could happen due to
 *                               unusual system configurations or OS-level issues.
 *                               The error object may have properties like `code`, `syscall`.
 *
 * @example
 * // Example 1: Get and log the system hostname
 * try {
 *   const currentHostname = getHostname();
 *   console.log('Current system hostname is:', currentHostname);
 *   // Possible outputs (will vary based on your system):
 *   // "Current system hostname is: MyComputerName"
 *   // "Current system hostname is: my-linux-box"
 *   // "Current system hostname is: server-prod-01.example.com"
 * } catch (error) {
 *   console.error('Could not retrieve hostname:', error.message);
 *   // This error handling is for completeness; os.hostname() failures are uncommon.
 * }
 *
 * @example
 * // Example 2: Using hostname in a configuration or logging context
 * // function getAppConfig() {
 * //   const hostname = getHostname(); // Assuming it won't throw for this simple example
 * //   return {
 * //     appName: 'MyCoolApp',
 * //     runningOnHost: hostname,
 * //     logFile: `/var/log/${hostname}-app.log`
 * //   };
 * // }
 * // const appConfig = getAppConfig();
 * // console.log('Application Configuration:', appConfig);
 */
export function getHostname(): string;
