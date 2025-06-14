import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getOSInfo } from './getOSInfo.js';
// No need to import restoreGlobals or setupBrowserMocks if navigator is not mocked here for these specific tests

describe('getOSInfo() - in Node.js environment', () => {
	it('should return the fallback object when navigator is not defined', () => {
		// In a Node.js environment, typeof navigator will be 'undefined'.
		const result = getOSInfo();

		assert.deepStrictEqual(result, {
			platform: 'unknown',
			userAgent: 'unknown',
			language: 'unknown',
			vendor: 'unknown',
			connection: 'unknown',
			error: 'Navigator object not available. This function is intended for browser environments.',
		});
	});

	it('should return an object with specific "unknown" string properties and an error message', () => {
		const result = getOSInfo();

		assert.strictEqual(typeof result, 'object', 'Result should be an object.');
		assert.ok(result !== null, 'Result should not be null.');

		assert.strictEqual(result.platform, 'unknown', 'Platform should be "unknown".');
		assert.strictEqual(result.userAgent, 'unknown', 'UserAgent should be "unknown".');
		assert.strictEqual(result.language, 'unknown', 'Language should be "unknown".');
		assert.strictEqual(result.vendor, 'unknown', 'Vendor should be "unknown".');
		assert.strictEqual(result.connection, 'unknown', 'Connection should be "unknown".');
		assert.strictEqual(
			result.error,
			'Navigator object not available. This function is intended for browser environments.',
			'Error message should be correct.',
		);
	});

	it('should return consistent results on multiple calls in Node.js environment', () => {
		const result1 = getOSInfo();
		const result2 = getOSInfo();
		assert.deepStrictEqual(result1, result2, 'Results from multiple calls should be identical.');
	});

	it('should return an immutable-like result (new object each time)', () => {
		const result1 = getOSInfo();
		// Attempt to modify. This only modifies the local copy, not the internal state of getOSInfo.
		result1.platform = 'modified_platform';

		const result2 = getOSInfo();
		// result2 should be a fresh object with the default "unknown" values.
		assert.strictEqual(result2.platform, 'unknown', 'Platform in new result should be "unknown".');
		assert.notStrictEqual(result1.platform, result2.platform, "Platform of result1 should have been 'modified' locally and different from result2's platform.");
	});

	// The following tests would be for a browser environment or with a mocked navigator
	// it.todo('should return actual browser data when navigator is present', () => {
	//   // This would require mocking global.navigator
	//   // e.g., global.navigator = { platform: 'TestPlat', userAgent: 'TestAgent', ... };
	//   // const result = getOSInfo();
	//   // assert.strictEqual(result.platform, 'TestPlat');
	//   // delete global.navigator; // cleanup
	// });

	describe('getOSInfo() - with mocked browser environment', () => {
		let originalNavigator;

		beforeEach(() => {
			originalNavigator = global.navigator;
			// Basic mock for navigator
			global.navigator = {
				platform: 'TestPlatform',
				userAgent: 'TestUserAgent/1.0',
				language: 'test-LG',
				vendor: 'TestVendor',
				// Mock connection object without any specific properties initially
				connection: {
					// effectiveType: '4g',
					// rtt: 50,
					// downlink: 10,
					// saveData: false,
				},
				mozConnection: null, // Ensure these fallbacks are not used if connection exists
				webkitConnection: null,
			};
		});

		afterEach(() => {
			if (originalNavigator === undefined) {
				delete global.navigator;
			} else {
				global.navigator = originalNavigator;
			}
		});

		it('should return actual data when navigator is present', () => {
			const result = getOSInfo();
			assert.strictEqual(result.platform, 'TestPlatform');
			assert.strictEqual(result.userAgent, 'TestUserAgent/1.0');
			assert.strictEqual(result.language, 'test-LG');
			assert.strictEqual(result.vendor, 'TestVendor');
			assert.strictEqual(result.error, undefined, "Error property should not be present");
		});

		it('should report "available (no specific details)" for connection if connection object exists but has no known properties', () => {
			const result = getOSInfo();
			assert.strictEqual(result.connection, 'available (no specific details)');
		});

		it('should correctly stringify connection properties if present', () => {
			global.navigator.connection = {
				effectiveType: '4g',
				rtt: 100,
				downlink: 5,
				saveData: true,
			};
			const result = getOSInfo();
			assert.strictEqual(result.connection, 'effective-type: 4g, rtt: 100, downlink: 5, saveData: true');
		});

		it('should use mozConnection if navigator.connection is not available', () => {
			delete global.navigator.connection;
			global.navigator.mozConnection = { effectiveType: '3g' };
			const result = getOSInfo();
			assert.strictEqual(result.connection, 'effective-type: 3g');
		});

		it('should use webkitConnection if navigator.connection and mozConnection are not available', () => {
			delete global.navigator.connection;
			delete global.navigator.mozConnection;
			global.navigator.webkitConnection = { effectiveType: '2g' };
			const result = getOSInfo();
			assert.strictEqual(result.connection, 'effective-type: 2g');
		});

		it('should default to "unknown" for navigator properties if they are missing or falsy', () => {
			global.navigator = {
				// platform is missing
				userAgent: '', // falsy
			};
			const result = getOSInfo();
			assert.strictEqual(result.platform, 'unknown');
			assert.strictEqual(result.userAgent, 'unknown'); // because empty string is falsy in `|| 'unknown'`
			assert.strictEqual(result.language, 'unknown');
			assert.strictEqual(result.vendor, 'unknown');
			assert.strictEqual(result.connection, 'unknown');
		});
	});
});
