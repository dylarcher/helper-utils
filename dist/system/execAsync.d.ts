/**
 * Executes a shell command asynchronously.
 * @param {string} command - The command to execute.
 * @param {object} [options] - Options for child_process.exec.
 * @returns {Promise<{stdout: string, stderr: string}>} A promise that resolves with stdout and stderr.
 */
export function execAsync(
	command: string,
	options?: object,
): Promise<{
	stdout: string;
	stderr: string;
}>;
