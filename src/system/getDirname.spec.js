import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { getDirname } from './getDirname.js';

describe('getDirname(p)', () => {
	it('should return directory name from file path', () => {
		const result = getDirname('/path/to/file.txt');
		assert.strictEqual(result, '/path/to', 'Should return directory name');
	});

	it('should handle Windows-style paths', () => {
		const winPath = 'C:\\path\\to\\file.txt';
		const result = getDirname(winPath);

		// Get the expected result from Node.js path.dirname
		const expected = path.dirname(winPath);

		assert.strictEqual(
			result,
			expected,
			'Should handle Windows path separators correctly',
		);
	});

	it('should handle Unix-style paths', () => {
		const result = getDirname('/usr/local/bin/node');
		assert.strictEqual(
			result,
			'/usr/local/bin',
			'Should handle Unix-style paths',
		);
	});

	it('should handle paths ending with separator', () => {
		const result = getDirname('/path/to/directory/');
		assert.strictEqual(
			result,
			'/path/to',
			'Should handle paths ending with separator',
		);
	});

	it('should handle relative paths', () => {
		const result = getDirname('path/to/file.txt');
		assert.strictEqual(result, 'path/to', 'Should handle relative paths');
	});

	it('should handle paths with no directory', () => {
		const result = getDirname('file.txt');
		assert.strictEqual(
			result,
			'.',
			"Should return '.' for paths with no directory",
		);
	});

	it('should handle root path', () => {
		const result = getDirname('/');
		assert.strictEqual(result, '/', "Should return '/' for root path");
	});

	it('should handle current directory path', () => {
		const result = getDirname('.');
		assert.strictEqual(result, '.', 'Should handle current directory path');
	});

	it('should handle parent directory path', () => {
		const result = getDirname('..');
		assert.strictEqual(result, '.', "Should return '.' for parent directory");
	});

	it('should handle nested relative paths', () => {
		const result = getDirname('../../path/file.txt');
		assert.strictEqual(
			result,
			'../../path',
			'Should handle nested relative paths',
		);
	});

	it('should handle paths with multiple consecutive separators', () => {
		const testPath = '/path//to//file.txt';
		const result = getDirname(testPath);

		// Get the expected result from Node.js path.dirname
		const expected = path.dirname(testPath);

		assert.strictEqual(
			result,
			expected,
			'Should handle multiple consecutive separators correctly',
		);
	});

	it('should handle complex paths with spaces and special characters', () => {
		const result = getDirname(
			'/path/to/file with spaces and (special) chars.txt',
		);
		assert.strictEqual(
			result,
			'/path/to',
			'Should handle paths with spaces and special characters',
		);
	});

	it('should handle hidden files and directories', () => {
		const result = getDirname('/path/to/.hidden/file.txt');
		assert.strictEqual(
			result,
			'/path/to/.hidden',
			'Should handle hidden directories',
		);
	});

	it('should be consistent with Node.js path.dirname', () => {
		const paths = [
			'/',
			'/path/to/file.txt',
			'C:\\Windows\\System32\\drivers\\etc\\hosts',
			'relative/path/file.js',
			'file.ext',
			'.hidden',
			'path/with/trailing/',
			'path/with///multiple///separators////file.txt',
			'../parent/dir/file',
		];

		paths.forEach((testPath) => {
			const expected = path.dirname(testPath);
			const result = getDirname(testPath);
			assert.strictEqual(
				result,
				expected,
				`Should match Node.js result for path: ${testPath}`,
			);
		});
	});

	it('should handle deeply nested paths', () => {
		const result = getDirname('/very/deeply/nested/path/to/some/file.txt');
		assert.strictEqual(
			result,
			'/very/deeply/nested/path/to/some',
			'Should handle deeply nested paths',
		);
	});

	it('should handle paths with file extensions in directory names', () => {
		const result = getDirname('/path/to/dir.backup/file.txt');
		assert.strictEqual(
			result,
			'/path/to/dir.backup',
			'Should handle directory names with dots',
		);
	});

	it('should handle UNC paths on Windows', () => {
		// UNC path test - platform-specific
		const uncPath = '\\\\server\\share\\file.txt';
		const result = getDirname(uncPath);
		const expected = path.dirname(uncPath);
		assert.strictEqual(
			result,
			expected,
			'Should handle UNC paths on Windows correctly',
		);
	});

	it('should handle empty string', () => {
		const result = getDirname('');
		assert.strictEqual(result, '.', "Should return '.' for empty string");
	});

	it('should handle paths with only separators', () => {
		const result = getDirname('///');
		assert.strictEqual(result, '/', 'Should handle paths with only separators');
	});
});
