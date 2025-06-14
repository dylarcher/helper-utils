import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';
import { decrypt } from './decrypt.js';

describe('decrypt(encryptedTextWithIv, key)', () => {
	const testKey = crypto.randomBytes(32); // 256-bit key for AES-256

	it('should decrypt text encrypted with AES-256-CBC', () => {
		const originalText = 'Hello, World!';
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv('aes-256-cbc', testKey, iv);

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
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv('aes-256-cbc', testKey, iv);

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
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv('aes-256-cbc', testKey, iv);

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
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv('aes-256-cbc', testKey, iv);

		let encrypted = cipher.update(originalText, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		const encryptedWithIv = `${iv.toString('hex')}:${encrypted}`;

		const wrongKey = crypto.randomBytes(32);

		assert.throws(
			() => decrypt(encryptedWithIv, wrongKey),
			(err) => err.message.startsWith('Decryption failed:'), // General check for wrapped error
			'Should throw a wrapped error for wrong key'
		);
	});
});

describe('decrypt(encryptedTextWithIv, key) - Error Handling and Input Validation Details', () => {
	const originalText = 'Some data to encrypt and decrypt';
	const validKey = crypto.randomBytes(32);
	const validIv = crypto.randomBytes(16);
	let encryptedHex;
	let ivHex;

	beforeEach(() => {
		const cipher = crypto.createCipheriv('aes-256-cbc', validKey, validIv);
		let_encrypted = cipher.update(originalText, 'utf8', 'hex');
		let_encrypted += cipher.final('hex');
		encryptedHex = let_encrypted; // Save just the encrypted part
		ivHex = validIv.toString('hex'); // Save the IV hex
	});

	it('should throw if key is not a Buffer or appropriate string', () => {
		const encryptedPayload = `${ivHex}:${encryptedHex}`;
		assert.throws(
			() => decrypt(encryptedPayload, 'not 32 bytes long1234567890123'), // Invalid string key length
			(err) => err.message.includes('Decryption failed: Invalid key length') || err.message.includes('ERR_CRYPTO_INVALID_KEYLEN'),
			'Should throw for string key of invalid length'
		);
		assert.throws(
			() => decrypt(encryptedPayload, Buffer.from('shortkey')), // Invalid Buffer key length
			(err) => err.message.includes('Decryption failed: Invalid key length') || err.message.includes('ERR_CRYPTO_INVALID_KEYLEN'),
			'Should throw for Buffer key of invalid length'
		);
	});

	it('should throw for IV hex string that decodes to invalid length', () => {
		const shortIvHex = '0102030405060708090a0b0c0d0e0f'; // 15 bytes, valid hex but wrong length
		const longIvHex = '0102030405060708090a0b0c0d0e0f1011'; // 17 bytes, valid hex but wrong length
		const validEncryptedPart = encryptedHex;

		assert.throws(
			() => decrypt(`${shortIvHex}:${validEncryptedPart}`, validKey),
			(err) => err.message.includes('Decryption failed: Invalid IV length') || err.message.includes('ERR_CRYPTO_INVALID_IVLEN'),
			'Should throw for IV hex decoding to 15 bytes'
		);
		assert.throws(
			() => decrypt(`${longIvHex}:${validEncryptedPart}`, validKey),
			(err) => err.message.includes('Decryption failed: Invalid IV length') || err.message.includes('ERR_CRYPTO_INVALID_IVLEN'),
			'Should throw for IV hex decoding to 17 bytes'
		);
	});

	it('should throw for corrupted ciphertext (modified content)', () => {
		let tamperedEncryptedHex = encryptedHex.substring(0, encryptedHex.length - 4) + 'FFFF'; // Modify last few bytes
		if (encryptedHex === tamperedEncryptedHex && encryptedHex.length > 4) { // Ensure it actually changed
			tamperedEncryptedHex = encryptedHex.substring(0, encryptedHex.length - 4) + '0000';
		} else if (encryptedHex.length <= 4) {
            // If encryptedHex is too short, this tampering might not be effective or meaningful
            // For very short original text, padding might make this complex.
            // This test is more meaningful for reasonably sized ciphertexts.
            // Skip if too short to avoid trivial passes/failures.
            // In a real scenario, you'd ensure 'originalText' is long enough.
            console.warn("Skipping corrupted ciphertext test due to short encryptedHex length.");
            return;
        }

		const payload = `${ivHex}:${tamperedEncryptedHex}`;
		assert.throws(
			() => decrypt(payload, validKey),
			(err) => err.message.includes('Decryption failed: Wrong final block length') || err.message.includes('bad decrypt'),
			'Should throw for modified ciphertext content (bad padding or final block)'
		);
	});

	it('should throw for truncated ciphertext', () => {
		if (encryptedHex.length <= 2) {
            console.warn("Skipping truncated ciphertext test due to very short encryptedHex length.");
            return; // Not enough data to truncate meaningfully
        }
		const truncatedEncryptedHex = encryptedHex.substring(0, encryptedHex.length - 2); // Remove last byte (hex char pair)
		const payload = `${ivHex}:${truncatedEncryptedHex}`;

		assert.throws(
			() => decrypt(payload, validKey),
			(err) => err.message.includes('Decryption failed: Wrong final block length') || err.message.includes('bad decrypt') || err.message.includes('Input buffer too short'),
			'Should throw for truncated ciphertext'
		);
	});

	it('should refine error check for invalid hex in IV from previous test suite', () => {
		const invalidIvHexFormat = 'not-hex-at-all:' + encryptedHex;
		assert.throws(
			() => decrypt(invalidIvHexFormat, validKey),
			(err) => err.message.startsWith('Decryption failed:') && (err.message.includes('Encoding with "hex" failed') || err.message.toLowerCase().includes('bad hex string')),
			'Should throw a wrapped error for non-hex IV part'
		);
	});
});
