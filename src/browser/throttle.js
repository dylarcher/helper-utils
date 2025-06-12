/**
 * @description Creates a throttled version of a function that, when invoked repeatedly,
 *              will only call the original function at most once per every 'limit' milliseconds.
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The throttle limit in milliseconds.
 * @returns {Function} The throttled function.
 * @example
 * document.addEventListener('scroll', throttle(() => {
 *   console.log('Scrolled (throttled)');
 * }, 100));
 */
export function throttle(func, limit) {
	let lastCall = 0;
	/**
	 * @description Executes the provided function if not currently throttled, then prevents further execution until the limit has passed.
	 * @this {any} - The context with which the throttled function is called.
	 * @param {any[]} args - Arguments to pass to the throttled function.
	 * @returns {any} The result of the original function call.
	 */
	return function (...args) {
		const now = Date.now();
		// With zero limit, execute immediately without throttling
		if (limit === 0 || now - lastCall >= limit) {
			lastCall = now;
			return func.apply(this, args);
		}
		return undefined;
	};
}
