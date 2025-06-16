import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { copyToClipboardAsync } from './copyToClipboardAsync.js';
import {
	setupJSDOM,
	cleanupJSDOM,
	setupBrowserMocks,
	restoreGlobals,
} from '../../utils/test.utils.js';

describe('copyToClipboardAsync(text)', () => {
	beforeEach(() => {
		setupBrowserMocks();
	});

	afterEach(() => {
		restoreGlobals();
	});

	it('should copy text to clipboard successfully', async () => {
		// Mock navigator.clipboard
		global.navigator = {
			clipboard: {
				writeText: async (_text) => {
					// Simulate successful clipboard write
					return Promise.resolve();
				},
			},
		};

		await assert.doesNotReject(() => copyToClipboardAsync('test text'));
	});

	it('should reject if navigator.clipboard is not available', async () => {
		// Mock navigator without clipboard
		global.navigator = {};

		await assert.rejects(() => copyToClipboardAsync('test text'), {
			name: 'Error',
			message:
				'Clipboard API not available. Use a fallback or ensure secure context (HTTPS).',
		});
	});

	it('should reject if clipboard.writeText fails', async () => {
		const testError = new Error('Clipboard write failed');

		// Mock navigator.clipboard with failing writeText
		global.navigator = {
			clipboard: {
				writeText: async () => {
					throw testError;
				},
			},
		};

		await assert.rejects(() => copyToClipboardAsync('test text'), testError);
	});

	it('should handle empty string', async () => {
		global.navigator = {
			clipboard: {
				writeText: async (text) => {
					assert.strictEqual(text, '');
					return Promise.resolve();
				},
			},
		};

		await assert.doesNotReject(() => copyToClipboardAsync(''));
	});

	it('should handle special characters', async () => {
		const specialText = 'Hello\nWorld\t🌟';

		global.navigator = {
			clipboard: {
				writeText: async (text) => {
					assert.strictEqual(text, specialText);
					return Promise.resolve();
				},
			},
		};

		await assert.doesNotReject(() => copyToClipboardAsync(specialText));
	});

	describe('JSDOM Environment Tests', () => {
		beforeEach(() => {
			setupJSDOM();
		});

		afterEach(() => {
			cleanupJSDOM();
		});

		it('should work with clipboard API in jsdom environment', async () => {
			// Mock the clipboard API in jsdom
			let clipboardText = '';
			global.navigator.clipboard = {
				writeText: async (text) => {
					clipboardText = text;
					return Promise.resolve();
				},
			};

			await copyToClipboardAsync('test text');
			assert.strictEqual(clipboardText, 'test text');
		});

		it('should handle clipboard API failures in jsdom', async () => {
			// Mock clipboard API that throws
			global.navigator.clipboard = {
				writeText: async () => {
					throw new Error('Clipboard access denied');
				},
			};

			await assert.rejects(() => copyToClipboardAsync('test text'), {
				message: 'Clipboard access denied',
			});
		});

		it('should handle missing clipboard API in jsdom', async () => {
			// Remove clipboard API
			delete global.navigator.clipboard;

			await assert.rejects(() => copyToClipboardAsync('test text'), {
				message:
					'Clipboard API not available. Use a fallback or ensure secure context (HTTPS).',
			});
		});

		it('should handle empty navigator in jsdom', async () => {
			// Remove entire navigator
			delete global.navigator;

			await assert.rejects(() => copyToClipboardAsync('test text'), {
				message:
					'Clipboard API not available. Use a fallback or ensure secure context (HTTPS).',
			});
		});

		it('should handle various text types in jsdom', async () => {
			let clipboardText = '';
			global.navigator.clipboard = {
				writeText: async (text) => {
					clipboardText = text;
					return Promise.resolve();
				},
			};

			const testCases = [
				'simple text',
				'text with\nnewlines',
				'text with\ttabs',
				'text with "quotes"',
				'text with émojis 🎉',
				'',
				'   whitespace   ',
			];

			for (const testText of testCases) {
				await copyToClipboardAsync(testText);
				assert.strictEqual(clipboardText, testText);
			}
		});
	});
});
