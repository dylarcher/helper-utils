/**
 * Creates a throttled version of a function that, when invoked repeatedly,
 * will only call the original function at most once per every 'limit' milliseconds.
 * This implementation calls the function on the leading edge of the timeout.
 *
 * - The `this` context and arguments of the original function are preserved.
 * - If `limit` is `0`, the function will be executed immediately without throttling.
 * - If an invocation is throttled (i.e., occurs within the 'limit' period since the
 *   last execution), the throttled function will return `undefined`.
 * - If the original function (`func`) throws an error, the error will propagate as usual.
 *   This throttled wrapper does not handle errors from `func`.
 *
 * @param {(...args: any[]) => any} func - The function to throttle.
 * @param {number} limit - The minimum time interval (in milliseconds) between invocations of `func`.
 *   If `0`, `func` is called immediately. Must be a non-negative number.
 * @returns {(...args: any[]) => any | undefined} A new function that, when invoked,
 *   conditionally executes `func` based on the throttle limit. Returns the result of
 *   `func` if it's called, or `undefined` if the call is throttled.
 *
 * @example
 * // Example 1: Throttling a scroll handler
 * const throttledScrollHandler = throttle(() => {
 *   console.info('Scroll event processed by throttled handler.');
 * }, 200);
 * window.addEventListener('scroll', throttledScrollHandler);
 * // The console message will appear at most every 200ms during scrolling.
 *
 * // Example 2: Throttling a button click
 * const myButton = document.getElementById('myButton');
 * let clickCount = 0;
 * const throttledClickHandler = throttle(function(event) {
 *   clickCount++;
 *   // 'this' refers to myButton
 *   console.info(`Button clicked ${clickCount} times. Event type: ${event.type}. Element ID: ${this.id}`);
 *   return clickCount; // Return value example
 * }, 1000);
 *
 * if (myButton) {
 *   myButton.addEventListener('click', (event) => {
 *     const result = throttledClickHandler.call(myButton, event); // Explicitly set 'this'
 *     if (result !== undefined) {
 *       console.info('Original function was called, result:', result);
 *     } else {
 *       console.info('Call was throttled.');
 *     }
 *   });
 * }
 *
 * // Example 3: limit = 0 (no throttling)
 * const immediateFunc = throttle(() => console.info('Called immediately!'), 0);
 * // immediateFunc(); // "Called immediately!"
 * // immediateFunc(); // "Called immediately!" (again, as limit is 0)
 */
export function throttle(func: (...args: any[]) => any, limit: number): (...args: any[]) => any | undefined;
