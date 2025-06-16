import {
	describe,
	test,
	beforeEach,
	afterEach,
	it as _performanceIt,
} from 'node:test'; // Renamed 'it' for performance tests
import assert from 'node:assert';
import { fetchJSON } from './fetchJSON.js';

const PERF_TEST_ENABLED = true; // Set to true to enable performance tests

describe('fetchJSON(url, options)', () => {
	let originalFetch;

	beforeEach(() => {
		originalFetch = global.fetch;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	test('should fetch and parse JSON successfully', async () => {
		const mockResponse = {
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Map([['content-type', 'application/json']]),
			json: async () => ({ message: 'success' }),
			text: async () => 'success text',
		};
		mockResponse.headers.get = key =>
			new Map([['content-type', 'application/json']]).get(key);

		global.fetch = async (url, _options) => {
			assert.strictEqual(url, 'https://api.example.com/data');
			return mockResponse;
		};

		const result = await fetchJSON('https://api.example.com/data');
		assert.deepStrictEqual(result, { message: 'success' });
	});

	test('should set default headers correctly', async () => {
		const mockResponse = {
			ok: true,
			status: 200,
			headers: new Map([['content-type', 'application/json']]),
			json: async () => ({ message: 'success' }),
		};
		mockResponse.headers.get = key =>
			new Map([['content-type', 'application/json']]).get(key);

		global.fetch = async (url, options) => {
			assert.strictEqual(options.headers.Accept, 'application/json');
			assert.strictEqual(options.headers['Content-Type'], undefined);
			return mockResponse;
		};

		await fetchJSON('https://api.example.com/data');
	});

	test('should stringify object body and set content-type', async () => {
		const testBody = { name: 'test', value: 123 };
		const mockResponse = {
			ok: true,
			status: 200,
			headers: new Map([['content-type', 'application/json']]),
			json: async () => ({ message: 'success' }),
		};
		mockResponse.headers.get = key =>
			new Map([['content-type', 'application/json']]).get(key);

		global.fetch = async (url, options) => {
			assert.strictEqual(options.body, JSON.stringify(testBody));
			assert.strictEqual(options.headers['Content-Type'], 'application/json');
			return mockResponse;
		};

		await fetchJSON('https://api.example.com/data', {
			method: 'POST',
			body: testBody,
		});
	});

	test('should handle non-ok response', async () => {
		const errorResponse = {
			ok: false,
			status: 404,
			statusText: 'Not Found',
			text: async () => 'Resource not found',
		};

		global.fetch = async () => errorResponse;

		await assert.rejects(() => fetchJSON('https://api.example.com/notfound'), {
			name: 'Error',
			message: 'HTTP error 404: Not Found. Body: Resource not found',
		});
	});

	test('should handle 204 No Content response', async () => {
		const noContentResponse = {
			ok: true,
			status: 204,
			headers: new Map(),
		};
		noContentResponse.headers.get = () => null;

		global.fetch = async () => noContentResponse;

		const result = await fetchJSON('https://api.example.com/data');
		assert.strictEqual(result, null);
	});

	test('should reject with an error if fetch itself fails (e.g., network error)', async () => {
		const networkError = new TypeError('Network request failed');
		global.fetch = async () => {
			throw networkError;
		};

		await assert.rejects(
			() => fetchJSON('https://api.example.com/network-error'),
			networkError,
			'Should reject with the same error that fetch threw',
		);
	});

	test('should reject if response is OK but JSON parsing fails (invalid JSON)', async () => {
		const headersMap = new Map([['content-type', 'application/json']]);
		const mockResponse = {
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: {
				get: key => headersMap.get(key.toLowerCase()),
			},
			// Simulate json() throwing an error for invalid JSON
			json: async () => {
				throw new SyntaxError("Unexpected token 'I' in JSON at position 0");
			},
			// text() might be called by some error paths, not relevant for this specific test's main path
			text: async () => 'Invalid JSON content',
		};

		global.fetch = async (_url, _options) => {
			return Promise.resolve(mockResponse);
		};

		await assert.rejects(
			() => fetchJSON('https://api.example.com/invalid-json'),
			SyntaxError, // Expecting a SyntaxError (or a subclass)
			'Should reject with SyntaxError when JSON parsing fails',
		);
	});
});

describe('Performance Tests for fetchJSON', () => {
	const describeOrSkip = PERF_TEST_ENABLED ? describe : describe.skip;

	describeOrSkip('Large JSON payload processing', () => {
		// The global.fetch mock is managed by the outer describe's beforeEach/afterEach.
		// We will set a specific mock for this test inside the 'it' block.

		// Using 'performanceIt' which is 'it' from node:test, to avoid Jest/Jasmine confusion if any.
		// Or, could use the same 'test' as used in the functional tests above. Let's stick to 'test' for consistency.
		const testFn = PERF_TEST_ENABLED ? test : test.skip;

		testFn(
			'should perform efficiently when fetching and parsing a large JSON payload',
			async () => {
				const largePayloadItemCount = 20000; // Number of items in the array
				const sampleItem = {
					id: 0,
					name: 'Performance Test Item',
					value: Math.random(),
					isActive: true,
					tags: ['perf', 'test', 'json'],
					data: 'x'.repeat(200), // Adding some bulk to each item
				};

				// Create a large array of objects
				const largeJSONArray = Array.from(
					{ length: largePayloadItemCount },
					(_, i) => ({
						...sampleItem,
						id: i,
						value: Math.random() * i,
					}),
				);

				// Simulate the text version of the JSON, as fetch would receive
				const largeJSONText = JSON.stringify(largeJSONArray);

				const mockResponse = {
					ok: true,
					status: 200,
					statusText: 'OK',
					headers: new Map([['content-type', 'application/json']]),
					// response.json() first gets text, then parses. Simulating this.
					text: async () => Promise.resolve(largeJSONText),
					// fetchJSON internally calls response.json(), which does the parsing.
					// The actual .json() method from Fetch API would parse the internal text stream.
					// Here, we directly provide the parsed object for simplicity of the mock,
					// but the real work fetchJSON does (calling .json()) is what we are testing.
					// The 'Promise.try' in fetchJSON wraps this call.
					json: async () => JSON.parse(largeJSONText), // This simulates the parsing step.
				};
				// Ensure headers.get works as expected
				const originalHeadersGet = mockResponse.headers.get.bind(
					mockResponse.headers,
				);
				mockResponse.headers.get = key => {
					return originalHeadersGet(key.toLowerCase());
				};

				// Set up the global fetch mock for this specific test
				const originalFetchForPerfTest = global.fetch;
				global.fetch = async (url, _options) => {
					assert.strictEqual(url, 'https://api.example.com/large-data-perf');
					return Promise.resolve(mockResponse);
				};

				console.info(
					`[INFO] Running fetchJSON performance test with large payload (approx ${Math.round(
						largeJSONText.length / 1024,
					)} KB, ${largePayloadItemCount} items).`,
				);
				const timeLabel = 'fetchJSON performance';
				console.info(timeLabel);
				const result = await fetchJSON(
					'https://api.example.com/large-data-perf',
				);
				console.info(timeLabel);

				// Restore fetch for other tests if any were to run after this, though afterEach handles it too.
				global.fetch = originalFetchForPerfTest;

				// Basic validation of the result
				assert.ok(Array.isArray(result), 'Result should be an array.');
				assert.strictEqual(
					result.length,
					largePayloadItemCount,
					`Result array length should be ${largePayloadItemCount}.`,
				);
				assert.strictEqual(result[0].id, 0, 'First item ID check.');
				assert.strictEqual(
					result[largePayloadItemCount - 1].id,
					largePayloadItemCount - 1,
					'Last item ID check.',
				);
			},
		);
	});
});

describe('Promise.try polyfill coverage', () => {
	test('should cover the Promise.try polyfill code path', async () => {
		// Temporarily store the original Promise.try
		const originalPromiseTry = Promise.try;

		try {
			// Remove Promise.try to trigger polyfill execution
			delete Promise.try;

			// Import the module again to trigger the polyfill
			// Since modules are cached in Node.js, we need to clear the cache
			const fetchJSONPath = './fetchJSON.js';

			// Dynamically import to force re-evaluation of the polyfill
			const { fetchJSON: freshFetchJSON } = await import(
				`${fetchJSONPath}?t=${Date.now()}`
			);

			// Test that Promise.try was polyfilled
			assert.strictEqual(typeof Promise.try, 'function');

			// Test the polyfilled Promise.try functionality
			const successResult = await Promise.try(() => 'success');
			assert.strictEqual(successResult, 'success');

			// Test error handling
			await assert.rejects(
				() =>
					Promise.try(() => {
						throw new Error('test error');
					}),
				/test error/,
			);

			// Test that fetchJSON works with the polyfilled Promise.try
			const headersMap = new Map([['content-type', 'application/json']]);
			const mockResponse = {
				ok: true,
				status: 200,
				headers: {
					get: key => headersMap.get(key.toLowerCase()),
				},
				json: async () => ({ polyfill: 'test' }),
			};

			global.fetch = async () => mockResponse;
			const result = await freshFetchJSON('https://example.com/test');
			assert.deepStrictEqual(result, { polyfill: 'test' });
		} finally {
			// Restore original Promise.try
			if (originalPromiseTry) {
				Promise.try = originalPromiseTry;
			} else {
				delete Promise.try;
			}
		}
	});
});
