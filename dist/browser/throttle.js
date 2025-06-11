"use strict";
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
function throttle(func, limit) {
	let inThrottle = false;
	return function (...args) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}
