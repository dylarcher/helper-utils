/**
 * Attaches an event listener to an element that fires only once.
 * @param {EventTarget} element - The DOM element or event target.
 * @param {string} eventType - The type of event (e.g., 'click').
 * @param {Function} listener - The event listener function.
 * @param {boolean|object} [options] - Optional event listener options.
 */
export function once(
	element: EventTarget,
	eventType: string,
	listener: Function,
	options?: boolean | object,
): void;
