import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { parseQueryParams } from "src/browser/parseQueryParams.js";

describe("parseQueryParams(queryString)", () => {
	let originalWindow;

	beforeEach(() => {
		originalWindow = global.window;
		global.window = {
			location: {
				search: "?default=value&test=123",
			},
		};
	});

	it("should parse simple query parameters", () => {
		const result = parseQueryParams("?name=John&age=30");

		assert.deepStrictEqual(result, {
			name: "John",
			age: "30",
		});
	});

	it("should use window.location.search by default", () => {
		const result = parseQueryParams();

		assert.deepStrictEqual(result, {
			default: "value",
			test: "123",
		});
	});

	it("should handle empty query string", () => {
		const result = parseQueryParams("");

		assert.deepStrictEqual(result, {});
	});

	it("should handle query string without question mark", () => {
		const result = parseQueryParams("name=Alice&city=Boston");

		assert.deepStrictEqual(result, {
			name: "Alice",
			city: "Boston",
		});
	});

	it("should handle URL encoded values", () => {
		const result = parseQueryParams(
			"?message=Hello%20World&email=test%40example.com",
		);

		assert.deepStrictEqual(result, {
			message: "Hello World",
			email: "test@example.com",
		});
	});

	it("should handle parameters with no values", () => {
		const result = parseQueryParams("?debug&verbose&mode=test");

		assert.deepStrictEqual(result, {
			debug: "",
			verbose: "",
			mode: "test",
		});
	});

	it("should handle parameters with empty values", () => {
		const result = parseQueryParams("?name=&age=25&city=");

		assert.deepStrictEqual(result, {
			name: "",
			age: "25",
			city: "",
		});
	});

	it("should handle duplicate parameter names (last one wins)", () => {
		const result = parseQueryParams("?color=red&color=blue&color=green");

		assert.deepStrictEqual(result, {
			color: "green",
		});
	});

	it("should handle special characters in parameter names", () => {
		const result = parseQueryParams(
			"?user-name=John&user_id=123&filter[type]=active",
		);

		assert.deepStrictEqual(result, {
			"user-name": "John",
			user_id: "123",
			"filter[type]": "active",
		});
	});

	it("should handle plus signs as spaces", () => {
		const result = parseQueryParams("?message=Hello+World&name=John+Doe");

		assert.deepStrictEqual(result, {
			message: "Hello World",
			name: "John Doe",
		});
	});

	it("should handle complex query strings", () => {
		const complexQuery =
			"?search=javascript+tutorial&category=programming&tags=web%2Cdev&page=2&sort=date&order=desc";
		const result = parseQueryParams(complexQuery);

		assert.deepStrictEqual(result, {
			search: "javascript tutorial",
			category: "programming",
			tags: "web,dev",
			page: "2",
			sort: "date",
			order: "desc",
		});
	});

	it("should handle parameters with equals signs in values", () => {
		const result = parseQueryParams("?equation=x%3D5&formula=a%3Db%2Bc");

		assert.deepStrictEqual(result, {
			equation: "x=5",
			formula: "a=b+c",
		});
	});

	it("should handle array-like parameters", () => {
		const result = parseQueryParams(
			"?items[]=apple&items[]=banana&items[]=cherry",
		);

		assert.deepStrictEqual(result, {
			"items[]": "cherry", // URLSearchParams takes the last value
		});
	});

	it("should handle numeric-looking values as strings", () => {
		const result = parseQueryParams("?id=123&price=19.99&count=0");

		assert.deepStrictEqual(result, {
			id: "123",
			price: "19.99",
			count: "0",
		});

		// Verify they're strings, not numbers
		assert.strictEqual(typeof result.id, "string");
		assert.strictEqual(typeof result.price, "string");
		assert.strictEqual(typeof result.count, "string");
	});

	it("should handle boolean-looking values as strings", () => {
		const result = parseQueryParams("?enabled=true&visible=false&active=1");

		assert.deepStrictEqual(result, {
			enabled: "true",
			visible: "false",
			active: "1",
		});

		assert.strictEqual(typeof result.enabled, "string");
		assert.strictEqual(typeof result.visible, "string");
	});

	it("should handle malformed query strings gracefully", () => {
		const result = parseQueryParams("?&&&name=John&&age=30&");

		assert.deepStrictEqual(result, {
			name: "John",
			age: "30",
		});
	});

	it("should handle query strings with just question mark", () => {
		const result = parseQueryParams("?");

		assert.deepStrictEqual(result, {});
	});

	it("should handle international characters", () => {
		const result = parseQueryParams("?name=José&city=São%20Paulo&país=Brasil");

		assert.deepStrictEqual(result, {
			name: "José",
			city: "São Paulo",
			país: "Brasil",
		});
	});

	// Cleanup after each test
	beforeEach(() => {
		global.window = originalWindow;
	});
});
