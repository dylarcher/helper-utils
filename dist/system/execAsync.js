// Import the `exec` function from Node.js's built-in 'child_process' module.
// `exec` is used to run shell commands.
import { exec } from 'node:child_process';
// Import the `promisify` utility from Node.js's built-in 'util' module.
// `promisify` converts callback-based functions into functions that return Promises.
import { promisify } from 'node:util';
// Create a Promisified version of `child_process.exec`.
// The original `exec` function has the signature:
// `exec(command, [options], (error, stdout, stderr) => {})`
// `promisify(exec)` wraps it so that it returns a Promise.
// - If `error` (from the callback) is null, the Promise resolves with an object: `{ stdout, stderr }`.
// - If `error` is not null, the Promise rejects with that `error` object.
//   The `error` object from `exec` often includes properties like `code` (exit code),
//   `signal` (termination signal), and also `stdout` and `stderr` (output captured before error).
const execPromise = promisify(exec);
/**
 * Executes a shell command asynchronously using Node.js's `child_process.exec`
 * and returns a Promise. This function is specific to Node.js environments.
 *
 * **Security Warning:** Constructing shell commands from external or untrusted user input
 * can lead to command injection vulnerabilities. If you need to use external input,
 * always sanitize it rigorously or, preferably, use `child_process.spawn` with an array
 * of arguments, which is inherently safer against command injection as it doesn't involve
 * shell interpretation in the same way.
 *
 * @async
 * @param {string} command - The shell command to execute (e.g., 'ls -la', 'npm install', 'git status').
 * @param {import('node:child_process').ExecOptions} [options] - Optional.
 *   Standard options for `child_process.exec`. Common options include:
 *   - `cwd` (string): Current working directory of the child process.
 *   - `env` (object): Environment key-value pairs.
 *   - `shell` (string): Shell to execute the command with (e.g., '/bin/bash').
 *   - `timeout` (number): Max time in milliseconds the process is allowed to run.
 *   - `maxBuffer` (number): Largest amount of data (in bytes) allowed on stdout or stderr.
 *                           If exceeded, the child process is terminated. Default: 1024 * 1024.
 *   - `encoding` (string): Encoding for stdout/stderr (default is 'utf8').
 * @returns {Promise<{stdout: string, stderr: string}>} A Promise that resolves with an object
 *   containing `stdout` (standard output) and `stderr` (standard error) as strings
 *   from the executed command, assuming the command executed successfully (exit code 0).
 * @throws {Error & {code?: number | null, signal?: NodeJS.Signals | null, stdout?: string, stderr?: string}}
 *   The Promise rejects if the command:
 *   - Fails to launch.
 *   - Exits with a non-zero status code.
 *   - Is terminated by a signal.
 *   - Exceeds `maxBuffer` or `timeout`.
 *   The rejected error object is typically an instance of `Error` and usually includes:
 *   - `message` (string): Standard error message, often includes command, exit code, stdout, stderr.
 *   - `code` (number | null): The exit code of the child process if it exited on its own.
 *   - `signal` (NodeJS.Signals | null): The signal that terminated the process (e.g., 'SIGTERM').
 *   - `stdout` (string): The content from standard output collected before the error.
 *   - `stderr` (string): The content from standard error collected before the error.
 *   It can also throw if `command` is empty or `options` are invalid before `exec` is even called.
 *
 * @example
 * // Example 1: Listing directory contents
 * async function listDirectory() {
 *   try {
 *     const { stdout, stderr } = await execAsync('ls -lh'); // Use 'dir' on Windows
 *     if (stderr) {
 *       console.warn('Command produced stderr output:', stderr);
 *     }
 *     console.log('Directory Listing:\n', stdout);
 *   } catch (error) {
 *     console.error(`Command execution failed! Exit code: ${error.code}`);
 *     console.error('Error details:', error.message); // Comprehensive message
 *     // error.stdout and error.stderr might contain partial output
 *   }
 * }
 * // listDirectory();
 *
 * @example
 * // Example 2: Running a command with options (e.g., in a different directory)
 * async function echoInSrc() {
 *   try {
 *     const { stdout } = await execAsync('echo "Hello from src directory"', { cwd: './src' });
 *     console.log(stdout.trim()); // Output: "Hello from src directory"
 *   } catch (error) {
 *     console.error('Failed to execute echo in ./src:', error.message);
 *   }
 * }
 * // echoInSrc();
 *
 * @example
 * // Example 3: Handling a failing command
 * async function runFailingCommand() {
 *   try {
 *     await execAsync('this_command_will_fail');
 *   } catch (error) {
 *     console.error(`Command failed as expected.`);
 *     console.error(`Error Code: ${error.code}`); // e.g., 127 on Linux for "command not found"
 *     console.error(`Stderr: ${error.stderr}`);   // e.g., "...command not found..."
 *     // console.error(`Full error message: ${error.message}`);
 *   }
 * }
 * // runFailingCommand();
 *
 * @example
 * // Example 4: Checking Git status
 * async function checkGitStatus() {
 *   try {
 *     const { stdout } = await execAsync('git status --porcelain');
 *     if (stdout) {
 *       console.log('Git changes detected:\n', stdout);
 *     } else {
 *       console.log('Git working directory is clean.');
 *     }
 *   } catch (error) { // This might happen if not a git repo or git is not installed
 *     console.error('Failed to get Git status:', error.message);
 *   }
 * }
 * // checkGitStatus();
 */
export async function execAsync(command, options) {
    // Step 1: Execute the command using the promisified version of `child_process.exec`.
    // `execPromise` takes the command string and an optional options object.
    // It returns a Promise that will:
    //  - Resolve with an object `{ stdout, stderr }` if the command executes successfully (exit code 0).
    //    By default, `stdout` and `stderr` are strings (UTF-8 encoded).
    //  - Reject with an `error` object if the command fails for any reason (non-zero exit code, killed by signal, etc.).
    //    This `error` object often contains `stdout` and `stderr` properties with the output captured
    //    up to the point of failure, along with `code` (exit code) and `signal`.
    const result = await execPromise(command, options);
    // Step 2: Ensure stdout and stderr are strings.
    // While `child_process.exec` defaults to UTF-8 string encoding for stdout/stderr,
    // if the `options` object were to specify `encoding: 'buffer'` or `encoding: null`,
    // `result.stdout` and `result.stderr` would be Buffer objects.
    // Calling `.toString()` ensures that this function consistently returns strings in the resolved object.
    // If they are already strings, `.toString()` is harmless.
    return {
        stdout: result.stdout.toString(),
        stderr: result.stderr.toString(),
    };
}
//# sourceMappingURL=execAsync.js.map