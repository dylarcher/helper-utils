import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { getBasename } from './getBaseName.js';

describe('getBasename(p, ext)', () => {
	it('should return filename from path without extension parameter', () => {
		const result = getBasename('/path/to/file.txt');
		assert.strictEqual(
			result,
			'file.txt',
			'Should return filename with extension',
		);
	});

	it('should return filename without extension when extension parameter provided', () => {
		const result = getBasename('/path/to/file.txt', '.txt');
		assert.strictEqual(
			result,
			'file',
			'Should return filename without specified extension',
		);
	});

	it('should handle Windows-style paths', () => {
		const winPath = 'C:\\path\\to\\file.txt';
		const result = getBasename(winPath);

		// Get the expected result from Node.js path.basename
		const expected = path.basename(winPath);

		assert.strictEqual(
			result,
			expected,
			'Should handle Windows path separators properly',
		);
	});

	it('should handle Unix-style paths', () => {
		const result = getBasename('/usr/local/bin/node');
		assert.strictEqual(result, 'node', 'Should handle Unix paths');
	});

	it('should return directory name when path ends with separator', () => {
		const result = getBasename('/path/to/directory/');
		assert.strictEqual(
			result,
			'directory',
			'Should return directory name when path ends with separator',
		);
	});

	it('should handle paths with no directory', () => {
		const result = getBasename('file.txt');
		assert.strictEqual(result, 'file.txt', 'Should handle filename only');
	});

	it('should handle empty extension parameter', () => {
		const result = getBasename('/path/to/file.txt', '');
		assert.strictEqual(
			result,
			'file.txt',
			'Should return full filename when extension parameter is empty',
		);
	});

	it('should handle partial extension matches', () => {
		const result = getBasename('/path/to/file.txt', '.tx');
		assert.strictEqual(
			result,
			'file.txt',
			'Should not remove partial extension matches',
		);
	});

	it('should handle files with multiple dots', () => {
		const result = getBasename('/path/to/file.tar.gz', '.gz');
		assert.strictEqual(
			result,
			'file.tar',
			'Should remove only specified extension',
		);
	});

	it('should handle files with no extension', () => {
		const result = getBasename('/path/to/README');
		assert.strictEqual(
			result,
			'README',
			'Should return filename for files without extension',
		);
	});

	it('should handle hidden files (starting with dot)', () => {
		const result = getBasename('/path/to/.gitignore');
		assert.strictEqual(
			result,
			'.gitignore',
			'Should handle hidden files correctly',
		);
	});

	it('should handle root path', () => {
		const rootPath = '/';
		const result = getBasename(rootPath);

		// Get the expected result from Node.js path.basename
		const expected = path.basename(rootPath);

		assert.strictEqual(result, expected, 'Should handle root path correctly');
	});

	it('should handle current directory path', () => {
		const result = getBasename('.');
		assert.strictEqual(result, '.', 'Should handle current directory path');
	});

	it('should handle parent directory path', () => {
		const result = getBasename('..');
		assert.strictEqual(result, '..', 'Should handle parent directory path');
	});

	it('should handle complex paths with spaces and special characters', () => {
		const result = getBasename(
			'/path/to/file with spaces and (special) chars.txt',
		);
		assert.strictEqual(
			result,
			'file with spaces and (special) chars.txt',
			'Should handle filenames with spaces and special characters',
		);
	});

	it('should be consistent with Node.js path.basename', () => {
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

		paths.forEach(testPath => {
			const expected = path.basename(testPath);
			const result = getBasename(testPath);
			assert.strictEqual(
				result,
				expected,
				`Should match Node.js result for path: ${testPath}`,
			);
		});
	});

	it('should be consistent with Node.js path.basename with extension parameter', () => {
		const testCases = [
			{ path: '/path/to/file.txt', ext: '.txt' },
			{ path: '/path/to/file.tar.gz', ext: '.gz' },
			{ path: 'C:\\Windows\\file.exe', ext: '.exe' },
			{ path: 'script.js', ext: '.js' },
			{ path: 'path/to/file', ext: '' },
			{ path: 'path/to/file.txt', ext: '.csv' }, // Non-matching extension
		];

		testCases.forEach(({ path: testPath, ext }) => {
			const expected = path.basename(testPath, ext);
			const result = getBasename(testPath, ext);
			assert.strictEqual(
				result,
				expected,
				`Should match Node.js result for path: ${testPath} with ext: ${ext}`,
			);
		});
	});

	it('should handle empty string path', () => {
		const result = getBasename('');
		assert.strictEqual(
			result,
			'',
			'Should return empty string for empty input',
		);
	});
});
