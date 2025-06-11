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
declare function throttle(func: Function, limit: number): Function;
