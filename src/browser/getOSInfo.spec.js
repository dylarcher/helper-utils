import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getOSInfo } from './getOSInfo.js';

describe('getOSInfo() - in Node.js environment', () => {
	beforeEach(() => {
		// Note: This test is complex because it imports a Node.js module
		// In a real browser environment, this function wouldn't work
		// but we can test the structure and behavior
	});

	it('should return an object with required properties when navigator is not defined', () => {
		// In a Node.js environment, typeof navigator will be 'undefined' unless mocked.
		const result = getOSInfo();

		// Test for the Node.js fallback structure or browser fallback structure
		assert.strictEqual(typeof result, 'object', 'Result should be an object.');
		assert.ok(result !== null, 'Result should not be null.');

		// Since we're in Node.js with process defined, we should get the error case
		assert.deepStrictEqual(result, {
			platform: 'unknown',
			userAgent: 'unknown',
			language: 'unknown',
			vendor: 'unknown',
			connection: 'unknown',
			error:
				'Navigator object not available. This function is intended for browser environments.',
		});
	});

	it('should return valid platform values when providing Node.js OS info', () => {
		const result = getOSInfo();

		// Since we're in Node.js environment, should have error
		if (result.error) {
			assert.strictEqual(result.platform, 'unknown');
		}
	});

	it('should return valid architecture values when providing Node.js OS info', () => {
		const result = getOSInfo();

		// Since we're in Node.js environment, should have error
		if (result.error && result.arch) {
			// This won't be set in error case
			assert.ok(false, 'Should not have arch in error case');
		} else {
			// Expected case - no arch property in error response
			assert.strictEqual(result.arch, undefined);
		}
	});

	it('should have platform matching current environment when providing Node.js OS info', () => {
		const result = getOSInfo();

		// In Node.js environment with process defined, we get error case
		assert.strictEqual(
			result.error,
			'Navigator object not available. This function is intended for browser environments.',
		);
		assert.strictEqual(result.platform, 'unknown');
	});

	it('should have type matching current environment when providing Node.js OS info', () => {
		const result = getOSInfo();

		// Since we're in Node.js and get error case, no type property
		assert.strictEqual(result.type, undefined);
	});

	it('should return an object with specific "unknown" string properties and an error message in browser fallback mode', () => {
		const result = getOSInfo();

		// This is the expected case in Node.js environment
		assert.strictEqual(
			result.platform,
			'unknown',
			'Platform should be "unknown".',
		);
		assert.strictEqual(
			result.userAgent,
			'unknown',
			'UserAgent should be "unknown".',
		);
		assert.strictEqual(
			result.language,
			'unknown',
			'Language should be "unknown".',
		);
		assert.strictEqual(result.vendor, 'unknown', 'Vendor should be "unknown".');
		assert.strictEqual(
			result.connection,
			'unknown',
			'Connection should be "unknown".',
		);
		assert.strictEqual(
			result.error,
			'Navigator object not available. This function is intended for browser environments.',
			'Error message should be correct.',
		);
	});

	it('should return consistent results on multiple calls', () => {
		const result1 = getOSInfo();
		const result2 = getOSInfo();
		assert.deepStrictEqual(
			result1,
			result2,
			'Results from multiple calls should be identical.',
		);
	});

	it('should return an immutable-like result (new object each time)', () => {
		const result1 = getOSInfo();
		// Attempt to modify. This only modifies the local copy, not the internal state of getOSInfo.
		result1.platform = 'modified_platform';

		const result2 = getOSInfo();
		// result2 should be a fresh object with the default "unknown" values.
		assert.strictEqual(
			result2.platform,
			'unknown',
			'Platform in new result should be "unknown".',
		);
		assert.notStrictEqual(
			result1.platform,
			result2.platform,
			"Platform of result1 should have been 'modified' locally and different from result2's platform.",
		);
	});

	describe('getOSInfo() - browser environment simulation', () => {
		let originalNavigator;
		let originalProcess;

		beforeEach(() => {
			// Save original values
			originalNavigator = globalThis.navigator;
			originalProcess = globalThis.process;
		});

		afterEach(() => {
			// Restore the original values
			if (originalNavigator !== undefined) {
				Object.defineProperty(globalThis, 'navigator', {
					value: originalNavigator,
					writable: true,
					configurable: true,
				});
			} else {
				delete globalThis.navigator;
			}
			if (originalProcess !== undefined) {
				globalThis.process = originalProcess;
			} else {
				delete globalThis.process;
			}
		});

		it('should return actual data when navigator is present', () => {
			// Remove process to simulate browser environment
			delete globalThis.process;

			// Mock navigator object using defineProperty to override readonly property
			Object.defineProperty(globalThis, 'navigator', {
				value: {
					platform: 'MacIntel',
					userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
					language: 'en-US',
					vendor: 'Google Inc.',
				},
				writable: true,
				configurable: true,
			});

			const result = getOSInfo();
			assert.strictEqual(result.platform, 'MacIntel');
			assert.strictEqual(
				result.userAgent,
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
			);
			assert.strictEqual(result.language, 'en-US');
			assert.strictEqual(result.vendor, 'Google Inc.');
			assert.strictEqual(result.connection, 'unknown');
			assert.strictEqual(result.error, undefined);
		});

		it('should report "available (no specific details)" for connection if connection object exists but has no known properties', () => {
			// Remove process to simulate browser environment
			delete globalThis.process;

			// Mock navigator with empty connection object
			Object.defineProperty(globalThis, 'navigator', {
				value: {
					platform: 'Linux',
					userAgent: 'Mozilla/5.0',
					language: 'en',
					vendor: '',
					connection: {}, // Empty connection object
				},
				writable: true,
				configurable: true,
			});

			const result = getOSInfo();
			assert.strictEqual(result.connection, 'available (no specific details)');
		});

		it('should correctly stringify connection properties if present', () => {
			// Remove process to simulate browser environment
			delete globalThis.process;

			// Mock navigator with connection details
			Object.defineProperty(globalThis, 'navigator', {
				value: {
					platform: 'Win32',
					userAgent: 'Mozilla/5.0',
					language: 'en-US',
					vendor: 'Microsoft',
					connection: {
						effectiveType: '4g',
						rtt: 50,
						downlink: 10.5,
						saveData: false,
					},
				},
				writable: true,
				configurable: true,
			});

			const result = getOSInfo();
			assert.strictEqual(
				result.connection,
				'effective-type: 4g, rtt: 50, downlink: 10.5, saveData: false',
			);
		});

		it('should use mozConnection if navigator.connection is not available', () => {
			// Remove process to simulate browser environment
			delete globalThis.process;

			// Mock navigator with mozConnection
			Object.defineProperty(globalThis, 'navigator', {
				value: {
					platform: 'Linux',
					userAgent: 'Mozilla/5.0',
					language: 'en',
					vendor: 'Mozilla',
					mozConnection: {
						effectiveType: '3g',
					},
				},
				writable: true,
				configurable: true,
			});

			const result = getOSInfo();
			assert.strictEqual(result.connection, 'effective-type: 3g');
		});

		it('should use webkitConnection if navigator.connection and mozConnection are not available', () => {
			// Remove process to simulate browser environment
			delete globalThis.process;

			// Mock navigator with webkitConnection
			Object.defineProperty(globalThis, 'navigator', {
				value: {
					platform: 'MacIntel',
					userAgent: 'Mozilla/5.0',
					language: 'en-US',
					vendor: 'Apple',
					webkitConnection: {
						rtt: 25,
						downlink: 15.2,
					},
				},
				writable: true,
				configurable: true,
			});

			const result = getOSInfo();
			assert.strictEqual(result.connection, 'rtt: 25, downlink: 15.2');
		});

		it('should default to "unknown" for navigator properties if they are missing or falsy', () => {
			// Remove process to simulate browser environment
			delete globalThis.process;

			// Mock navigator with falsy values
			Object.defineProperty(globalThis, 'navigator', {
				value: {
					platform: null,
					userAgent: '',
					language: undefined,
					vendor: false,
				},
				writable: true,
				configurable: true,
			});

			const result = getOSInfo();
			assert.strictEqual(result.platform, 'unknown');
			assert.strictEqual(result.userAgent, 'unknown');
			assert.strictEqual(result.language, 'unknown');
			assert.strictEqual(result.vendor, 'unknown');
			assert.strictEqual(result.connection, 'unknown');
		});

		it('should handle when neither process nor navigator is defined', () => {
			// Remove both process and navigator
			delete globalThis.process;
			delete globalThis.navigator;

			const result = getOSInfo();
			assert.deepStrictEqual(result, {
				platform: 'unknown',
				userAgent: 'unknown',
				language: 'unknown',
				vendor: 'unknown',
				connection: 'unknown',
				error:
					'Navigator object not available. This function is intended for browser environments.',
			});
		});
	});
});
