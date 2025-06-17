/**
 * Executes a shell command asynchronously using Node.js's `child_process.exec`.
 * This function is Node.js specific.
 *
 * **Security Warning:** Building commands from external input can be dangerous.
 * Always sanitize inputs to prevent command injection vulnerabilities. Consider using
 * `child_process.spawn` for more complex scenarios or when dealing with untrusted input.
 *
 * @param {string} command - The command to execute (e.g., 'ls -lh' or 'echo "Hello"').
 * @param {import('node:child_process').ExecOptions} [options] - Optional.
 *   Standard options for `child_process.exec` (e.g., `cwd`, `env`, `shell`, `timeout`, `maxBuffer`).
 * @returns {Promise<{stdout: string, stderr: string}>} A promise that resolves with an object
 *   containing `stdout` and `stderr` as strings from the executed command.
 * @throws {Error & {code?: number, signal?: string, stdout?: string, stderr?: string}}
 *   Rejects the promise if the command fails to execute or exits with a non-zero code.
 *   The error object is typically an instance of `Error` and may include properties like:
 *   - `code` (number): The exit code of the child process.
 *   - `signal` (string): The signal that terminated the process (e.g., 'SIGTERM').
 *   - `stdout` (string): The standard output from the command before it errored.
 *   - `stderr` (string): The standard error output from the command.
 *   It can also throw if `command` is empty or `options` are invalid.
 *
 * @example
 * async function listDirectoryContents() {
 *   try {
 *     const { stdout, stderr } = await execAsync('ls -la');
 *     if (stderr) {
 *       console.warn('Command produced stderr:', stderr);
 *     }
 *     console.info('Directory Contents:\n', stdout);
 *   } catch (error) {
 *     console.error(`Command failed. Exit code: ${error.code}`);
 *     console.error('Error stdout:', error.stdout); // Output before error
 *     console.error('Error stderr:', error.stderr); // Error messages
 *     // error.message usually contains the command, exit code, stdout and stderr.
 *   }
 * }
 * // listDirectoryContents();
 *
 * async function executeWithOption() {
 *   try {
 *     // Example: using 'echo' command in a specific directory (though 'echo' is not path-dependent)
 *     const { stdout } = await execAsync('echo Hello from subfolder', { cwd: './src' });
 *     console.info(stdout.trim()); // "Hello from subfolder"
 *   } catch (error) {
 *     console.error('Failed to execute with options:', error.message);
 *   }
 * }
 * // executeWithOption();
 *
 * async function exampleFailingCommand() {
 *   try {
 *     await execAsync('command_that_does_not_exist');
 *   } catch (error) {
 *     console.error(`Execution failed: ${error.message}`);
 *     // Typically error.code will be non-zero (e.g., 127 for command not found on POSIX)
 *     // error.stderr might contain "command not found" or similar.
 *   }
 * }
 * // exampleFailingCommand();
 */
export function execAsync(command: string, options?: import("node:child_process").ExecOptions): Promise<{
    stdout: string;
    stderr: string;
}>;
