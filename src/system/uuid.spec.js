import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as cryptoModule from 'node:crypto';
import { uuid } from './uuid.js';

describe('uuid()', () => {
	it('should return a string', () => {
		const result = uuid();
		assert.strictEqual(typeof result, 'string', 'Should return a string');
	});

	it('should return a valid UUID v4 format', () => {
		const result = uuid();

		// UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
		// where x is any hexadecimal digit and y is one of 8, 9, A, or B
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		assert.ok(uuidRegex.test(result), 'Should match UUID v4 format');
	});

	it('should have correct length', () => {
		const result = uuid();
		assert.strictEqual(
			result.length,
			36,
			'UUID should be 36 characters long (including hyphens)',
		);
	});

	it('should have hyphens in correct positions', () => {
		const result = uuid();
		assert.strictEqual(result[8], '-', 'Should have hyphen at position 8');
		assert.strictEqual(result[13], '-', 'Should have hyphen at position 13');
		assert.strictEqual(result[18], '-', 'Should have hyphen at position 18');
		assert.strictEqual(result[23], '-', 'Should have hyphen at position 23');
	});

	it('should have version 4 identifier', () => {
		const result = uuid();
		assert.strictEqual(
			result[14],
			'4',
			"Should have '4' at position 14 (version identifier)",
		);
	});

	it('should have valid variant bits', () => {
		const result = uuid();
		const variantChar = result[19].toLowerCase();
		assert.ok(
			['8', '9', 'a', 'b'].includes(variantChar),
			'Should have valid variant bits (8, 9, a, or b)',
		);
	});

	it('should generate unique UUIDs', () => {
		const uuid1 = uuid();
		const uuid2 = uuid();
		const uuid3 = uuid();

		assert.notStrictEqual(uuid1, uuid2, 'Should generate different UUIDs');
		assert.notStrictEqual(uuid2, uuid3, 'Should generate different UUIDs');
		assert.notStrictEqual(uuid1, uuid3, 'Should generate different UUIDs');
	});

	it('should be consistent with cryptoModule.randomUUID()', () => {
		const ourResult = uuid();
		const cryptoResult = cryptoModule.randomUUID();

		// Both should follow the same format
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		assert.ok(
			uuidRegex.test(ourResult),
			'Our UUID should match UUID v4 format',
		);
		assert.ok(
			uuidRegex.test(cryptoResult),
			'Crypto UUID should match UUID v4 format',
		);
	});

	it('should generate many unique UUIDs', () => {
		const uuids = new Set();
		const count = 1000;

		for (let i = 0; i < count; i++) {
			uuids.add(uuid());
		}

		assert.strictEqual(
			uuids.size,
			count,
			'Should generate unique UUIDs (very low probability of collision)',
		);
	});

	it('should only contain valid hexadecimal characters and hyphens', () => {
		const result = uuid();
		const validChars = /^[0-9a-f-]+$/i;
		assert.ok(validChars.test(result), 'Should only contain valid characters');
	});

	it('should not contain uppercase letters (assuming lowercase format)', () => {
		const result = uuid();
		assert.strictEqual(
			result,
			result.toLowerCase(),
			'Should be in lowercase format',
		);
	});

	// Note: UUIDs can start with numbers, so we can't enforce this constraint
	// While it's preferable for HTML/CSS IDs to start with letters,
	// this isn't a requirement for UUIDs which follow RFC 4122
	it('should be usable as an identifier with a prefix', () => {
		const result = `id-${uuid()}`;

		// With the prefix, it will definitely be valid for CSS/HTML
		assert.ok(
			/^[a-z]/.test(result),
			'Should be usable as an identifier with a prefix',
		);
	});

	it('should be suitable as an identifier', () => {
		const result = uuid();

		// Should not start with a number (for CSS/HTML IDs)
		const firstChar = result[0];
		assert.ok(
			/[a-f]/i.test(firstChar),
			'First character should be a letter for HTML/CSS compatibility',
		);
	});

	it('should have proper entropy distribution', () => {
		const results = [];
		for (let i = 0; i < 100; i++) {
			results.push(uuid());
		}

		// Check that we're getting varied first characters
		const firstChars = results.map(uuidStr => uuidStr[0]);
		const uniqueFirstChars = new Set(firstChars);

		// Should have some variety (not all the same character)
		assert.ok(
			uniqueFirstChars.size > 1,
			'Should have variety in first characters',
		);
	});

	it('should maintain format consistency across multiple calls', () => {
		for (let i = 0; i < 10; i++) {
			const result = uuid();
			const uuidRegex =
				/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
			assert.ok(
				uuidRegex.test(result),
				`UUID ${i + 1} should match format: ${result}`,
			);
		}
	});

	it('should be cryptographically random', () => {
		// Test that consecutive UUIDs don't have obvious patterns
		const uuid1 = uuid();
		const uuid2 = uuid();

		// Convert to arrays for comparison
		const chars1 = uuid1.replace(/-/g, '').split('');
		const chars2 = uuid2.replace(/-/g, '').split('');

		// Count differences
		let differences = 0;
		for (let i = 0; i < chars1.length; i++) {
			if (chars1[i] !== chars2[i]) {
				differences++;
			}
		}

		// Should have many differences (cryptographically random)
		// Allow some flexibility, but expect significant differences
		assert.ok(
			differences > 20,
			'Should have significant differences between consecutive UUIDs',
		);
	});
});
