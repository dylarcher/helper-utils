import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { getExtension } from './getExtension.js';

describe('getExtension(p)', () => {
	it('should return file extension including the dot', () => {
		const result = getExtension('/path/to/file.txt');
		assert.strictEqual(result, '.txt', 'Should return extension with dot');
	});

	it('should handle files with no extension', () => {
		const result = getExtension('/path/to/README');
		assert.strictEqual(
			result,
			'',
			'Should return empty string for files without extension',
		);
	});

	it('should handle hidden files with extension', () => {
		const result = getExtension('/path/to/.gitignore');
		assert.strictEqual(
			result,
			'',
			'Should return empty string for hidden files without extension after dot',
		);
	});

	it('should handle hidden files with actual extension', () => {
		const result = getExtension('/path/to/.env.local');
		assert.strictEqual(
			result,
			'.local',
			'Should return extension for hidden files with extension',
		);
	});

	it('should handle files with multiple dots', () => {
		const result = getExtension('/path/to/file.tar.gz');
		assert.strictEqual(result, '.gz', 'Should return only the last extension');
	});

	it('should handle Windows-style paths', () => {
		const result = getExtension('C:\\path\\to\\file.exe');
		assert.strictEqual(result, '.exe', 'Should handle Windows path separators');
	});

	it('should handle paths with no directory', () => {
		const result = getExtension('file.js');
		assert.strictEqual(result, '.js', 'Should work with just the filename');
	});

	it('should handle directories ending with extension-like names', () => {
		const result = getExtension('/path/to/folder.backup/');
		// Node.js path.extname returns '.backup' here, we should match this behavior
		const expectedResult = path.extname('/path/to/folder.backup/');
		assert.strictEqual(
			result,
			expectedResult,
			'Should match Node.js behavior for paths ending with extension-like names',
		);
	});

	it('should handle current directory', () => {
		const result = getExtension('.');
		assert.strictEqual(result, '', 'Should return empty for current directory');
	});

	it('should handle parent directory', () => {
		const result = getExtension('..');
		assert.strictEqual(result, '', 'Should return empty for parent directory');
	});

	it('should handle root path', () => {
		const result = getExtension('/');
		assert.strictEqual(result, '', 'Should return empty for root path');
	});

	it('should handle files ending with dot', () => {
		const result = getExtension('/path/to/file.');
		assert.strictEqual(
			result,
			'.',
			'Should return dot for files ending with dot',
		);
	});

	it('should handle complex extensions', () => {
		const testCases = [
			['/path/to/file.min.js', '.js'],
			['/path/to/archive.tar.bz2', '.bz2'],
			['/path/to/backup.sql.gz', '.gz'],
			['/path/to/config.json.backup', '.backup'],
		];

		testCases.forEach(([testPath, expected]) => {
			const result = getExtension(testPath);
			assert.strictEqual(
				result,
				expected,
				`Should return ${expected} for ${testPath}`,
			);
		});
	});

	it('should handle special characters in filename', () => {
		const result = getExtension('/path/to/file with spaces & symbols!.txt');
		assert.strictEqual(
			result,
			'.txt',
			'Should handle special characters in filename',
		);
	});

	it('should handle long extensions', () => {
		const result = getExtension('/path/to/file.verylongextension');
		assert.strictEqual(
			result,
			'.verylongextension',
			'Should handle long extensions',
		);
	});

	it('should be consistent with Node.js path.extname', () => {
		const testPaths = [
			'/path/to/file.txt',
			'C:\\Windows\\System32\\file.exe',
			'file.js',
			'/path/to/README',
			'/path/to/.gitignore',
			'/path/to/.env.local',
			'/path/to/file.tar.gz',
			'.',
			'..',
			'/',
			'file.',
			'/path/to/file.min.js',
			'',
			'/path/to/directory.backup/',
			'file with spaces.txt',
		];

		testPaths.forEach(testPath => {
			const ourResult = getExtension(testPath);
			const nodeResult = path.extname(testPath);
			assert.strictEqual(
				ourResult,
				nodeResult,
				`Should match Node.js result for path: ${testPath}`,
			);
		});
	});

	it('should handle empty string', () => {
		const result = getExtension('');
		const nodeResult = path.extname('');
		assert.strictEqual(
			result,
			nodeResult,
			'Should handle empty string like Node.js',
		);
	});

	it('should handle paths with unicode characters', () => {
		const result = getExtension('/path/to/файл.txt');
		assert.strictEqual(
			result,
			'.txt',
			'Should handle unicode characters in filename',
		);
	});

	it('should handle numeric extensions', () => {
		const result = getExtension('/path/to/backup.001');
		assert.strictEqual(result, '.001', 'Should handle numeric extensions');
	});

	it('should handle case sensitivity', () => {
		const testCases = [
			['/path/to/file.TXT', '.TXT'],
			['/path/to/file.Js', '.Js'],
			['/path/to/FILE.txt', '.txt'],
		];

		testCases.forEach(([testPath, expected]) => {
			const result = getExtension(testPath);
			assert.strictEqual(
				result,
				expected,
				`Should preserve case for ${testPath}`,
			);
		});
	});
});
