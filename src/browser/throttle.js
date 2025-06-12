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
	let inThrottle = false;
	/**
	 * @description Executes the provided function if not currently throttled, then prevents further execution until the limit has passed.
	 * @this {Function}
	 * @param {any[]} args - Arguments to pass to the throttled function.
	 * @returns {void}
	 */
	return function (...args) {
		if (!inThrottle) {
			try {
				func.apply(this, args);
			} catch (error) {
				// Let the error bubble up on first call
				inThrottle = true;
				setTimeout(() => {
					inThrottle = false;
				}, limit);
				throw error;
			}
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}
