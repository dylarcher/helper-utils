import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { execAsync } from './execAsync.js';
import * as childProcess from 'node:child_process';

// Keep original integration tests, but add a new describe block for mocked tests
describe('execAsync(command, options) - Integration Tests', () => {
	it('should execute a simple command and return stdout', async () => {
		const result = await execAsync("echo 'Hello World'");

		assert.ok(result.stdout, 'Should have stdout property');
		assert.ok(result.stderr !== undefined, 'Should have stderr property');
		assert.ok(
			result.stdout.includes('Hello World'),
			'Should contain expected output',
		);
	});

	it('should execute command and return both stdout and stderr', async () => {
		// Use a command that writes to both stdout and stderr on most systems
		const result = await execAsync(
			"node -e \"console.log('stdout'); console.error('stderr');\"",
		);

		assert.ok(result.stdout.includes('stdout'), 'Should capture stdout');
		assert.ok(result.stderr.includes('stderr'), 'Should capture stderr');
	});

	it('should handle commands with no output', async () => {
		const result = await execAsync('true'); // Unix command that does nothing and exits successfully

		assert.strictEqual(
			typeof result.stdout,
			'string',
			'stdout should be a string',
		);
		assert.strictEqual(
			typeof result.stderr,
			'string',
			'stderr should be a string',
		);
		assert.strictEqual(
			result.stdout.trim(),
			'',
			"stdout should be empty for 'true' command",
		);
	});

	it('should reject on command failure', async () => {
		await assert.rejects(async () => {
			await execAsync('exit 1'); // Command that exits with error code 1
		}, 'Should reject when command fails');
	});

	it('should reject on non-existent command', async () => {
		await assert.rejects(async () => {
			await execAsync('this-command-does-not-exist-12345');
		}, "Should reject when command doesn't exist");
	});

	it('should work with multi-line output', async () => {
		const result = await execAsync(
			'node -e "console.log(\'line1\\nline2\\nline3\');"',
		);

		const lines = result.stdout.trim().split('\n');
		assert.ok(lines.includes('line1'), 'Should contain line1');
		assert.ok(lines.includes('line2'), 'Should contain line2');
		assert.ok(lines.includes('line3'), 'Should contain line3');
	});

	it('should pass options to child_process.exec', async () => {
		// Test with timeout option
		const start = Date.now();

		await assert.rejects(async () => {
			await execAsync('sleep 2', { timeout: 100 }); // Sleep for 2 seconds with 100ms timeout
		}, 'Should timeout and reject');

		const duration = Date.now() - start;
		assert.ok(
			duration < 1000,
			'Should timeout quickly, not wait for full sleep duration',
		);
	});

	it('should handle commands with special characters', async () => {
		const testString = 'Hello & World | Test > Output';
		const result = await execAsync(`node -e "console.log('${testString}');"`);

		assert.ok(
			result.stdout.includes('Hello & World | Test > Output'),
			'Should handle special characters',
		);
	});

	it('should execute commands in different working directories', async () => {
		const result1 = await execAsync('pwd', { cwd: '/' });
		const result2 = await execAsync('pwd', { cwd: '/tmp' });

		assert.notStrictEqual(
			result1.stdout.trim(),
			result2.stdout.trim(),
			'Should execute in different directories',
		);
	});

	it('should handle environment variables in options', async () => {
		const result = await execAsync(
			'node -e "console.log(process.env.TEST_VAR || \'not set\');"',
			{
				env: { ...process.env, TEST_VAR: 'test_value' },
			},
		);

		assert.ok(
			result.stdout.includes('test_value'),
			'Should use environment variables from options',
		);
	});
});

describe('execAsync(command, options) - Mocked Tests', () => {
	let originalExec;

	beforeEach(() => {
		// Store the original exec function
		originalExec = childProcess.exec;
	});

	afterEach(() => {
		// Restore the original exec function after each test
		childProcess.exec = originalExec;
	});

	it('should resolve with stdout and stderr as strings when exec succeeds with Buffers', async (t) => {
		const mockStdoutBuffer = Buffer.from('mock stdout content');
		const mockStderrBuffer = Buffer.from('mock stderr content');

		// Mock child_process.exec
		childProcess.exec = t.mock.fn((command, options, callback) => {
			assert.strictEqual(command, 'test command');
			assert.deepStrictEqual(options, { testOption: true }); // Example option
			callback(null, mockStdoutBuffer, mockStderrBuffer);
		});

		const result = await execAsync('test command', { testOption: true });

		assert.strictEqual(result.stdout, 'mock stdout content');
		assert.strictEqual(result.stderr, 'mock stderr content');
		assert.strictEqual(childProcess.exec.mock.calls.length, 1);
	});

	it('should resolve with stdout and stderr as strings when exec succeeds with strings', async (t) => {
		const mockStdoutString = 'mock stdout string';
		const mockStderrString = 'mock stderr string';

		childProcess.exec = t.mock.fn((command, options, callback) => {
			callback(null, mockStdoutString, mockStderrString);
		});

		const result = await execAsync('another command');

		assert.strictEqual(result.stdout, 'mock stdout string');
		assert.strictEqual(result.stderr, 'mock stderr string');
	});

	it('should resolve with empty strings for empty stdout/stderr Buffers', async (t) => {
		childProcess.exec = t.mock.fn((command, options, callback) => {
			callback(null, Buffer.from(''), Buffer.from(''));
		});

		const result = await execAsync('empty output command');

		assert.strictEqual(result.stdout, '');
		assert.strictEqual(result.stderr, '');
	});

	it('should reject with the error from exec if exec calls back with an error', async (t) => {
		const mockError = new Error('Mocked exec failure');
		// exec's error object often includes stdout/stderr properties
		mockError.stdout = Buffer.from('stdout on error');
		mockError.stderr = Buffer.from('stderr on error');

		childProcess.exec = t.mock.fn((command, options, callback) => {
			callback(mockError, mockError.stdout, mockError.stderr);
		});

		await assert.rejects(
			async () => execAsync('failing command'),
			(err) => {
				assert.strictEqual(err.message, 'Mocked exec failure');
				// IMPORTANT: Current execAsync does NOT process err.stdout/stderr to strings.
				// It re-throws the error as is from promisify(exec).
				assert.ok(Buffer.isBuffer(err.stdout), 'Error stdout should be Buffer as is from exec');
				assert.strictEqual(err.stdout.toString(), 'stdout on error');
				assert.ok(Buffer.isBuffer(err.stderr), 'Error stderr should be Buffer as is from exec');
				assert.strictEqual(err.stderr.toString(), 'stderr on error');
				return true;
			},
			'Should reject with the error from exec, preserving original stdout/stderr types on error object'
		);
	});

    it('should correctly pass options to the mocked exec', async (t) => {
        const commandOptions = { uid: 1000, gid: 1000, encoding: 'utf-8' };
        let receivedOptions = null;

        childProcess.exec = t.mock.fn((command, options, callback) => {
            receivedOptions = options;
            callback(null, '', ''); // Success
        });

        await execAsync('command with options', commandOptions);

        assert.strictEqual(childProcess.exec.mock.calls.length, 1);
        assert.deepStrictEqual(receivedOptions, commandOptions);
    });
});
