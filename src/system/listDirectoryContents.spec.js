import { describe, it, beforeEach, afterEach, mock } from 'node:test'; // Added mock
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { listDirectoryContents } from './listDirectoryContents.js';


const PERF_TEST_ENABLED = false; // Set to true to enable performance tests

describe('listDirectoryContents(dirPath)', () => {
	let testDir;
	let testFiles;

	beforeEach(async () => {
		testDir = path.join(process.cwd(), 'test-list-directory');
		testFiles = ['file1.txt', 'file2.js', 'file3.md'];

		await fs.mkdir(testDir);

		// Create test files
		for (const file of testFiles) {
			await fs.writeFile(path.join(testDir, file), `Content of ${file}`);
		}

		// Create a subdirectory
		await fs.mkdir(path.join(testDir, 'subdir'));
	});

	afterEach(async () => {
		try {
			await fs.rm(testDir, { recursive: true, force: true });
		} catch {
			// Directory might not exist, ignore error
		}
	});

	it('should return an array of filenames', async () => {
		const contents = await listDirectoryContents(testDir);

		assert.ok(Array.isArray(contents), 'Should return an array');
		assert.ok(
			contents.length > 0,
			'Should return non-empty array for non-empty directory',
		);
	});

	it('should include all files and directories', async () => {
		const contents = await listDirectoryContents(testDir);

		testFiles.forEach((file) => {
			assert.ok(contents.includes(file), `Should include file: ${file}`);
		});

		assert.ok(contents.includes('subdir'), 'Should include subdirectory');
	});

	it('should return only filenames without full paths', async () => {
		const contents = await listDirectoryContents(testDir);

		contents.forEach((item) => {
			assert.ok(
				!item.includes(path.sep),
				`Item should be filename only, not path: ${item}`,
			);
		});
	});

	it('should handle empty directory', async () => {
		const emptyDir = path.join(process.cwd(), 'empty-test-dir');
		await fs.mkdir(emptyDir);

		try {
			const contents = await listDirectoryContents(emptyDir);
			assert.ok(
				Array.isArray(contents),
				'Should return array for empty directory',
			);
			assert.strictEqual(
				contents.length,
				0,
				'Should return empty array for empty directory',
			);
		} finally {
			await fs.rmdir(emptyDir);
		}
	});

	it('should handle absolute paths', async () => {
		const absolutePath = path.resolve(testDir);
		const contents = await listDirectoryContents(absolutePath);

		assert.ok(Array.isArray(contents), 'Should work with absolute paths');
		assert.ok(contents.length > 0, 'Should return contents for absolute path');
	});

	it('should handle relative paths', async () => {
		// Create a directory relative to current working directory
		const relativeDir = './relative-test-dir';
		await fs.mkdir(relativeDir);
		await fs.writeFile(path.join(relativeDir, 'test.txt'), 'test');

		try {
			const contents = await listDirectoryContents(relativeDir);
			assert.ok(Array.isArray(contents), 'Should work with relative paths');
			assert.ok(
				contents.includes('test.txt'),
				'Should include files in relative directory',
			);
		} finally {
			await fs.rm(relativeDir, { recursive: true, force: true });
		}
	});

	it('should handle current directory', async () => {
		const contents = await listDirectoryContents('.');

		assert.ok(Array.isArray(contents), 'Should work with current directory');
		assert.ok(contents.length > 0, 'Current directory should have contents');
	});

	it('should be consistent with fs.readdir', async () => {
		const ourResult = await listDirectoryContents(testDir);
		const fsResult = await fs.readdir(testDir);

		assert.deepStrictEqual(
			ourResult.sort(),
			fsResult.sort(),
			'Should return same result as fs.readdir',
		);
	});

	it('should reject for non-existent directory', async () => {
		const nonExistentDir = path.join(process.cwd(), 'non-existent-directory');

		await assert.rejects(async () => {
			await listDirectoryContents(nonExistentDir);
		}, 'Should reject for non-existent directory');
	});

	it('should reject when trying to list a file instead of directory', async () => {
		const testFile = path.join(testDir, testFiles[0]);

		await assert.rejects(async () => {
			await listDirectoryContents(testFile);
		}, 'Should reject when trying to list a file');
	});

	it('should handle special characters in filenames', async () => {
		const specialFiles = [
			'file with spaces.txt',
			'file&with&symbols!.txt',
			'ファイル.txt',
		];

		for (const file of specialFiles) {
			await fs.writeFile(path.join(testDir, file), 'content');
		}

		const contents = await listDirectoryContents(testDir);

		specialFiles.forEach((file) => {
			assert.ok(
				contents.includes(file),
				`Should include file with special characters: ${file}`,
			);
		});
	});

	it('should handle hidden files (starting with dot)', async () => {
		const hiddenFiles = ['.gitignore', '.env', '.hidden'];

		for (const file of hiddenFiles) {
			await fs.writeFile(path.join(testDir, file), 'content');
		}

		const contents = await listDirectoryContents(testDir);

		hiddenFiles.forEach((file) => {
			assert.ok(contents.includes(file), `Should include hidden file: ${file}`);
		});
	});

	it('should handle nested directory structure', async () => {
		const nestedDir = path.join(testDir, 'nested', 'deep');
		await fs.mkdir(nestedDir, { recursive: true });
		await fs.writeFile(path.join(nestedDir, 'deep-file.txt'), 'deep content');

		// List the nested directory
		const contents = await listDirectoryContents(nestedDir);
		assert.ok(
			contents.includes('deep-file.txt'),
			'Should list contents of nested directory',
		);

		// List the parent should show the nested directory
		const parentContents = await listDirectoryContents(
			path.join(testDir, 'nested'),
		);
		assert.ok(
			parentContents.includes('deep'),
			'Should show nested directory in parent listing',
		);
	});

	it('should handle large number of files', async () => {
		const largeDir = path.join(process.cwd(), 'large-test-dir');
		await fs.mkdir(largeDir);

		try {
			const fileCount = 100;
			const expectedFiles = [];

			for (let i = 0; i < fileCount; i++) {
				const fileName = `file${i.toString().padStart(3, '0')}.txt`;
				expectedFiles.push(fileName);
				await fs.writeFile(path.join(largeDir, fileName), `Content ${i}`);
			}

			const contents = await listDirectoryContents(largeDir);
			assert.strictEqual(contents.length, fileCount, 'Should return all files');

			expectedFiles.forEach((file) => {
				assert.ok(contents.includes(file), `Should include file: ${file}`);
			});
		} finally {
			await fs.rm(largeDir, { recursive: true, force: true });
		}
	});
});

