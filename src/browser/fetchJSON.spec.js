import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { fetchJSON } from "src/browser/fetchJSON.js";

describe("fetchJSON(url, options)", () => {
	let originalFetch;
	let mockResponse;

	beforeEach(() => {
		originalFetch = global.fetch;

		// Create a mock response
		mockResponse = {
			ok: true,
			status: 200,
			statusText: "OK",
			headers: new Map([["content-type", "application/json"]]),
			json: async () => ({ message: "success" }),
			text: async () => "success text",
		};

		// Add a get method to headers
		mockResponse.headers.get = (key) => mockResponse.headers.get(key);
	});

	it("should fetch and parse JSON successfully", async () => {
		global.fetch = async (url, options) => {
			assert.strictEqual(url, "https://api.example.com/data");
			return mockResponse;
		};

		const result = await fetchJSON("https://api.example.com/data");
		assert.deepStrictEqual(result, { message: "success" });
	});

	it("should set default headers correctly", async () => {
		global.fetch = async (url, options) => {
			assert.strictEqual(options.headers.Accept, "application/json");
			assert.strictEqual(options.headers["Content-Type"], undefined);
			return mockResponse;
		};

		await fetchJSON("https://api.example.com/data");
	});

	it("should stringify object body and set content-type", async () => {
		const testBody = { name: "test", value: 123 };

		global.fetch = async (url, options) => {
			assert.strictEqual(options.body, JSON.stringify(testBody));
			assert.strictEqual(options.headers["Content-Type"], "application/json");
			return mockResponse;
		};

		await fetchJSON("https://api.example.com/data", {
			method: "POST",
			body: testBody,
		});
	});

	it("should not stringify FormData body", async () => {
		const formData = new FormData();
		formData.append("key", "value");

		global.fetch = async (url, options) => {
			assert.strictEqual(options.body, formData);
			assert.strictEqual(options.headers["Content-Type"], undefined);
			return mockResponse;
		};

		await fetchJSON("https://api.example.com/data", {
			method: "POST",
			body: formData,
		});
	});

	it("should merge custom headers with defaults", async () => {
		global.fetch = async (url, options) => {
			assert.strictEqual(options.headers.Accept, "application/json");
			assert.strictEqual(options.headers["Custom-Header"], "custom-value");
			assert.strictEqual(options.headers.Authorization, "Bearer token");
			return mockResponse;
		};

		await fetchJSON("https://api.example.com/data", {
			headers: {
				"Custom-Header": "custom-value",
				Authorization: "Bearer token",
			},
		});
	});

	it("should throw error for non-ok response", async () => {
		const errorResponse = {
			...mockResponse,
			ok: false,
			status: 404,
			statusText: "Not Found",
			text: async () => "Resource not found",
		};

		global.fetch = async () => errorResponse;

		await assert.rejects(() => fetchJSON("https://api.example.com/notfound"), {
			name: "Error",
			message: "HTTP error 404: Not Found. Body: Resource not found",
		});
	});

	it("should handle 204 No Content response", async () => {
		const noContentResponse = {
			...mockResponse,
			status: 204,
			headers: new Map(),
		};
		noContentResponse.headers.get = () => null;

		global.fetch = async () => noContentResponse;

		const result = await fetchJSON("https://api.example.com/data");
		assert.strictEqual(result, null);
	});

	it("should handle non-JSON content-type", async () => {
		const textResponse = {
			...mockResponse,
			headers: new Map([["content-type", "text/plain"]]),
		};
		textResponse.headers.get = (key) => {
			if (key === "content-type") {
				return "text/plain";
			}
			return null;
		};

		global.fetch = async () => textResponse;

		const result = await fetchJSON("https://api.example.com/data");
		assert.strictEqual(result, null);
	});

	it("should handle missing content-type header", async () => {
		const noHeaderResponse = {
			...mockResponse,
			headers: new Map(),
		};
		noHeaderResponse.headers.get = () => null;

		global.fetch = async () => noHeaderResponse;

		const result = await fetchJSON("https://api.example.com/data");
		assert.strictEqual(result, null);
	});

	it("should pass through all fetch options", async () => {
		const options = {
			method: "PUT",
			credentials: "include",
			mode: "cors",
			cache: "no-cache",
		};

		global.fetch = async (url, fetchOptions) => {
			assert.strictEqual(fetchOptions.method, "PUT");
			assert.strictEqual(fetchOptions.credentials, "include");
			assert.strictEqual(fetchOptions.mode, "cors");
			assert.strictEqual(fetchOptions.cache, "no-cache");
			return mockResponse;
		};

		await fetchJSON("https://api.example.com/data", options);
	});

	// Cleanup
	beforeEach(() => {
		global.fetch = originalFetch;
	});
});
