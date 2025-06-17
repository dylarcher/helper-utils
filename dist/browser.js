/**
 * @file src/browser.js
 * @module browser
 *
 * @description
 * This module serves as a central aggregator and public interface for all browser-specific
 * utility functions developed within the `./browser/` directory.
 *
 * By re-exporting them from this single file, consumers of the library can conveniently
 * import any browser utility using a path like `import { utilityName } from 'library-name/browser';`
 * or directly if the library's main entry point further exports these.
 * This simplifies the import paths and organizes the browser-related functionalities.
 *
 * Each exported utility is sourced from its own dedicated file within the `./browser/` subdirectory,
 * promoting modularity and maintainability.
 */
// Re-exports DOM manipulation utilities
export { addClass } from './browser/addClass.js'; // Utility to add CSS classes to a DOM element.
export { createElement } from './browser/createElement.js'; // Utility to create new DOM elements.
export { findClosest } from './browser/findClosest.js'; // Utility to find the closest ancestor matching a selector.
export { hasClass } from './browser/hasClass.js'; // Utility to check if a DOM element has a specific CSS class.
export { hideElement } from './browser/hideElement.js'; // Utility to hide a DOM element using `style.display = 'none'`.
export { querySelectorAllWrapper } from './browser/querySelectorAllWrapper.js'; // Wrapper for `querySelectorAll` returning an array.
export { querySelectorWrapper } from './browser/querySelectorWrapper.js'; // Wrapper for `querySelector` returning a single element or null.
export { querySelectorAllWrapper as querySelectorWrapperAll } from './browser/querySelectorAllWrapper.js'; // Alias for querySelectorAllWrapper.
export { removeClass } from './browser/removeClass.js'; // Utility to remove CSS classes from a DOM element.
export { removeElement } from './browser/removeElement.js'; // Utility to remove a DOM element from its parent.
export { setAttribute } from './browser/setAttribute.js'; // Utility to set an attribute on a DOM element.
export { setStyle } from './browser/setStyle.js'; // Utility to set inline CSS styles on a DOM element.
export { toggleClass } from './browser/toggleClass.js'; // Utility to toggle a CSS class on a DOM element.
// Re-exports event handling utilities
export { debounce } from './browser/debounce.js'; // Utility to create a debounced version of a function.
export { once } from './browser/once.js'; // Utility to attach an event listener that fires only once.
export { onDelegate } from './browser/onDelegate.js'; // Utility for event delegation.
export { throttle } from './browser/throttle.js'; // Utility to create a throttled version of a function.
// Re-exports browser environment and feature utilities
export { copyToClipboardAsync } from './browser/copyToClipboardAsync.js'; // Utility to copy text to the clipboard asynchronously.
export { fetchJSON } from './browser/fetchJSON.js'; // Utility for simplified JSON fetching.
export { getCookie } from './browser/getCookie.js'; // Utility to retrieve a browser cookie by name.
export { getGlobal } from './browser/getGlobal.js'; // Utility to get the global object (window/self/globalThis).
export { getLocalStorageJSON } from './browser/getLocalStorageJSON.js'; // Utility to get and parse JSON from localStorage.
export { getOSInfo } from './browser/getOSInfo.js'; // Utility to retrieve basic OS and browser information.
export { getStyle } from './browser/getStyle.js'; // Utility to get the computed style of an element.
export { parseQueryParams } from './browser/parseQueryParams.js'; // Utility to parse URL query parameters.
export { setLocalStorageJSON } from './browser/setLocalStorageJSON.js'; // Utility to stringify and set JSON in localStorage.
export { uuid } from './browser/uuid.js'; // Utility to generate a v4 UUID using `crypto.randomUUID`.
// Re-exports array/collection utilities (if any are browser-specific, otherwise might be in a common utils file)
// Assuming getUniqueElements might be used in browser contexts for DOM element arrays, etc.
export { getUniqueElements } from './browser/getUniqueElements.js'; // Utility to get unique elements from an array.
//# sourceMappingURL=browser.js.map