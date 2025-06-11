/**
 * @description Creates a debounced version of a function that delays invoking the function
 *              until after 'delay' milliseconds have elapsed since the last time it was invoked.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} The debounced function.
 * @example
 * window.addEventListener('resize', debounce(() => {
 *   console.log('Window resized (debounced)');
 * }, 250));
 */
export function debounce(func, delay) {
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timeoutId;

	/**
	 * @description The debounced function that will be returned.
	 * @this {Function}
	 * @param {any[]} args - Arguments to pass to the debounced function.
	 * @returns {void}
	 */
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}
