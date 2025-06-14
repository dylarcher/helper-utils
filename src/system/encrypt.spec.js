import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as cryptoModule from 'node:crypto';
import { encrypt } from './encrypt.js';

describe('encrypt(text, key, iv)', () => {
	const testKey = cryptoModule.randomBytes(32); // 256-bit key for AES-256
	const testIv = cryptoModule.randomBytes(16); // 128-bit IV for AES-CBC

	it('should encrypt text using AES-256-CBC', () => {
		const originalText = 'Hello, World!';
		const encryptedResult = encrypt(originalText, testKey, testIv);

		assert.ok(typeof encryptedResult === 'string', 'Result should be a string');
		assert.ok(
			encryptedResult.includes(':'),
			'Result should contain IV and encrypted text separated by colon',
		);

		const [ivHex, encryptedHex] = encryptedResult.split(':');
		assert.strictEqual(
			ivHex,
			testIv.toString('hex'),
			'IV should be prepended correctly',
		);
		assert.ok(encryptedHex.length > 0, 'Encrypted text should not be empty');
	});

	it('should encrypt empty string', () => {
		const originalText = '';
		const encryptedResult = encrypt(originalText, testKey, testIv);

		assert.ok(typeof encryptedResult === 'string', 'Result should be a string');
		assert.ok(
			encryptedResult.includes(':'),
			'Result should contain IV and encrypted text',
		);

		const [ivHex, encryptedHex] = encryptedResult.split(':');
		assert.strictEqual(
			ivHex,
			testIv.toString('hex'),
			'IV should be prepended correctly',
		);
		assert.ok(
			encryptedHex.length > 0,
			'Even empty string should produce encrypted output due to padding',
		);
	});

	it('should encrypt unicode text', () => {
		const originalText = 'Hello 🌍! Unicode: αβγδε';
		const encryptedResult = encrypt(originalText, testKey, testIv);

		assert.ok(typeof encryptedResult === 'string', 'Result should be a string');
		assert.ok(
			encryptedResult.includes(':'),
			'Result should contain IV and encrypted text',
		);

		const [ivHex, encryptedHex] = encryptedResult.split(':');
		assert.strictEqual(
			ivHex,
			testIv.toString('hex'),
			'IV should be prepended correctly',
		);
		assert.ok(encryptedHex.length > 0, 'Encrypted text should not be empty');
	});

	it('should produce different output with different IVs', () => {
		const originalText = 'Same text';
		const iv1 = cryptoModule.randomBytes(16);
		const iv2 = cryptoModule.randomBytes(16);

		const encrypted1 = encrypt(originalText, testKey, iv1);
		const encrypted2 = encrypt(originalText, testKey, iv2);

		assert.notStrictEqual(
			encrypted1,
			encrypted2,
			'Same text with different IVs should produce different encrypted output',
		);
	});

	it('should produce different output with different keys', () => {
		const originalText = 'Same text';
		const key1 = cryptoModule.randomBytes(32);
		const key2 = cryptoModule.randomBytes(32);

		const encrypted1 = encrypt(originalText, key1, testIv);
		const encrypted2 = encrypt(originalText, key2, testIv);

		// Extract only the encrypted part (after colon) since IV is the same
		const [, encryptedHex1] = encrypted1.split(':');
		const [, encryptedHex2] = encrypted2.split(':');

		assert.notStrictEqual(
			encryptedHex1,
			encryptedHex2,
			'Same text with different keys should produce different encrypted output',
		);
	});

	it('should produce consistent output with same inputs', () => {
		const originalText = 'Consistent text';
		const result1 = encrypt(originalText, testKey, testIv);
		const result2 = encrypt(originalText, testKey, testIv);

		assert.strictEqual(
			result1,
			result2,
			'Same inputs should produce same encrypted output',
		);
	});

	it('should handle long text', () => {
		const longText = 'A'.repeat(1000);
		const encryptedResult = encrypt(longText, testKey, testIv);

		assert.ok(typeof encryptedResult === 'string', 'Result should be a string');
		assert.ok(
			encryptedResult.includes(':'),
			'Result should contain IV and encrypted text',
		);

		const [ivHex, encryptedHex] = encryptedResult.split(':');
		assert.strictEqual(
			ivHex,
			testIv.toString('hex'),
			'IV should be prepended correctly',
		);
		assert.ok(encryptedHex.length > 0, 'Encrypted text should not be empty');
	});

	it('should integrate properly with decrypt function', () => {
		// This test assumes decrypt function exists and works correctly
		const originalText = 'Integration test';
		const encryptedResult = encrypt(originalText, testKey, testIv);

		// Manually decrypt to verify compatibility
		const [ivHex, encryptedHex] = encryptedResult.split(':');
		const iv = Buffer.from(ivHex, 'hex');
		const decipher = cryptoModule.createDecipheriv('aes-256-cbc', testKey, iv);
		let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
		decrypted += decipher.final('utf8');

		assert.strictEqual(
			decrypted,
			originalText,
			'Encrypted text should decrypt back to original',
		);
	});
});

