/**
 * Simplified event delegation. Attaches an event listener to a parent element
 * and only triggers the callback if the event target matches the selector.
 * @param {Element} parentElement - The parent element to attach the listener to.
 * @param {string} eventType - The type of event (e.g., 'click').
 * @param {string} selector - The CSS selector for the target elements.
 * @param {Function} callback - The function to call when the event occurs on a matching target.
 * @param {boolean|object} [options] - Optional event listener options.
 */
export function onDelegate(
	parentElement,
	eventType,
	selector,
	callback,
	options,
) {
	if (!parentElement) {
		return;
	}
	parentElement.addEventListener(
		eventType,
		(_event) => {
			const { target } = _event;
			if (
				target &&
				typeof target.matches === 'function'
			) {
				try {
					if (target.matches(selector)) {
						callback.call(target, _event);
					}
				} catch (_error) {
					// Silently handle errors in target.matches
					// This prevents breaking the event delegation chain
				}
			}
		},
		options,
	);
}
