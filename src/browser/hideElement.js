/**
 * @description Hides a DOM element by setting its display style to 'none'.
 * @param {HTMLElement} element - The DOM element to hide.
 * @returns {void}
 * @example
 * hideElement(document.getElementById('tooltip'));
 */
export function hideElement(element) {
	if (!element?.style) {
		return;
	}

	try {
		if (typeof element.style.setProperty === "function") {
			element.style.setProperty("display", "none");
		} else {
			// Fallback for elements without setProperty method
			element.style.display = "none";
		}
	} catch (error) {
		// Silently handle errors when setting style properties
	}
}