describe('encrypt(text, key, iv) - Error Handling and Input Validation', () => {
	const testText = 'Some text to encrypt';
	const validKey = cryptoModule.randomBytes(32); // AES-256 needs 32-byte key
	const validIv = cryptoModule.randomBytes(16); // AES-CBC needs 16-byte IV

	it('should throw an error for invalid key length', () => {
		const shortKey = cryptoModule.randomBytes(16); // Invalid length
		const longKey = cryptoModule.randomBytes(48); // Invalid length

		assert.throws(
			() => encrypt(testText, shortKey, validIv),
			err =>
				err.message.includes('Invalid key length') ||
				err.code === 'ERR_CRYPTO_INVALID_KEYLEN',
			'Should throw for a 16-byte key',
		);
		assert.throws(
			() => encrypt(testText, longKey, validIv),
			err =>
				err.message.includes('Invalid key length') ||
				err.code === 'ERR_CRYPTO_INVALID_KEYLEN',
			'Should throw for a 48-byte key',
		);
		assert.throws(
			() => encrypt(testText, Buffer.from('invalidkey'), validIv), // Non-buffer or wrong size buffer
			err =>
				err.message.includes('Invalid key length') ||
				err.code === 'ERR_CRYPTO_INVALID_KEYLEN' ||
				err.code === 'ERR_INVALID_ARG_TYPE',
			'Should throw for a key of incorrect type/length',
		);
	});

	it('should throw an error for invalid IV length', () => {
		const shortIv = cryptoModule.randomBytes(8); // Invalid length
		const longIv = cryptoModule.randomBytes(24); // Invalid length

		assert.throws(
			() => encrypt(testText, validKey, shortIv),
			err =>
				err.message.includes('Invalid IV length') ||
				err.code === 'ERR_CRYPTO_INVALID_IVLEN',
			'Should throw for an 8-byte IV',
		);
		assert.throws(
			() => encrypt(testText, validKey, longIv),
			err =>
				err.message.includes('Invalid IV length') ||
				err.code === 'ERR_CRYPTO_INVALID_IVLEN',
			'Should throw for a 24-byte IV',
		);
		assert.throws(
			() => encrypt(testText, validKey, Buffer.from('invalidiv')), // Non-buffer or wrong size buffer
			err =>
				err.message.includes('Invalid IV length') ||
				err.code === 'ERR_CRYPTO_INVALID_IVLEN' ||
				err.code === 'ERR_INVALID_ARG_TYPE',
			'Should throw for an IV of incorrect type/length',
		);
	});

	it('should throw if key is not a Buffer', () => {
		assert.throws(
			() => encrypt(testText, 'not a buffer key', validIv),
			err =>
				err.code === 'ERR_INVALID_ARG_TYPE' ||
				err.message.includes('Key must be a buffer'),
			'Should throw if key is a string',
		);
	});

	it('should throw if IV is not a Buffer', () => {
		assert.throws(
			() => encrypt(testText, validKey, 'not a buffer iv'),
			err =>
				err.code === 'ERR_INVALID_ARG_TYPE' ||
				err.message.includes('IV must be a buffer'),
			'Should throw if IV is a string',
		);
	});
});
