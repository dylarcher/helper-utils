import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { joinPaths } from './joinPaths.js';

describe('joinPaths(...paths)', () => {
	it('should join two simple paths', () => {
		const result = joinPaths('path', 'to');
		assert.strictEqual(
			result,
			path.join('path', 'to'),
			'Should join two simple paths',
		);
	});

	it('should join multiple paths', () => {
		const result = joinPaths('path', 'to', 'file.txt');
		assert.strictEqual(
			result,
			path.join('path', 'to', 'file.txt'),
			'Should join multiple paths',
		);
	});

	it('should handle absolute paths', () => {
		const result = joinPaths('/root', 'path', 'to', 'file.txt');
		assert.strictEqual(
			result,
			path.join('/root', 'path', 'to', 'file.txt'),
			'Should handle absolute paths',
		);
	});

	it('should handle relative paths', () => {
		const result = joinPaths('./path', '../parent', 'file.txt');
		assert.strictEqual(
			result,
			path.join('./path', '../parent', 'file.txt'),
			'Should handle relative paths',
		);
	});

	it('should handle empty strings', () => {
		const result = joinPaths('path', '', 'to', 'file.txt');
		assert.strictEqual(
			result,
			path.join('path', '', 'to', 'file.txt'),
			'Should handle empty strings',
		);
	});

	it('should handle single path', () => {
		const result = joinPaths('single-path');
		assert.strictEqual(
			result,
			path.join('single-path'),
			'Should handle single path',
		);
	});

	it('should handle no arguments', () => {
		const result = joinPaths();
		assert.strictEqual(result, path.join(), 'Should handle no arguments');
	});

	it('should normalize path separators', () => {
		const result = joinPaths('path/with/slashes', 'and\\backslashes');
		assert.strictEqual(
			result,
			path.join('path/with/slashes', 'and\\backslashes'),
			'Should normalize separators',
		);
	});

	it('should handle Windows-style paths', () => {
		const result = joinPaths('C:', 'Windows', 'System32');
		assert.strictEqual(
			result,
			path.join('C:', 'Windows', 'System32'),
			'Should handle Windows paths',
		);
	});

	it('should handle Unix-style paths', () => {
		const result = joinPaths('/usr', 'local', 'bin');
		assert.strictEqual(
			result,
			path.join('/usr', 'local', 'bin'),
			'Should handle Unix paths',
		);
	});

	it('should handle current directory references', () => {
		const result = joinPaths('.', 'path', 'to', 'file.txt');
		assert.strictEqual(
			result,
			path.join('.', 'path', 'to', 'file.txt'),
			'Should handle current directory',
		);
	});

	it('should handle parent directory references', () => {
		const result = joinPaths('..', 'parent', 'file.txt');
		assert.strictEqual(
			result,
			path.join('..', 'parent', 'file.txt'),
			'Should handle parent directory',
		);
	});

	it('should handle trailing separators', () => {
		const result = joinPaths('path/', 'to/', 'file.txt');
		assert.strictEqual(
			result,
			path.join('path/', 'to/', 'file.txt'),
			'Should handle trailing separators',
		);
	});

	it('should handle leading separators', () => {
		const result = joinPaths('/path', '/to', '/file.txt');
		assert.strictEqual(
			result,
			path.join('/path', '/to', '/file.txt'),
			'Should handle leading separators',
		);
	});

	it('should handle special characters in paths', () => {
		const result = joinPaths('path with spaces', 'file & symbols!.txt');
		assert.strictEqual(
			result,
			path.join('path with spaces', 'file & symbols!.txt'),
			'Should handle special characters',
		);
	});

	it('should handle unicode characters', () => {
		const result = joinPaths('パス', 'ファイル.txt');
		assert.strictEqual(
			result,
			path.join('パス', 'ファイル.txt'),
			'Should handle unicode characters',
		);
	});

	it('should handle many arguments', () => {
		const paths = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		const result = joinPaths(...paths);
		assert.strictEqual(
			result,
			path.join(...paths),
			'Should handle many arguments',
		);
	});

	it('should be consistent with Node.js path.join', () => {
		const testCases = [
			['path', 'to', 'file.txt'],
			['/root', 'path', 'to', 'file.txt'],
			['./path', '../parent', 'file.txt'],
			['path', '', 'to', 'file.txt'],
			['single-path'],
			[],
			['path/with/slashes', 'and\\backslashes'],
			['C:', 'Windows', 'System32'],
			['/usr', 'local', 'bin'],
			['.', 'path', 'to', 'file.txt'],
			['..', 'parent', 'file.txt'],
			['path/', 'to/', 'file.txt'],
			['/path', '/to', '/file.txt'],
			['path with spaces', 'file & symbols!.txt'],
		];

		testCases.forEach((testCase) => {
			const ourResult = joinPaths(...testCase);
			const nodeResult = path.join(...testCase);
			assert.strictEqual(
				ourResult,
				nodeResult,
				`Should match Node.js result for: ${testCase.join(', ')}`,
			);
		});
	});

	it('should handle null and undefined gracefully', () => {
		// Note: path.join would throw for null/undefined, but we should test our function's behavior
		try {
			const result = joinPaths('path', null, 'file.txt');
			const nodeResult = path.join('path', null, 'file.txt');
			assert.strictEqual(result, nodeResult, 'Should handle null like Node.js');
		} catch (_error) {
			// If Node.js throws, our function should behave similarly
			assert.throws(() => {
				joinPaths('path', null, 'file.txt');
			}, 'Should throw like Node.js for null values');
		}
	});

	it('should handle root path correctly', () => {
		const result = joinPaths('/');
		assert.strictEqual(result, path.join('/'), 'Should handle root path');
	});

	it('should resolve complex path combinations', () => {
		const result = joinPaths('/base', './current', '../parent', 'final');
		assert.strictEqual(
			result,
			path.join('/base', './current', '../parent', 'final'),
			'Should resolve complex combinations',
		);
	});
});
