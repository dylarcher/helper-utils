import { describe, it, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { getCookie } from './getCookie.js';

describe('getCookie(alias)', () => {
	let originalDocument;

	beforeEach(() => {
		originalDocument = global.document;
	});

	it('should retrieve a simple cookie', () => {
		global.document = {
			cookie: 'testCookie=testValue; anotherCookie=anotherValue',
		};

		const result = getCookie('testCookie');
		assert.strictEqual(result, 'testValue');
	});

	it('should retrieve a cookie with special characters', () => {
		global.document = {
			cookie: 'specialCookie=value%20with%20spaces; normalCookie=normal',
		};

		const result = getCookie('specialCookie');
		assert.strictEqual(result, 'value%20with%20spaces');
	});

	it('should handle cookies with spaces around values', () => {
		global.document = {
			cookie: ' spacedCookie = spacedValue ; anotherCookie=value',
		};

		const result = getCookie('spacedCookie');
		assert.strictEqual(result, 'spacedValue');
	});

	it('should return null for non-existent cookie', () => {
		global.document = {
			cookie: 'existingCookie=value; anotherCookie=anotherValue',
		};

		const result = getCookie('nonExistentCookie');
		assert.strictEqual(result, null);
	});

	it('should handle empty cookie string', () => {
		global.document = {
			cookie: '',
		};

		const result = getCookie('anyCookie');
		assert.strictEqual(result, null);
	});

	it('should handle undefined document', () => {
		global.document = undefined;

		const result = getCookie('anyCookie');
		assert.strictEqual(result, null);
	});

	it('should handle document without cookie property', () => {
		global.document = {};

		const result = getCookie('anyCookie');
		assert.strictEqual(result, null);
	});

	it('should handle null document.cookie', () => {
		global.document = {
			cookie: null,
		};

		const result = getCookie('anyCookie');
		assert.strictEqual(result, null);
	});

	it('should retrieve first cookie when multiple cookies have similar names', () => {
		global.document = {
			cookie: 'user=john; userInfo=detailed; userData=extra',
		};

		const result = getCookie('user');
		assert.strictEqual(result, 'john');
	});

	it('should handle cookie with equal signs in value', () => {
		global.document = {
			cookie: 'encodedData=key=value&another=data; simpleCookie=simple',
		};

		const result = getCookie('encodedData');
		assert.strictEqual(result, 'key=value&another=data');
	});

	it('should handle empty cookie value', () => {
		global.document = {
			cookie: 'emptyCookie=; normalCookie=value',
		};

		const result = getCookie('emptyCookie');
		assert.strictEqual(result, '');
	});

	it('should be case sensitive', () => {
		global.document = {
			cookie: 'TestCookie=value; testcookie=lowervalue',
		};

		const result1 = getCookie('TestCookie');
		const result2 = getCookie('testcookie');

		assert.strictEqual(result1, 'value');
		assert.strictEqual(result2, 'lowervalue');
	});

	it('should handle cookies with semicolons in values', () => {
		global.document = {
			cookie: 'complexCookie=value;with;semicolons; normalCookie=normal',
		};

		// Note: This tests the current behavior, though it may not handle semicolons in values perfectly
		// The refactored version will correctly return 'value' as it stops at the first ';'.
		const result = getCookie('complexCookie');
		assert.strictEqual(result, 'value');
	});

	it('should return null if alias is not found among multiple cookies', () => {
		global.document = {
			cookie: 'first=one;second=two;third=three',
		};
		const result = getCookie('fourth'); // This cookie does not exist
		assert.strictEqual(result, null);
	});

	it('should handle invalid cookie format (no equals sign)', () => {
		global.document = {
			cookie: 'invalidcookie; validCookie=value',
		};
		const result = getCookie('validCookie');
		assert.strictEqual(result, 'value');
	});

	it('should handle invalid cookie format (equals as first character)', () => {
		global.document = {
			cookie: '=invalidvalue; validCookie=value',
		};
		const result = getCookie('validCookie');
		assert.strictEqual(result, 'value');
	});

	// Cleanup
	afterEach(() => {
		global.document = originalDocument;
	});
});
