import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { uuid } from './uuid.js';
import { setupBrowserMocks, restoreGlobals } from '../../utils/test.utils.js';

describe('uuid()', () => {
	beforeEach(() => {
		setupBrowserMocks();
	});

	afterEach(() => {
		restoreGlobals();
	});

	it('should generate a valid UUID v4', () => {
		// Mock crypto.randomUUID
		global.crypto = {
			randomUUID: () => '12345678-1234-4567-8901-123456789012',
		};

		const result = uuid();
		assert.strictEqual(result, '12345678-1234-4567-8901-123456789012');
	});

	it('should generate different UUIDs on multiple calls', () => {
		let callCount = 0;
		global.crypto = {
			randomUUID: () => {
				callCount++;
				return `1234567${callCount}-1234-4567-8901-123456789012`;
			},
		};

		const uuid1 = uuid();
		const uuid2 = uuid();

		assert.notStrictEqual(uuid1, uuid2);
		assert.strictEqual(uuid1, '12345671-1234-4567-8901-123456789012');
		assert.strictEqual(uuid2, '12345672-1234-4567-8901-123456789012');
	});

	it('should return string type', () => {
		global.crypto = {
			randomUUID: () => '12345678-1234-4567-8901-123456789012',
		};

		const result = uuid();
		assert.strictEqual(typeof result, 'string');
	});

	it('should throw error when crypto is not available', () => {
		global.crypto = undefined;

		assert.throws(
			() => {
				uuid();
			},
			{
				name: 'Error',
				message: 'crypto.randomUUID is not available in this browser.',
			},
		);
	});

	it('should throw error when crypto.randomUUID is not available', () => {
		global.crypto = {};

		assert.throws(
			() => {
				uuid();
			},
			{
				name: 'Error',
				message: 'crypto.randomUUID is not available in this browser.',
			},
		);
	});

	it('should throw error when crypto.randomUUID is not a function', () => {
		global.crypto = {
			randomUUID: 'not a function',
		};

		assert.throws(
			() => {
				uuid();
			},
			{
				name: 'Error',
				message: 'crypto.randomUUID is not available in this browser.',
			},
		);
	});

	it('should handle crypto.randomUUID returning null', () => {
		global.crypto = {
			randomUUID: () => null,
		};

		const result = uuid();
		assert.strictEqual(result, null);
	});

	it('should handle crypto.randomUUID returning undefined', () => {
		global.crypto = {
			randomUUID: () => undefined,
		};

		const result = uuid();
		assert.strictEqual(result, undefined);
	});

	it('should pass through any value from crypto.randomUUID', () => {
		const testValues = [
			'valid-uuid-string',
			'12345678-1234-4567-8901-123456789012',
			'another-test-uuid',
			'',
		];

		testValues.forEach((testValue) => {
			global.crypto = {
				randomUUID: () => testValue,
			};

			const result = uuid();
			assert.strictEqual(result, testValue);
		});
	});

	it('should handle crypto.randomUUID throwing an error', () => {
		global.crypto = {
			randomUUID: () => {
				throw new Error('randomUUID failed');
			},
		};

		assert.throws(
			() => {
				uuid();
			},
			{
				name: 'Error',
				message: 'randomUUID failed',
			},
		);
	});

	it('should work with real crypto.randomUUID if available', () => {
		// Test with a real-like implementation
		global.crypto = {
			randomUUID: () => {
				// Simple UUID v4 generator for testing
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
					/[xy]/g,
					function (c) {
						const r = (Math.random() * 16) | 0;
						const v = c === 'x' ? r : (r & 0x3) | 0x8;
						return v.toString(16);
					},
				);
			},
		};

		const result = uuid();

		// Should match UUID v4 format
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		assert.ok(
			uuidRegex.test(result),
			`Generated UUID "${result}" should match v4 format`,
		);
	});

	it('should generate unique values in rapid succession', () => {
		let counter = 0;
		global.crypto = {
			randomUUID: () => {
				counter++;
				return `uuid-${counter}-${Date.now()}-${Math.random()}`;
			},
		};

		const uuids = new Set();
		for (let i = 0; i < 100; i++) {
			uuids.add(uuid());
		}

		// All should be unique
		assert.strictEqual(uuids.size, 100);
	});
});
