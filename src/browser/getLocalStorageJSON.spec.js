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

	it('should throw SyntaxError for invalid JSON', () => {
		global.localStorage.setItem('invalidJSON', '{ invalid json }');

		assert.throws(
			() => getLocalStorageJSON('invalidJSON'),
			(error) => {
				// Check if it's a SyntaxError and optionally part of the message
				return error instanceof SyntaxError && error.message.includes('Unexpected token');
			},
			'Expected getLocalStorageJSON to throw a SyntaxError for invalid JSON.',
		);
		// Ensure no error was logged to console by our spy (if it's still active for other tests)
		assert.strictEqual(consoleErrors.length, 0);
	});

	it('should re-throw error when localStorage.getItem throws', () => {
		const expectedError = new Error('localStorage.getItem failed');
		global.localStorage.getItem = () => {
			throw expectedError;
		};

		assert.throws(
			() => getLocalStorageJSON('anyKey'),
			expectedError, // Asserts that the exact error object is re-thrown
			'Expected getLocalStorageJSON to re-throw the error from localStorage.getItem.',
		);
		assert.strictEqual(consoleErrors.length, 0);
	});

	// Test for localStorage not being available (thrown by the function's own check)
	it('should throw error if localStorage is not available', () => {
		const originalLocalStorage = global.localStorage;
		delete global.localStorage; // Simulate localStorage not being available

		assert.throws(
			() => getLocalStorageJSON('anyKey'),
			(error) => {
				return error instanceof Error && error.message === 'localStorage is not available in this environment.';
			},
			'Expected getLocalStorageJSON to throw an error when localStorage is not available.',
		);
		global.localStorage = originalLocalStorage; // Restore
		assert.strictEqual(consoleErrors.length, 0);
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
