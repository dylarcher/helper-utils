import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { env } from '../../../src/system/env.js';

describe('env(key, defaultValue)', () => {
  const TEST_VAR_EXISTING = 'TEST_ENV_VAR_EXISTS';
  const TEST_VAR_NON_EXISTING = 'TEST_ENV_VAR_DOES_NOT_EXIST';
  const TEST_VAR_EMPTY_STRING = 'TEST_ENV_VAR_EMPTY_STRING';

  beforeEach(() => {
    // Set up environment variables for tests
    process.env[TEST_VAR_EXISTING] = 'existing_value';
    process.env[TEST_VAR_EMPTY_STRING] = '';
    // Ensure the non-existing var is actually not set
    delete process.env[TEST_VAR_NON_EXISTING];
  });

  afterEach(() => {
    // Clean up environment variables after tests
    delete process.env[TEST_VAR_EXISTING];
    delete process.env[TEST_VAR_EMPTY_STRING];
    delete process.env[TEST_VAR_NON_EXISTING]; // Should already be deleted, but good practice
  });

  it('should return the value of an existing environment variable', () => {
    assert.strictEqual(env(TEST_VAR_EXISTING), 'existing_value');
  });

  it('should return the value of an existing environment variable, ignoring default', () => {
    assert.strictEqual(env(TEST_VAR_EXISTING, 'default_value'), 'existing_value');
  });

  it('should return the default value if the environment variable does not exist', () => {
    assert.strictEqual(env(TEST_VAR_NON_EXISTING, 'default_value'), 'default_value');
  });

  it('should return undefined if the environment variable does not exist and no default is provided', () => {
    assert.strictEqual(env(TEST_VAR_NON_EXISTING), undefined);
  });

  it('should return an empty string if the environment variable is set to an empty string', () => {
    assert.strictEqual(env(TEST_VAR_EMPTY_STRING), '');
  });

  it('should return an empty string if the environment variable is set to an empty string, ignoring default', () => {
    assert.strictEqual(env(TEST_VAR_EMPTY_STRING, 'default_value'), '');
  });

  it('should return various types of default values correctly', () => {
    assert.strictEqual(env(TEST_VAR_NON_EXISTING, 'string_default'), 'string_default');
    assert.strictEqual(env(TEST_VAR_NON_EXISTING, 123), 123);
    assert.strictEqual(env(TEST_VAR_NON_EXISTING, true), true);
    assert.strictEqual(env(TEST_VAR_NON_EXISTING, false), false);
    const objDefault = { a: 1 };
    assert.deepStrictEqual(env(TEST_VAR_NON_EXISTING, objDefault), objDefault);
    const arrDefault = [1, 2];
    assert.deepStrictEqual(env(TEST_VAR_NON_EXISTING, arrDefault), arrDefault);
    assert.strictEqual(env(TEST_VAR_NON_EXISTING, null), null);
  });

  it('should handle key being a non-string value (should ideally be coerced or handled gracefully)', () => {
    // Assuming process.env coercers keys to strings
    process.env[123] = '数字キー'; // "number key" in Japanese
    assert.strictEqual(env(123, 'default'), '数字キー');
    assert.strictEqual(env(String(123), 'default'), '数字キー'); // Explicitly stringified
    delete process.env[123];
  });

  it('should not find properties from Object.prototype', () => {
    // Ensure 'toString', 'constructor', etc., are not accidentally picked up
    assert.strictEqual(env('toString', 'default'), 'default');
    assert.strictEqual(env('constructor', 'default_value'), 'default_value');
  });
});
