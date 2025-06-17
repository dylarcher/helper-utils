import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as cryptoModule from 'node:crypto';
import { decrypt } from './decrypt.js';

describe('decrypt(encryptedTextWithIv, key)', () => {
	const testKey = cryptoModule.randomBytes(32); // 256-bit key for AES-256

	it('should decrypt text encrypted with AES-256-CBC', () => {
		const originalText = 'Hello, World!';
		const iv = cryptoModule.randomBytes(16);
		const cipher = cryptoModule.createCipheriv('aes-256-cbc', testKey, iv);

		let encrypted = cipher.update(originalText, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const encryptedWithIv = `${iv.toString('hex')}:${encrypted}`;

		const decryptedText = decrypt(encryptedWithIv, testKey);
		assert.strictEqual(
			decryptedText,
			originalText,
			'Decrypted text should match original',
		);
	});

	it('should decrypt empty string', () => {
		const originalText = '';
		const iv = cryptoModule.randomBytes(16);
		const cipher = cryptoModule.createCipheriv('aes-256-cbc', testKey, iv);

		let encrypted = cipher.update(originalText, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const encryptedWithIv = `${iv.toString('hex')}:${encrypted}`;

		const decryptedText = decrypt(encryptedWithIv, testKey);
		assert.strictEqual(
			decryptedText,
			originalText,
			'Decrypted empty string should match',
		);
	});

	it('should decrypt unicode text', () => {
		const originalText = 'Hello 🌍! Unicode: αβγδε';
		const iv = cryptoModule.randomBytes(16);
		const cipher = cryptoModule.createCipheriv('aes-256-cbc', testKey, iv);

		let encrypted = cipher.update(originalText, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const encryptedWithIv = `${iv.toString('hex')}:${encrypted}`;

		const decryptedText = decrypt(encryptedWithIv, testKey);
		assert.strictEqual(
			decryptedText,
			originalText,
			'Decrypted unicode text should match original',
		);
	});

	it('should throw error for invalid format (no colon)', () => {
		const invalidFormat = 'invalidencryptedtext';

		assert.throws(
			() => {
				decrypt(invalidFormat, testKey);
			},
			{
				message: 'Invalid encrypted text format. Expected ivHex:encryptedHex',
			},
		);
	});

	it('should throw error for invalid format (multiple colons)', () => {
		const invalidFormat = 'iv:encrypted:extra';
		assert.throws(
			() => {
				decrypt(invalidFormat, testKey);
			},
			{
				message: 'Invalid encrypted text format. Expected ivHex:encryptedHex',
			},
		);
	});

	it('should throw error for invalid format (empty IV)', () => {
		const invalidFormat = ':encryptedtext';

		assert.throws(
			() => {
				decrypt(invalidFormat, testKey);
			},
			{
				message: 'Invalid encrypted text format. Expected ivHex:encryptedHex',
			},
		);
	});

	it('should throw error for invalid format (empty encrypted text)', () => {
		const invalidFormat = '1234567890abcdef1234567890abcdef:';

		assert.throws(
			() => {
				decrypt(invalidFormat, testKey);
			},
			{
				message: 'Invalid encrypted text format. Expected ivHex:encryptedHex',
			},
		);
	});

	it('should throw error for invalid hex in IV', () => {
		const invalidIv = 'invalidhex:1234567890abcdef';

		assert.throws(() => {
			decrypt(invalidIv, testKey);
		});
	});

	it('should throw error with wrong key', () => {
		const originalText = 'Hello, World!';
		const iv = cryptoModule.randomBytes(16);
		const cipher = cryptoModule.createCipheriv('aes-256-cbc', testKey, iv);

		let encrypted = cipher.update(originalText, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const encryptedWithIv = `${iv.toString('hex')}:${encrypted}`;

		const wrongKey = cryptoModule.randomBytes(32);

		assert.throws(
			() => decrypt(encryptedWithIv, wrongKey),
			err => err.message.startsWith('Decryption failed:'), // General check for wrapped error
			'Should throw a wrapped error for wrong key',
		);
	});
});

describe('decrypt(encryptedTextWithIv, key) - Additional Error Handling', () => {
	const testKey = cryptoModule.randomBytes(32); // 256-bit key for AES-256

	it('should throw if key is not a Buffer or appropriate string', () => {
		const originalText = 'Some data to encrypt and decrypt';
		const validKey = cryptoModule.randomBytes(32);
		const validIv = cryptoModule.randomBytes(16);

		const cipher = cryptoModule.createCipheriv(
			'aes-256-cbc',
			validKey,
			validIv,
		);
		let encrypted = cipher.update(originalText, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const encryptedHex = encrypted;
		const ivHex = validIv.toString('hex');

		const encryptedPayload = `${ivHex}:${encryptedHex}`;
		assert.throws(
			() => decrypt(encryptedPayload, 'not 32 bytes long1234567890123'), // Invalid string key length
			err =>
				err.message.includes('Decryption failed: Invalid key length') ||
				err.message.includes('ERR_CRYPTO_INVALID_KEYLEN'),
			'Should throw for string key of invalid length',
		);
		assert.throws(
			() => decrypt(encryptedPayload, Buffer.from('shortkey')), // Invalid Buffer key length
			err =>
				err.message.includes('Decryption failed: Invalid key length') ||
				err.message.includes('ERR_CRYPTO_INVALID_KEYLEN'),
			'Should throw for Buffer key of invalid length',
		);
	});

	it('should throw for IV hex string that decodes to invalid length', () => {
		const originalText = 'Some data to encrypt and decrypt';
		const validKey = cryptoModule.randomBytes(32);
		const validIv = cryptoModule.randomBytes(16);

		const cipher = cryptoModule.createCipheriv(
			'aes-256-cbc',
			validKey,
			validIv,
		);
		let encrypted = cipher.update(originalText, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const encryptedHex = encrypted;

		const shortIvHex = '0102030405060708090a0b0c0d0e0f'; // 15 bytes, valid hex but wrong length
		const longIvHex = '0102030405060708090a0b0c0d0e0f1011'; // 17 bytes, valid hex but wrong length
		const validEncryptedPart = encryptedHex;

		assert.throws(
			() => decrypt(`${shortIvHex}:${validEncryptedPart}`, validKey),
			err =>
				err.message.includes(
					'Decryption failed: Invalid initialization vector',
				) || err.message.includes('ERR_CRYPTO_INVALID_IVLEN'),
			'Should throw for IV hex decoding to 15 bytes',
		);
		assert.throws(
			() => decrypt(`${longIvHex}:${validEncryptedPart}`, validKey),
			err =>
				err.message.includes(
					'Decryption failed: Invalid initialization vector',
				) || err.message.includes('ERR_CRYPTO_INVALID_IVLEN'),
			'Should throw for IV hex decoding to 17 bytes',
		);
	});

	it('should throw for corrupted ciphertext (modified content)', () => {
		const originalText = 'Some data to encrypt and decrypt';
		const validKey = cryptoModule.randomBytes(32);
		const validIv = cryptoModule.randomBytes(16);

		const cipher = cryptoModule.createCipheriv(
			'aes-256-cbc',
			validKey,
			validIv,
		);
		let encrypted = cipher.update(originalText, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const encryptedHex = encrypted;
		const ivHex = validIv.toString('hex');

		let tamperedEncryptedHex = `${encryptedHex.substring(0, encryptedHex.length - 4)}FFFF`; // Modify last few bytes
		if (encryptedHex === tamperedEncryptedHex && encryptedHex.length > 4) {
			// Ensure it actually changed
			tamperedEncryptedHex = `${encryptedHex.substring(0, encryptedHex.length - 4)}0000`;
		} else if (encryptedHex.length <= 4) {
			// Skip if too short to avoid trivial passes/failures.
			console.warn(
				'Skipping corrupted ciphertext test due to short encryptedHex length.',
			);
			return;
		}

		const payload = `${ivHex}:${tamperedEncryptedHex}`;
		assert.throws(
			() => decrypt(payload, validKey),
			err =>
				err.message.includes('Decryption failed: Wrong final block length') ||
				err.message.includes('bad decrypt'),
			'Should throw for modified ciphertext content (bad padding or final block)',
		);
	});

	it('should throw for truncated ciphertext', () => {
		const originalText = 'Some data to encrypt and decrypt';
		const validKey = cryptoModule.randomBytes(32);
		const validIv = cryptoModule.randomBytes(16);

		const cipher = cryptoModule.createCipheriv(
			'aes-256-cbc',
			validKey,
			validIv,
		);
		let encrypted = cipher.update(originalText, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const encryptedHex = encrypted;
		const ivHex = validIv.toString('hex');

		if (encryptedHex.length <= 2) {
			console.warn(
				'Skipping truncated ciphertext test due to very short encryptedHex length.',
			);
			return; // Not enough data to truncate meaningfully
		}
		const truncatedEncryptedHex = encryptedHex.substring(
			0,
			encryptedHex.length - 2,
		); // Remove last byte (hex char pair)
		const payload = `${ivHex}:${truncatedEncryptedHex}`;

		assert.throws(
			() => decrypt(payload, validKey),
			err =>
				err.message.includes('Decryption failed: error:') ||
				err.message.includes('bad decrypt') ||
				err.message.includes('wrong final block length'),
			'Should throw for truncated ciphertext',
		);
	});

	it('should refine error check for invalid hex in IV from previous test suite', () => {
		const originalText = 'Some data to encrypt and decrypt';
		const validKey = cryptoModule.randomBytes(32);
		const validIv = cryptoModule.randomBytes(16);

		const cipher = cryptoModule.createCipheriv(
			'aes-256-cbc',
			validKey,
			validIv,
		);
		let encrypted = cipher.update(originalText, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const encryptedHex = encrypted;

		const invalidIvHexFormat = `not-hex-at-all:${encryptedHex}`;
		assert.throws(
			() => decrypt(invalidIvHexFormat, validKey),
			err =>
				err.message.startsWith('Decryption failed:') &&
				(err.message.includes('Invalid initialization vector') ||
					err.message.toLowerCase().includes('bad hex string')),
			'Should throw a wrapped error for non-hex IV part',
		);
	});
	it('should handle crypto errors (e.g. invalid ciphertext hex) during decryption process', () => {
		// Test crypto errors that might occur during the decryption process
		const validIv = '1234567890abcdef1234567890abcdef';
		const invalidCiphertext = 'notvalidhex';

		assert.throws(
			() => { // This will throw during decipher.update('notvalidhex', 'hex', 'utf8')
				decrypt(`${validIv}:${invalidCiphertext}`, testKey);
			},
			{
				message: /Decryption failed:/,
			},
		);
	});

	it('should handle crypto errors (e.g. short ciphertext) that might trigger "bad decrypt"', () => {
		const validIv = '1234567890abcdef1234567890abcdef';
		// Use a very short ciphertext that might cause internal crypto errors
		const shortCiphertext = '12';

		assert.throws(
			() => { // This will likely throw "bad decrypt" or similar during decipher.final()
				decrypt(`${validIv}:${shortCiphertext}`, testKey);
			},
			{
				message: /Decryption failed:/,
			},
		);
	});

	// Renamed for clarity and to ensure it tests the "Unknown error" path specifically
	it('should use "Unknown error" when Buffer.from throws non-Error without message', t => {
		// Use Node.js test mocking to replace the Buffer.from method temporarily
		const originalBufferFrom = Buffer.from;

		// Mock Buffer.from to throw an error without a message property when called with 'hex'
		const mockBufferFrom = t.mock.fn((input, encoding) => {
			if (encoding === 'hex' && input === '1234567890abcdef1234567890abcdef') {
				const errorWithoutMessage = { code: 'MOCK_ERROR' };
				throw errorWithoutMessage;
			}
			return originalBufferFrom(input, encoding);
		});

		// Replace Buffer.from temporarily
		Buffer.from = mockBufferFrom;

		try {
			const validIv = '1234567890abcdef1234567890abcdef';
			const validEncrypted = 'abcdef1234567890abcdef1234567890';

			assert.throws(
				() => {
					decrypt(`${validIv}:${validEncrypted}`, testKey);
				},
				{
					message: 'Decryption failed: Unknown error',
				},
			);
		} finally {
			// Restore the original method
			Buffer.from = originalBufferFrom;
		}
	});

	it('should use "Unknown error" for non-Error object without message from Buffer.from', () => {
		// Test case where the caught error is not an Error instance and has no message property
		// This tests the fallback to 'Unknown error'
		// We'll test this through Buffer.from error since we can't easily mock createDecipheriv

		// Test with malformed hex that causes Buffer.from to throw
		const malformedEncryptedWithIv = 'invalidhex:malformeddata';
		const key = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex');

		// Mock Buffer.from to throw a non-Error object (this is a theoretical test scenario)
		const originalBufferFrom = Buffer.from;
		let callCount = 0;
		
		Buffer.from = function(...args) {
			callCount++;
			// On the first call (IV conversion), throw a non-Error object without message
			if (callCount === 1 && args[1] === 'hex') {
				throw { code: 'BUFFER_ERROR', details: 'hex conversion failed' };
			}
			// For other calls, use original Buffer.from
			return originalBufferFrom.apply(this, args);
		};

		try {
			assert.throws(
				() => decrypt(malformedEncryptedWithIv, key),
				(err) => {
					return (
						err instanceof Error &&
						err.message.includes('Decryption failed: Unknown error')
					);
				},
				'Should throw error with "Unknown error" message for non-Error objects without message',
			);
		} finally {
			// Restore original function
			Buffer.from = originalBufferFrom;
		}
	});

	it('should use message from non-Error object if it has a string message property', () => {
		// Test with a scenario where Buffer.from throws a non-Error object with a message property
		const customErrorMessage = 'Custom error from a plain object';
		const malformedEncryptedWithIv = 'invalidhex:malformeddata';
		const key = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex');

		const originalBufferFrom = Buffer.from;
		let callCount = 0;
		
		Buffer.from = function(...args) {
			callCount++;
			// On the first call (IV conversion), throw a non-Error object with message
			if (callCount === 1 && args[1] === 'hex') {
				const errObj = { message: customErrorMessage, code: 'CUSTOM_BUFFER_ERROR' };
				throw errObj;
			}
			// For other calls, use original Buffer.from
			return originalBufferFrom.apply(this, args);
		};

		try {
			assert.throws(
				() => decrypt(malformedEncryptedWithIv, key),
				(errThrown) => {
					assert.ok(errThrown instanceof Error, 'Outer thrown error should be an Error instance');
					assert.strictEqual(errThrown.message, `Decryption failed: ${customErrorMessage}`);
					return true;
				},
				'Should use message from non-Error object that has a message property');
		} finally {
			// Restore original Buffer.from function
			Buffer.from = originalBufferFrom;
		}
	});
});
