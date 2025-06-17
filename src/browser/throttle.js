/**
 * Creates a throttled version of a function (`func`) that, when invoked repeatedly,
 * will only call `func` at most once per every `limit` milliseconds.
 *
 * This implementation triggers `func` on the "leading edge" of the timeout. This means:
 * - The first time the throttled function is called, `func` is executed immediately.
 * - Subsequent calls to the throttled function within the `limit` period are ignored (throttled).
 * - After `limit` milliseconds have passed since the last execution of `func`, the next call
 *   to the throttled function will execute `func` immediately again.
 *
 * The `this` context and arguments passed to the throttled function are applied to `func`
 * when it is executed.
 *
 * If `limit` is `0`, `func` will be executed immediately on every call without any throttling.
 *
 * If an invocation of the throttled function is actually executed (i.e., not throttled),
 * this throttled function returns the result of `func`. If an invocation is throttled,
 * it returns `undefined`.
 *
 * Any errors thrown by the original `func` during its execution will propagate as usual;
 * this throttle wrapper does not handle them.
 *
 * @template TArgs - An array of types for the arguments of the function `func`.
 * @template TReturn - The return type of the function `func`.
 * @param {(...args: TArgs) => TReturn} func - The function to throttle.
 * @param {number} limit - The minimum time interval (in milliseconds) that must pass between
 *                         invocations of `func`. If `0`, `func` is called immediately on every invocation.
 *                         Must be a non-negative number.
 * @returns {(...args: TArgs) => TReturn | undefined} A new throttled function.
 *   - When `func` is executed, its return value is returned.
 *   - When a call is throttled (ignored), `undefined` is returned.
 *
 * @example
 * // Example 1: Throttling a mousemove event handler
 * let moveCount = 0;
 * const throttledMoveHandler = throttle((event) => {
 *   moveCount++;
 *   console.log(`Mouse moved ${moveCount} times (throttled). X: ${event.clientX}, Y: ${event.clientY}`);
 * }, 500); // Execute at most once every 500ms
 * // document.addEventListener('mousemove', throttledMoveHandler);
 *
 * @example
 * // Example 2: Throttling button clicks
 * const myButton = document.getElementById('actionButton');
 * let processCount = 0;
 * const processClick = function(id) { // Using 'function' to bind 'this' if needed
 *   processCount++;
 *   console.log(`Processing action #${processCount} for button ID: ${id}, Element context: ${this.tagName}`);
 *   return processCount;
 * };
 * const throttledClickHandler = throttle(processClick, 1000); // At most once per second
 *
 * if (myButton) {
 *   myButton.addEventListener('click', function() { // Outer listener to capture all clicks
 *     const result = throttledClickHandler.call(this, this.id); // Explicitly set 'this' for processClick
 *     if (result !== undefined) {
 *       console.log(`Action processed, result: ${result}`);
 *     } else {
 *       console.log('Click was throttled.');
 *     }
 *   });
 * }
 *
 * @example
 * // Example 3: Using with limit = 0 (effectively no throttling)
 * let immediateCallCount = 0;
 * const immediateFunc = throttle(() => {
 *   immediateCallCount++;
 *   console.log(`Called immediately! Count: ${immediateCallCount}`);
 *   return immediateCallCount;
 * }, 0);
 * // immediateFunc(); // "Called immediately! Count: 1"
 * // immediateFunc(); // "Called immediately! Count: 2" (called again as limit is 0)
 *
 * @example
 * // Example 4: Understanding return values
 * const dataFetcher = (param) => `Data for ${param}`;
 * const throttledFetcher = throttle(dataFetcher, 100);
 * // console.log(throttledFetcher('A')); // "Data for A" (first call, executes)
 * // console.log(throttledFetcher('B')); // undefined (throttled, within 100ms)
 * // setTimeout(() => {
 * //   console.log(throttledFetcher('C')); // "Data for C" (after 100ms, executes)
 * // }, 150);
 */
export function throttle(func, limit) {
	// `lastCallTime`: Timestamp (milliseconds since epoch) of the last time `func` was actually executed.
	// Initialized to 0, allowing the first call to `func` to proceed immediately.
	let lastCallTime = 0;

	// `lastResult`: Stores the result of the last successful execution of `func`.
	// This is used if the throttle design were to return the last known result on throttled calls.
	// However, this specific implementation returns `undefined` for throttled calls.
	/** @type {any} */
	let lastResult; // The type 'any' is used here as TReturn isn't directly accessible in this scope for lastResult

	// This is the actual throttled function that gets returned.
	// It uses a closure to maintain access to `lastCallTime`, `lastResult`, `func`, and `limit`.
	return function (...args) {
		// Get the current timestamp.
		const now = Date.now();

		// Check if the call should proceed:
		// 1. If `limit` is 0, throttling is disabled, so always proceed.
		// 2. If `limit` > 0, check if enough time (`limit` milliseconds) has passed since `lastCallTime`.
		if (limit === 0 || now - lastCallTime >= limit) {
			// Update `lastCallTime` to the current timestamp, marking this execution.
			lastCallTime = now;

			// Execute the original function (`func`).
			// `func.apply(this, args)` calls `func` with:
			// - `this`: The `this` context from how the throttled function was called.
			// - `args`: The arguments passed to the throttled function.
			// @ts-ignore - Suppresses TypeScript error if `this` context is not strictly typed,
			// or if TArgs/TReturn are complex and apply isn't perfectly matched by TS inference here.
			lastResult = func.apply(this, args);

			// Return the result of the executed function.
			return lastResult;
		}
		// The call is throttled because not enough time has passed since the last execution.
		// As per the function's design, return `undefined` for throttled calls.
		// (An alternative design might return `lastResult` here, to provide the most recent successful value).
		return undefined;
	};
}
