import { describe, test, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { fetchJSON } from "./fetchJSON.js";

describe("fetchJSON(url, options)", () => {
	let originalFetch;

	beforeEach(() => {
		originalFetch = global.fetch;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	test("should fetch and parse JSON successfully", async () => {
		const mockResponse = {
			ok: true,
			status: 200,
			statusText: "OK",
			headers: new Map([["content-type", "application/json"]]),
			json: async () => ({ message: "success" }),
			text: async () => "success text",
		};
		mockResponse.headers.get = (key) =>
			new Map([["content-type", "application/json"]]).get(key);

		global.fetch = async (url, options) => {
			assert.strictEqual(url, "https://api.example.com/data");
			return mockResponse;
		};

		const result = await fetchJSON("https://api.example.com/data");
		assert.deepStrictEqual(result, { message: "success" });
	});

	test("should set default headers correctly", async () => {
		const mockResponse = {
			ok: true,
			status: 200,
			headers: new Map([["content-type", "application/json"]]),
			json: async () => ({ message: "success" }),
		};
		mockResponse.headers.get = (key) =>
			new Map([["content-type", "application/json"]]).get(key);

		global.fetch = async (url, options) => {
			assert.strictEqual(options.headers.Accept, "application/json");
			assert.strictEqual(options.headers["Content-Type"], undefined);
			return mockResponse;
		};

		await fetchJSON("https://api.example.com/data");
	});

	test("should stringify object body and set content-type", async () => {
		const testBody = { name: "test", value: 123 };
		const mockResponse = {
			ok: true,
			status: 200,
			headers: new Map([["content-type", "application/json"]]),
			json: async () => ({ message: "success" }),
		};
		mockResponse.headers.get = (key) =>
			new Map([["content-type", "application/json"]]).get(key);

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

	test("should handle non-ok response", async () => {
		const errorResponse = {
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

	test("should handle 204 No Content response", async () => {
		const noContentResponse = {
			ok: true,
			status: 204,
			headers: new Map(),
		};
		noContentResponse.headers.get = () => null;

		global.fetch = async () => noContentResponse;

		const result = await fetchJSON("https://api.example.com/data");
		assert.strictEqual(result, null);
	});
});
