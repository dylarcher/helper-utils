"use strict";
/**
 * @description Hides a DOM element by setting its display style to 'none'.
 * @param {HTMLElement} element - The DOM element to hide.
 * @returns {void}
 * @example
 * hideElement(document.getElementById('tooltip'));
 */
function hideElement(element) {
	if (element === null || element === void 0 ? void 0 : element.style) {
		element.style.setProperty("display", "none");
	}
}
// Similar for getStyle, showElement
