import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';
import { generateHash } from './generateHash.js';

describe('generateHash(data, algorithm, encoding)', () => {
	it('should generate SHA256 hash with hex encoding by default', () => {
		const data = 'Hello, World!';
		const hash = generateHash(data);

		// Verify it's a valid hex string
		assert.ok(/^[0-9a-f]+$/i.test(hash), 'Should produce valid hex string');
		assert.strictEqual(
			hash.length,
			64,
			'SHA256 hex hash should be 64 characters long',
		);

		// Verify it matches crypto.createHash result
		const expectedHash = crypto.createHash('sha256').update(data).digest('hex');
		assert.strictEqual(hash, expectedHash, 'Should match native crypto result');
	});

	it('should generate MD5 hash when specified', () => {
		const data = 'Hello, World!';
		const hash = generateHash(data, 'md5');

		assert.ok(/^[0-9a-f]+$/i.test(hash), 'Should produce valid hex string');
		assert.strictEqual(
			hash.length,
			32,
			'MD5 hex hash should be 32 characters long',
		);

		const expectedHash = crypto.createHash('md5').update(data).digest('hex');
		assert.strictEqual(hash, expectedHash, 'Should match native crypto result');
	});

	it('should generate SHA1 hash when specified', () => {
		const data = 'Hello, World!';
		const hash = generateHash(data, 'sha1');

		assert.ok(/^[0-9a-f]+$/i.test(hash), 'Should produce valid hex string');
		assert.strictEqual(
			hash.length,
			40,
			'SHA1 hex hash should be 40 characters long',
		);

		const expectedHash = crypto.createHash('sha1').update(data).digest('hex');
		assert.strictEqual(hash, expectedHash, 'Should match native crypto result');
	});

	it('should generate SHA512 hash when specified', () => {
		const data = 'Hello, World!';
		const hash = generateHash(data, 'sha512');

		assert.ok(/^[0-9a-f]+$/i.test(hash), 'Should produce valid hex string');
		assert.strictEqual(
			hash.length,
			128,
			'SHA512 hex hash should be 128 characters long',
		);

		const expectedHash = crypto.createHash('sha512').update(data).digest('hex');
		assert.strictEqual(hash, expectedHash, 'Should match native crypto result');
	});

	it('should generate base64 encoded hash when specified', () => {
		const data = 'Hello, World!';
		const hash = generateHash(data, 'sha256', 'base64');

		// Verify it's a valid base64 string
		assert.ok(
			/^[A-Za-z0-9+/]+=*$/.test(hash),
			'Should produce valid base64 string',
		);

		const expectedHash = crypto
			.createHash('sha256')
			.update(data)
			.digest('base64');
		assert.strictEqual(hash, expectedHash, 'Should match native crypto result');
	});

	it('should generate latin1 encoded hash when specified', () => {
		const data = 'Hello, World!';
		const hash = generateHash(data, 'sha256', 'latin1');

		const expectedHash = crypto
			.createHash('sha256')
			.update(data)
			.digest('latin1');
		assert.strictEqual(hash, expectedHash, 'Should match native crypto result');
	});

	it('should handle empty string', () => {
		const data = '';
		const hash = generateHash(data);

		assert.ok(
			/^[0-9a-f]+$/i.test(hash),
			'Should produce valid hex string for empty input',
		);

		const expectedHash = crypto.createHash('sha256').update(data).digest('hex');
		assert.strictEqual(
			hash,
			expectedHash,
			'Should match native crypto result for empty string',
		);
	});

	it('should handle unicode text', () => {
		const data = 'Hello 🌍! Unicode: αβγδε';
		const hash = generateHash(data);

		assert.ok(
			/^[0-9a-f]+$/i.test(hash),
			'Should produce valid hex string for unicode',
		);

		const expectedHash = crypto.createHash('sha256').update(data).digest('hex');
		assert.strictEqual(
			hash,
			expectedHash,
			'Should match native crypto result for unicode',
		);
	});

	it('should handle large strings', () => {
		const data = 'A'.repeat(10000);
		const hash = generateHash(data);

		assert.ok(
			/^[0-9a-f]+$/i.test(hash),
			'Should produce valid hex string for large input',
		);
		assert.strictEqual(
			hash.length,
			64,
			'SHA256 hash length should be consistent regardless of input size',
		);

		const expectedHash = crypto.createHash('sha256').update(data).digest('hex');
		assert.strictEqual(
			hash,
			expectedHash,
			'Should match native crypto result for large string',
		);
	});

	it('should produce different hashes for different inputs', () => {
		const hash1 = generateHash('Hello, World!');
		const hash2 = generateHash('Hello, World?');

		assert.notStrictEqual(
			hash1,
			hash2,
			'Different inputs should produce different hashes',
		);
	});

	it('should produce consistent hashes for same inputs', () => {
		const data = 'Consistent input';
		const hash1 = generateHash(data);
		const hash2 = generateHash(data);

		assert.strictEqual(
			hash1,
			hash2,
			'Same input should always produce same hash',
		);
	});

	it('should handle binary-like strings', () => {
		const data = '\x00\x01\x02\xFF';
		const hash = generateHash(data);

		assert.ok(/^[0-9a-f]+$/i.test(hash), 'Should handle binary-like strings');

		const expectedHash = crypto.createHash('sha256').update(data).digest('hex');
		assert.strictEqual(
			hash,
			expectedHash,
			'Should match native crypto result for binary-like data',
		);
	});

	it('should handle newlines and special characters', () => {
		const data = 'Line 1\nLine 2\r\nTab:\tEnd';
		const hash = generateHash(data);

		assert.ok(/^[0-9a-f]+$/i.test(hash), 'Should handle special characters');

		const expectedHash = crypto.createHash('sha256').update(data).digest('hex');
		assert.strictEqual(
			hash,
			expectedHash,
			'Should match native crypto result for special characters',
		);
	});
});
