import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getLocalStorageJSON } from './getLocalStorageJSON.js';
import { setupBrowserMocks, restoreGlobals } from '../../utils/test.utils.js';

describe('getLocalStorageJSON(key)', () => {
	let consoleErrors;

	beforeEach(() => {
		setupBrowserMocks();
		consoleErrors = [];

		// Mock console.error to capture error messages
		const originalConsoleError = console.error;
		console.error = (...args) => {
			consoleErrors.push(args);
		};

		// Restore console.error after each test
		global.restoreConsoleError = () => {
			console.error = originalConsoleError;
		};
	});

	afterEach(() => {
		if (global.restoreConsoleError) {
			global.restoreConsoleError();
		}
		restoreGlobals();
	});

	it('should parse and return valid JSON object', () => {
		const testData = { name: 'John', age: 30, active: true };
		global.localStorage.setItem('testKey', JSON.stringify(testData));

		const result = getLocalStorageJSON('testKey');
		assert.deepStrictEqual(result, testData);
	});

	it('should parse and return valid JSON array', () => {
		const testData = ['apple', 'banana', 'cherry'];
		global.localStorage.setItem('fruits', JSON.stringify(testData));

		const result = getLocalStorageJSON('fruits');
		assert.deepStrictEqual(result, testData);
	});

	it('should parse and return valid JSON primitive', () => {
		global.localStorage.setItem('number', JSON.stringify(42));
		global.localStorage.setItem('string', JSON.stringify('hello'));
		global.localStorage.setItem('boolean', JSON.stringify(true));
		global.localStorage.setItem('null', JSON.stringify(null));

		assert.strictEqual(getLocalStorageJSON('number'), 42);
		assert.strictEqual(getLocalStorageJSON('string'), 'hello');
		assert.strictEqual(getLocalStorageJSON('boolean'), true);
		assert.strictEqual(getLocalStorageJSON('null'), null);
	});

	it('should return null for non-existent key', () => {
		const result = getLocalStorageJSON('nonExistentKey');
		assert.strictEqual(result, null);
	});

	it('should return null for empty string value', () => {
		global.localStorage.setItem('emptyKey', '');

		const result = getLocalStorageJSON('emptyKey');
		assert.strictEqual(result, null);
	});

	it('should return null and log error for invalid JSON', () => {
		global.localStorage.setItem('invalidJSON', '{ invalid json }');

		const result = getLocalStorageJSON('invalidJSON');

		assert.strictEqual(result, null);
		assert.strictEqual(consoleErrors.length, 1);
		assert.ok(
			consoleErrors[0][0].includes(
				'Error getting JSON from localStorage for key "invalidJSON"',
			),
		);
	});

	it('should handle localStorage getItem throwing error', () => {
		global.localStorage.getItem = () => {
			throw new Error('localStorage not available');
		};

		const result = getLocalStorageJSON('anyKey');

		assert.strictEqual(result, null);
		assert.strictEqual(consoleErrors.length, 1);
		assert.ok(
			consoleErrors[0][0].includes(
				'Error getting JSON from localStorage for key "anyKey"',
			),
		);
	});

	it('should handle complex nested objects', () => {
		const complexData = {
			user: {
				profile: {
					name: 'Alice',
					preferences: {
						theme: 'dark',
						notifications: true,
						languages: ['en', 'es', 'fr'],
					},
				},
				metadata: {
					created: '2023-01-01',
					lastLogin: null,
				},
			},
			settings: [
				{ key: 'autoSave', value: true },
				{ key: 'timeout', value: 300 },
			],
		};

		global.localStorage.setItem('complexData', JSON.stringify(complexData));

		const result = getLocalStorageJSON('complexData');
		assert.deepStrictEqual(result, complexData);
	});

	it('should handle special characters in values', () => {
		const specialData = {
			message: 'Hello\nWorld\t🌟',
			emoji: '😀🎉🚀',
			unicode: 'café naïve résumé',
		};

		global.localStorage.setItem('specialChars', JSON.stringify(specialData));

		const result = getLocalStorageJSON('specialChars');
		assert.deepStrictEqual(result, specialData);
	});

	it('should handle JSON with escaped characters', () => {
		const dataWithEscapes = {
			quote: 'He said "Hello"',
			backslash: 'C:\\Users\\John',
			newline: 'Line 1\nLine 2',
		};

		global.localStorage.setItem('escapedData', JSON.stringify(dataWithEscapes));

		const result = getLocalStorageJSON('escapedData');
		assert.deepStrictEqual(result, dataWithEscapes);
	});
});
