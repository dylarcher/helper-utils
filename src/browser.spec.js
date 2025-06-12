import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Import functions directly and verify they work
import * as allExports from "./browser.js";
import {
	addClass,
	copyToClipboardAsync,
	createElement,
	debounce,
	fetchJSON,
	findClosest,
	getCookie,
	getGlobal,
	getLocalStorageJSON,
	getOSInfo,
	getStyle,
	hasClass,
	hideElement,
	once,
	onDelegate,
	parseQueryParams,
	querySelectorAllWrapper,
	querySelectorWrapper,
	querySelectorWrapperAll,
	removeClass,
	removeElement,
	setAttribute,
	setLocalStorageJSON,
	setStyle,
	throttle,
	toggleClass,
	uuid,
} from "./browser.js";

describe("browser", () => {
	it("should export all expected functions correctly", () => {
		// Test that all exports are functions
		const expectedExports = [
			"addClass",
			"copyToClipboardAsync",
			"createElement",
			"debounce",
			"fetchJSON",
			"findClosest",
			"getCookie",
			"getGlobal",
			"getLocalStorageJSON",
			"getOSInfo",
			"getStyle",
			"hasClass",
			"hideElement",
			"once",
			"onDelegate",
			"parseQueryParams",
			"querySelectorAllWrapper",
			"querySelectorWrapper",
			"querySelectorWrapperAll",
			"removeClass",
			"removeElement",
			"setAttribute",
			"setLocalStorageJSON",
			"setStyle",
			"throttle",
			"toggleClass",
			"uuid",
		];

		expectedExports.forEach((exportName) => {
			assert.strictEqual(typeof allExports[exportName], "function");
		});

		// Verify that querySelectorWrapperAll is an alias for querySelectorAllWrapper
		assert.strictEqual(allExports.querySelectorWrapperAll, allExports.querySelectorAllWrapper);

		// Check total number of exports matches expected
		assert.strictEqual(Object.keys(allExports).length, expectedExports.length);
	});

	// Test each exported function exists and is a function
	it("should export addClass function", () => {
		assert.strictEqual(typeof addClass, "function");
	});

	it("should export copyToClipboardAsync function", () => {
		assert.strictEqual(typeof copyToClipboardAsync, "function");
	});

	it("should export createElement function", () => {
		assert.strictEqual(typeof createElement, "function");
	});

	it("should export debounce function", () => {
		assert.strictEqual(typeof debounce, "function");
	});

	it("should export fetchJSON function", () => {
		assert.strictEqual(typeof fetchJSON, "function");
	});

	it("should export findClosest function", () => {
		assert.strictEqual(typeof findClosest, "function");
	});

	it("should export getCookie function", () => {
		assert.strictEqual(typeof getCookie, "function");
	});

	it("should export getGlobal function", () => {
		assert.strictEqual(typeof getGlobal, "function");
	});

	it("should export getLocalStorageJSON function", () => {
		assert.strictEqual(typeof getLocalStorageJSON, "function");
	});

	it("should export getOSInfo function", () => {
		assert.strictEqual(typeof getOSInfo, "function");
	});

	it("should export getStyle function", () => {
		assert.strictEqual(typeof getStyle, "function");
	});

	it("should export hasClass function", () => {
		assert.strictEqual(typeof hasClass, "function");
	});

	it("should export hideElement function", () => {
		assert.strictEqual(typeof hideElement, "function");
	});

	it("should export once function", () => {
		assert.strictEqual(typeof once, "function");
	});

	it("should export onDelegate function", () => {
		assert.strictEqual(typeof onDelegate, "function");
	});

	it("should export parseQueryParams function", () => {
		assert.strictEqual(typeof parseQueryParams, "function");
	});

	it("should export querySelectorAllWrapper function", () => {
		assert.strictEqual(typeof querySelectorAllWrapper, "function");
	});

	it("should export querySelectorWrapper function", () => {
		assert.strictEqual(typeof querySelectorWrapper, "function");
	});

	it("should export querySelectorWrapperAll function", () => {
		assert.strictEqual(typeof querySelectorWrapperAll, "function");
	});

	it("should export removeClass function", () => {
		assert.strictEqual(typeof removeClass, "function");
	});

	it("should export removeElement function", () => {
		assert.strictEqual(typeof removeElement, "function");
	});

	it("should export setAttribute function", () => {
		assert.strictEqual(typeof setAttribute, "function");
	});

	it("should export setLocalStorageJSON function", () => {
		assert.strictEqual(typeof setLocalStorageJSON, "function");
	});

	it("should export setStyle function", () => {
		assert.strictEqual(typeof setStyle, "function");
	});

	it("should export throttle function", () => {
		assert.strictEqual(typeof throttle, "function");
	});

	it("should export toggleClass function", () => {
		assert.strictEqual(typeof toggleClass, "function");
	});

	it("should export uuid function", () => {
		assert.strictEqual(typeof uuid, "function");
	});
});
