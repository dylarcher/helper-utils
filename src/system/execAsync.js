import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execPromise = promisify(exec);

/**
 * Executes a shell command asynchronously.
 * @param {string} command - The command to execute.
 * @param {object} [options] - Options for child_process.exec.
 * @returns {Promise<{stdout: string, stderr: string}>} A promise that resolves with stdout and stderr.
 */
export async function execAsync(command, options) {
	return execPromise(command, options);
}
