import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as browser from "./browser.js";

describe("browser exports", () => {
  it("should export all browser modules correctly", () => {
    // Create array of expected exports
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
      "uuid"
    ];

    // Verify all expected exports exist
    expectedExports.forEach(name => {
      assert.strictEqual(typeof browser[name], "function", `${name} should be exported as a function`);
    });

    // Verify the total count of exports
    assert.strictEqual(
      Object.keys(browser).length, 
      expectedExports.length,
      "Browser exports count should match expected"
    );
    
    // Check that aliases work properly
    assert.strictEqual(
      browser.querySelectorWrapperAll,
      browser.querySelectorAllWrapper,
      "querySelectorWrapperAll should be an alias for querySelectorAllWrapper"
    );
  });
});
