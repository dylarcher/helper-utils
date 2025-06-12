import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { env } from './env.js';

describe('env(key, defaultValue)', () => {
	let originalEnv;

	beforeEach(() => {
		// Store original environment
		originalEnv = { ...process.env };
	});

	afterEach(() => {
		// Restore original environment
		process.env = originalEnv;
	});

	it('should return environment variable value when it exists', () => {
		process.env.TEST_VAR = 'test_value';

		const result = env('TEST_VAR');
		assert.strictEqual(
			result,
			'test_value',
			'Should return the environment variable value',
		);
	});

	it('should return default value when environment variable does not exist', () => {
		delete process.env.TEST_VAR;

		const result = env('TEST_VAR', 'default_value');
		assert.strictEqual(
			result,
			'default_value',
			'Should return the default value',
		);
	});

	it('should return undefined when environment variable does not exist and no default provided', () => {
		delete process.env.TEST_VAR;

		const result = env('TEST_VAR');
		assert.strictEqual(
			result,
			undefined,
			'Should return undefined when no default is provided',
		);
	});

	it('should return empty string when environment variable is empty string', () => {
		process.env.TEST_VAR = '';

		const result = env('TEST_VAR', 'default_value');
		assert.strictEqual(
			result,
			'',
			'Should return empty string, not default value',
		);
	});

	it("should return environment variable value even when it's '0'", () => {
		process.env.TEST_VAR = '0';

		const result = env('TEST_VAR', 'default_value');
		assert.strictEqual(result, '0', "Should return '0', not default value");
	});

	it("should return environment variable value even when it's 'false'", () => {
		process.env.TEST_VAR = 'false';

		const result = env('TEST_VAR', 'default_value');
		assert.strictEqual(
			result,
			'false',
			"Should return 'false', not default value",
		);
	});

	it('should work with various default value types', () => {
		delete process.env.TEST_VAR;

		assert.strictEqual(
			env('TEST_VAR', null),
			null,
			'Should return null default',
		);
		assert.strictEqual(
			env('TEST_VAR', 123),
			123,
			'Should return number default',
		);
		assert.strictEqual(
			env('TEST_VAR', true),
			true,
			'Should return boolean default',
		);
		assert.deepStrictEqual(
			env('TEST_VAR', { key: 'value' }),
			{ key: 'value' },
			'Should return object default',
		);
		assert.deepStrictEqual(
			env('TEST_VAR', [1, 2, 3]),
			[1, 2, 3],
			'Should return array default',
		);
	});

	it('should handle non-string environment variable keys', () => {
		process.env['123'] = 'numeric_key';

		const result = env('123');
		assert.strictEqual(result, 'numeric_key', 'Should handle numeric keys');
	});

	it('should work with common environment variables', () => {
		// These should exist in most environments
		const nodeEnv = env('NODE_ENV', 'development');
		const path = env('PATH', '');

		assert.ok(typeof nodeEnv === 'string', 'NODE_ENV should be a string');
		assert.ok(typeof path === 'string', 'PATH should be a string');
	});
});
