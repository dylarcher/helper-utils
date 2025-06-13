import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { resolvePath } from './resolvePath.js';

describe('resolvePath(...paths)', () => {
	it('should resolve single absolute path', () => {
		const result = resolvePath('/usr/local/bin');
		assert.strictEqual(
			result,
			path.resolve('/usr/local/bin'),
			'Should resolve single absolute path',
		);
	});

	it('should resolve single relative path', () => {
		const result = resolvePath('./relative/path');
		assert.strictEqual(
			result,
			path.resolve('./relative/path'),
			'Should resolve single relative path',
		);
	});

	it('should resolve multiple path segments', () => {
		const result = resolvePath('path', 'to', 'file.txt');
		assert.strictEqual(
			result,
			path.resolve('path', 'to', 'file.txt'),
			'Should resolve multiple path segments',
		);
	});

	it('should resolve mixed absolute and relative paths', () => {
		const result = resolvePath('/base', './relative', '../parent', 'file.txt');
		assert.strictEqual(
			result,
			path.resolve('/base', './relative', '../parent', 'file.txt'),
			'Should resolve mixed paths',
		);
	});

	it('should handle current directory references', () => {
		const result = resolvePath('.', 'path', 'to', 'file.txt');
		assert.strictEqual(
			result,
			path.resolve('.', 'path', 'to', 'file.txt'),
			'Should handle current directory',
		);
	});

	it('should handle parent directory references', () => {
		const result = resolvePath('..', 'parent', 'file.txt');
		assert.strictEqual(
			result,
			path.resolve('..', 'parent', 'file.txt'),
			'Should handle parent directory',
		);
	});

	it('should handle no arguments', () => {
		const result = resolvePath();
		assert.strictEqual(result, path.resolve(), 'Should handle no arguments');
	});

	it('should resolve to absolute path', () => {
		const result = resolvePath('relative/path');
		assert.ok(path.isAbsolute(result), 'Should always return absolute path');
	});

	it('should handle Windows-style paths', () => {
		const result = resolvePath('C:', 'Windows', 'System32');
		assert.strictEqual(
			result,
			path.resolve('C:', 'Windows', 'System32'),
			'Should handle Windows paths',
		);
	});

	it('should handle Unix-style paths', () => {
		const result = resolvePath('/usr', 'local', 'bin');
		assert.strictEqual(
			result,
			path.resolve('/usr', 'local', 'bin'),
			'Should handle Unix paths',
		);
	});

	it('should normalize path separators', () => {
		const result = resolvePath('path/with/slashes', 'and\\backslashes');
		assert.strictEqual(
			result,
			path.resolve('path/with/slashes', 'and\\backslashes'),
			'Should normalize separators',
		);
	});

	it('should handle trailing separators', () => {
		const result = resolvePath('path/', 'to/', 'file.txt');
		assert.strictEqual(
			result,
			path.resolve('path/', 'to/', 'file.txt'),
			'Should handle trailing separators',
		);
	});

	it('should handle empty strings', () => {
		const result = resolvePath('path', '', 'to', 'file.txt');
		assert.strictEqual(
			result,
			path.resolve('path', '', 'to', 'file.txt'),
			'Should handle empty strings',
		);
	});

	it('should handle special characters in paths', () => {
		const result = resolvePath('path with spaces', 'file & symbols!.txt');
		assert.strictEqual(
			result,
			path.resolve('path with spaces', 'file & symbols!.txt'),
			'Should handle special characters',
		);
	});

	it('should handle unicode characters', () => {
		const result = resolvePath('パス', 'ファイル.txt');
		assert.strictEqual(
			result,
			path.resolve('パス', 'ファイル.txt'),
			'Should handle unicode characters',
		);
	});

	it('should resolve complex path navigation', () => {
		const result = resolvePath('/base', 'path', '..', 'other', './file.txt');
		assert.strictEqual(
			result,
			path.resolve('/base', 'path', '..', 'other', './file.txt'),
			'Should resolve complex navigation',
		);
	});

	it('should handle absolute path override', () => {
		const result = resolvePath('relative', '/absolute', 'more');
		assert.strictEqual(
			result,
			path.resolve('relative', '/absolute', 'more'),
			'Should handle absolute path override',
		);
	});

	it('should be consistent with Node.js path.resolve', () => {
		const testCases = [
			['/usr/local/bin'],
			['./relative/path'],
			['path', 'to', 'file.txt'],
			['/base', './relative', '../parent', 'file.txt'],
			['.', 'path', 'to', 'file.txt'],
			['..', 'parent', 'file.txt'],
			[],
			['C:', 'Windows', 'System32'],
			['/usr', 'local', 'bin'],
			['path/with/slashes', 'and\\backslashes'],
			['path/', 'to/', 'file.txt'],
			['path', '', 'to', 'file.txt'],
			['path with spaces', 'file & symbols!.txt'],
			['/base', 'path', '..', 'other', './file.txt'],
			['relative', '/absolute', 'more'],
		];

		testCases.forEach((testCase) => {
			const ourResult = resolvePath(...testCase);
			const nodeResult = path.resolve(...testCase);
			assert.strictEqual(
				ourResult,
				nodeResult,
				`Should match Node.js result for: ${testCase.join(', ')}`,
			);
		});
	});

	it('should handle root path', () => {
		const result = resolvePath('/');
		assert.strictEqual(result, path.resolve('/'), 'Should handle root path');
	});

	it('should handle many path segments', () => {
		const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		const result = resolvePath(...segments);
		assert.strictEqual(
			result,
			path.resolve(...segments),
			'Should handle many path segments',
		);
	});

	it('should resolve relative to current working directory', () => {
		const result = resolvePath('relative-file.txt');
		const expected = path.resolve(process.cwd(), 'relative-file.txt');
		assert.strictEqual(
			result,
			expected,
			'Should resolve relative to current working directory',
		);
	});

	it('should handle double dots correctly', () => {
		const result = resolvePath('/base/path', '..', '..', 'other');
		assert.strictEqual(
			result,
			path.resolve('/base/path', '..', '..', 'other'),
			'Should handle double dots',
		);
	});

	it('should handle mixed separators on Windows', () => {
		const result = resolvePath('path\\mixed/separators');
		assert.strictEqual(
			result,
			path.resolve('path\\mixed/separators'),
			'Should handle mixed separators',
		);
	});

	it('should handle UNC paths on Windows', () => {
		const result = resolvePath('\\\\server\\share', 'path', 'file.txt');
		assert.strictEqual(
			result,
			path.resolve('\\\\server\\share', 'path', 'file.txt'),
			'Should handle UNC paths',
		);
	});

	it('should handle edge cases with dots', () => {
		const testCases = [
			['.', '.'],
			['..', '..'],
			['...', 'file.txt'],
			['./././', 'file.txt'],
			['../../../', 'file.txt'],
		];

		testCases.forEach((testCase) => {
			const ourResult = resolvePath(...testCase);
			const nodeResult = path.resolve(...testCase);
			assert.strictEqual(
				ourResult,
				nodeResult,
				`Should match Node.js result for dots: ${testCase.join(', ')}`,
			);
		});
	});
});
