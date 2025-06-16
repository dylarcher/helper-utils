import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setLocalStorageJSON } from './setLocalStorageJSON.js';
import { setupBrowserMocks, restoreGlobals } from '../../utils/test.utils.js';

describe('setLocalStorageJSON(key, value)', () => {
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

	it('should stringify and store simple object', () => {
		const testData = { name: 'John', age: 30 };
		const result = setLocalStorageJSON('user', testData);

		assert.strictEqual(result, true);
		assert.strictEqual(
			global.localStorage.getItem('user'),
			JSON.stringify(testData),
		);
	});

	it('should stringify and store array', () => {
		const testData = ['apple', 'banana', 'cherry'];
		const result = setLocalStorageJSON('fruits', testData);

		assert.strictEqual(result, true);
		assert.strictEqual(
			global.localStorage.getItem('fruits'),
			JSON.stringify(testData),
		);
	});

	it('should stringify and store primitive values', () => {
		assert.strictEqual(setLocalStorageJSON('number', 42), true);
		assert.strictEqual(setLocalStorageJSON('string', 'hello'), true);
		assert.strictEqual(setLocalStorageJSON('boolean', true), true);
		assert.strictEqual(setLocalStorageJSON('null', null), true);

		assert.strictEqual(global.localStorage.getItem('number'), '42');
		assert.strictEqual(global.localStorage.getItem('string'), '"hello"');
		assert.strictEqual(global.localStorage.getItem('boolean'), 'true');
		assert.strictEqual(global.localStorage.getItem('null'), 'null');
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

		const result = setLocalStorageJSON('complexData', complexData);

		assert.strictEqual(result, true);

		// Verify it can be parsed back correctly
		const stored = global.localStorage.getItem('complexData');
		const parsed = JSON.parse(stored);
		assert.deepStrictEqual(parsed, complexData);
	});

	it('should handle special characters in values', () => {
		const specialData = {
			message: 'Hello\nWorld\t🌟',
			emoji: '😀🎉🚀',
			unicode: 'café naïve résumé',
		};

		const result = setLocalStorageJSON('specialChars', specialData);

		assert.strictEqual(result, true);

		const stored = global.localStorage.getItem('specialChars');
		const parsed = JSON.parse(stored);
		assert.deepStrictEqual(parsed, specialData);
	});

	it('should overwrite existing values', () => {
		const firstData = { version: 1 };
		const secondData = { version: 2 };

		setLocalStorageJSON('data', firstData);
		assert.strictEqual(
			global.localStorage.getItem('data'),
			JSON.stringify(firstData),
		);

		setLocalStorageJSON('data', secondData);
		assert.strictEqual(
			global.localStorage.getItem('data'),
			JSON.stringify(secondData),
		);
	});

	it('should re-throw error when localStorage.setItem throws', () => {
		const expectedError = new Error('Simulated localStorage.setItem error');
		global.localStorage.setItem = () => {
			throw expectedError;
		};

		assert.throws(
			() => setLocalStorageJSON('test', { data: 'value' }),
			expectedError,
			'Expected setLocalStorageJSON to re-throw the error from localStorage.setItem.',
		);
		assert.strictEqual(consoleErrors.length, 0);
	});

	it('should re-throw error when JSON.stringify throws', () => {
		// Create an object that can't be stringified (circular reference)
		const circularObj = {};
		circularObj.self = circularObj;

		assert.throws(
			() => setLocalStorageJSON('circular', circularObj),
			(error) => {
				return (
					error instanceof TypeError &&
					error.message.includes('circular structure')
				);
			},
			'Expected setLocalStorageJSON to re-throw a TypeError for circular references.',
		);
		assert.strictEqual(consoleErrors.length, 0);
	});

	// Test for localStorage not being available (thrown by the function's own check)
	it('should throw error if localStorage is not available', () => {
		const originalLocalStorage = global.localStorage;
		delete global.localStorage; // Simulate localStorage not being available

		assert.throws(
			() => setLocalStorageJSON('anyKey', 'anyValue'),
			(error) => {
				return (
					error instanceof Error &&
					error.message === 'localStorage is not available in this environment.'
				);
			},
			'Expected setLocalStorageJSON to throw an error when localStorage is not available.',
		);
		global.localStorage = originalLocalStorage; // Restore
		assert.strictEqual(consoleErrors.length, 0);
	});

	it('should handle undefined values', () => {
		const result = setLocalStorageJSON('undefined', undefined);

		assert.strictEqual(result, true);
		assert.strictEqual(global.localStorage.getItem('undefined'), 'null'); // JSON.stringify(undefined) becomes "null"
	});

	it('should handle function values', () => {
		const result = setLocalStorageJSON('function', () => 'test');

		assert.strictEqual(result, true);
		assert.strictEqual(global.localStorage.getItem('function'), 'null'); // Functions become null in JSON
	});

	it('should handle objects with toJSON method', () => {
		const objWithToJSON = {
			value: 'original',
			toJSON: function () {
				return { value: 'serialized' };
			},
		};

		const result = setLocalStorageJSON('customSerialization', objWithToJSON);

		assert.strictEqual(result, true);

		const stored = global.localStorage.getItem('customSerialization');
		const parsed = JSON.parse(stored);
		assert.deepStrictEqual(parsed, { value: 'serialized' });
	});

	it('should handle Date objects', () => {
		const dateObj = new Date('2023-01-01T12:00:00Z');

		const result = setLocalStorageJSON('date', dateObj);

		assert.strictEqual(result, true);
		assert.strictEqual(
			global.localStorage.getItem('date'),
			`"${dateObj.toISOString()}"`,
		);
	});

	it('should handle empty objects and arrays', () => {
		assert.strictEqual(setLocalStorageJSON('emptyObj', {}), true);
		assert.strictEqual(setLocalStorageJSON('emptyArr', []), true);

		assert.strictEqual(global.localStorage.getItem('emptyObj'), '{}');
		assert.strictEqual(global.localStorage.getItem('emptyArr'), '[]');
	});

	it('should handle very large objects', () => {
		const largeObj = {};
		for (let i = 0; i < 1000; i++) {
			largeObj[`key${i}`] = `value${i}`;
		}

		const result = setLocalStorageJSON('large', largeObj);

		assert.strictEqual(result, true);

		const stored = global.localStorage.getItem('large');
		const parsed = JSON.parse(stored);
		assert.deepStrictEqual(parsed, largeObj);
	});

	it('should handle objects with symbol properties (ignored)', () => {
		const symbolKey = Symbol('test');
		const objWithSymbol = {
			normalProp: 'value',
			[symbolKey]: 'symbol value',
		};

		const result = setLocalStorageJSON('withSymbol', objWithSymbol);

		assert.strictEqual(result, true);

		const stored = global.localStorage.getItem('withSymbol');
		const parsed = JSON.parse(stored);
		assert.deepStrictEqual(parsed, { normalProp: 'value' }); // Symbol property ignored
	});
});
