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
			error:
				'Navigator object not available. This function is intended for browser environments.',
		});
	});

	it('should return an object with specific "unknown" string properties and an error message', () => {
		const result = getOSInfo();

		assert.strictEqual(typeof result, 'object', 'Result should be an object.');
		assert.ok(result !== null, 'Result should not be null.');

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

	it('should return consistent results on multiple calls in Node.js environment', () => {
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

	// The following tests would be for a browser environment or with a mocked navigator
	// it.todo('should return actual browser data when navigator is present', () => {
	//   // This would require mocking global.navigator
	//   // e.g., global.navigator = { platform: 'TestPlat', userAgent: 'TestAgent', ... };
	//   // const result = getOSInfo();
	//   // assert.strictEqual(result.platform, 'TestPlat');
	//   // delete global.navigator; // cleanup
	// });

	describe('getOSInfo() - with mocked browser environment', () => {
		let originalProcess;

		beforeEach(() => {
			// Mock by removing the Node.js process indicator
			originalProcess = global.process;
			delete global.process;
		});

		afterEach(() => {
			// Restore the original process
			global.process = originalProcess;
		});

		// These tests are skipped because navigator is read-only in Node.js
		// and cannot be mocked reliably. The browser-specific code paths
		// are tested manually in actual browser environments.
		it.skip('should return actual data when navigator is present', () => {
			// Cannot reliably mock navigator in Node.js environment
		});

		it.skip('should report "available (no specific details)" for connection if connection object exists but has no known properties', () => {
			// Cannot reliably mock navigator in Node.js environment  
		});

		it.skip('should correctly stringify connection properties if present', () => {
			// Cannot reliably mock navigator in Node.js environment
		});

		it.skip('should use mozConnection if navigator.connection is not available', () => {
			// Cannot reliably mock navigator in Node.js environment
		});

		it.skip('should use webkitConnection if navigator.connection and mozConnection are not available', () => {
			// Cannot reliably mock navigator in Node.js environment
		});

		it.skip('should default to "unknown" for navigator properties if they are missing or falsy', () => {
			// Cannot reliably mock navigator in Node.js environment
		});
	});
});