describe('Async Generator Behavior (Mocked fs.promises.readdir)', () => {
  it('should return an async generator', (t) => {
    const result = listDirectoryContents('dummy_path');
    assert.ok(result, 'Should return a value');
    assert.strictEqual(typeof result[Symbol.asyncIterator], 'function', 'Should have Symbol.asyncIterator method');
  });

  it('should yield all items from fs.promises.readdir (mocked)', async (t) => {
    const mockItems = ['file1.txt', 'file2.js', 'subdir'];
    const readdirMock = mock.fn(fs.promises, 'readdir', async (dirPath) => {
      assert.strictEqual(dirPath, 'test_dir_mocked', 'readdir called with correct path');
      return Promise.resolve(mockItems);
    });
    t.after(() => readdirMock.restore());

    const yieldedItems = [];
    for await (const item of listDirectoryContents('test_dir_mocked')) {
      yieldedItems.push(item);
    }

    assert.deepStrictEqual(yieldedItems, mockItems, 'Should yield all mocked items in order');
    assert.strictEqual(readdirMock.mock.calls.length, 1, 'fs.promises.readdir should have been called once');
  });

  it('should yield no items for an empty directory (mocked)', async (t) => {
    const readdirMock = mock.fn(fs.promises, 'readdir', async (dirPath) => {
      assert.strictEqual(dirPath, 'empty_dir_mocked', 'readdir called with correct path');
      return Promise.resolve([]);
    });
    t.after(() => readdirMock.restore());

    const yieldedItems = [];
    for await (const item of listDirectoryContents('empty_dir_mocked')) {
      yieldedItems.push(item); // Should not happen
    }

    assert.strictEqual(yieldedItems.length, 0, 'Should yield no items for an empty directory');
    assert.strictEqual(readdirMock.mock.calls.length, 1, 'fs.promises.readdir should have been called once');
  });

  it('should propagate errors from fs.promises.readdir (mocked)', async (t) => {
    const mockError = new Error('Mocked readdir failure');
    const readdirMock = mock.fn(fs.promises, 'readdir', async (dirPath) => {
      assert.strictEqual(dirPath, 'error_dir_mocked', 'readdir called with correct path');
      return Promise.reject(mockError);
    });
    t.after(() => readdirMock.restore());

    await assert.rejects(
      async () => {
        // Attempt to consume the generator
        for await (const item of listDirectoryContents('error_dir_mocked')) {
          // This loop should not run
        }
      },
      mockError, // Check if the propagated error is the same as the mocked one
      'Should propagate the error from fs.promises.readdir'
    );
    assert.strictEqual(readdirMock.mock.calls.length, 1, 'fs.promises.readdir should have been called once');
  });
});


describe('Performance Tests for listDirectoryContents', () => {
  const describeOrSkip = PERF_TEST_ENABLED ? describe : describe.skip;

  describeOrSkip('Large directory simulation (mocked fs.readdir)', () => {
    it('should perform efficiently when listing a large number of simulated files', async (t) => {
      const fileCount = 100000; // Simulate a directory with 100,000 files
      const mockFiles = [];
      for (let i = 0; i < fileCount; i++) {
        mockFiles.push(`simulated_file_${i}.txt`);
      }

      // Using node:test's built-in mocking capabilities
      const readdirMock = mock.fn(fs.promises, 'readdir', async (dirPath) => {
        if (dirPath === 'perf_test_dummy_dir') {
          return Promise.resolve(mockFiles);
        }
        // Fallback to original behavior or throw if path not expected
        // For this test, we expect only 'perf_test_dummy_dir'
        throw new Error(`Mock readdir called with unexpected path: ${dirPath}`);
      });
      // Ensure mock is restored after the test
      t.after(() => readdirMock.restore());


      let count = 0;
      console.log(`[INFO] Running listDirectoryContents performance test with ${fileCount} simulated files.`);
      console.time('listDirectoryContents performance');
      for await (const item of listDirectoryContents('perf_test_dummy_dir')) {
        count++;
        // Minimal check on item to ensure it's being processed
        if (typeof item !== 'string') {
          // This check helps ensure the generator is actually yielding values.
          // In a real scenario, more robust checks might be needed if item processing was complex.
        }
      }
      console.timeEnd('listDirectoryContents performance');

      assert.strictEqual(count, fileCount, 'Should have yielded all simulated files');
      assert.strictEqual(readdirMock.mock.calls.length, 1, 'fs.promises.readdir should have been called once');
    });
  });
});
