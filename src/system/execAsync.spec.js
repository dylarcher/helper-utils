import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execAsync } from './execAsync.js';

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
