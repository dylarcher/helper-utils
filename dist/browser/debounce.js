/**
 * Creates a debounced version of a function. The debounced function delays invoking the original
 * function (`func`) until after a specified number of milliseconds (`delay`) have elapsed since
 * the last time the debounced function was invoked.
 *
 * This is useful for limiting the rate at which a function is called, for example, in response to
 * rapid-firing events like window resizing, text input, or scroll events.
 *
 * The original function (`func`) is called with the `this` binding and arguments of the
 * **last** call to the debounced function.
 *
 * If the original function throws an error during its execution, this error is caught and
 * logged to `console.error`. The error is not re-thrown, preventing it from bubbling up
 * as an uncaught exception from the `setTimeout` context.
 *
 * Note: The debounced function itself does not return any value from the original function's
 * execution because `func` is called asynchronously via `setTimeout`. If you need the result
 * of `func`, consider using promises or callbacks within `func`.
 *
 * @param {(...args: any[]) => any} func - The function to be debounced.
 * @param {number} delay - The debounce delay in milliseconds. This should be a non-negative number.
 *                         If a negative number is provided, `setTimeout` might treat it as 0.
 * @returns {(...args: any[]) => void} A new function that, when invoked, will delay the
 *                                     execution of the original `func`. This new function does not
 *                                     return any value from `func`'s execution.
 *
 * @example
 * // Example 1: Debouncing a window resize event handler
 * function handleResize() {
 *   console.log(`Window resized to: ${window.innerWidth}x${window.innerHeight}`);
 * }
 * const debouncedResizeHandler = debounce(handleResize, 250); // Debounce by 250ms
 * window.addEventListener('resize', debouncedResizeHandler);
 * // handleResize will only be called 250ms after the user stops resizing the window.
 *
 * @example
 * // Example 2: Debouncing an input field handler, using 'this' and event arguments
 * const searchInput = document.getElementById('searchInput');
 * if (searchInput) {
 *   const debouncedInputHandler = debounce(function(event) {
 *     // 'this' refers to 'searchInput' (due to addEventListener and .apply)
 *     // 'event' is the input event object
 *     console.log(`Input value: ${this.value}, Event type: ${event.type}`);
 *     // fetchAutocompleteResults(this.value); // Example API call
 *   }, 500); // Debounce by 500ms
 *   searchInput.addEventListener('input', debouncedInputHandler);
 * }
 *
 * @example
 * // Example 3: Debouncing a function that might throw an error
 * function riskyOperation(value) {
 *   if (typeof value !== 'number') {
 *     throw new TypeError("Value must be a number.");
 *   }
 *   if (value < 0) {
 *     throw new RangeError("Value cannot be negative.");
 *   }
 *   console.log("Processing value:", value);
 * }
 * const debouncedRiskyOperation = debounce(riskyOperation, 300);
 * // Call it multiple times quickly
 * // debouncedRiskyOperation("abc"); // Will eventually log a TypeError to console.error
 * // debouncedRiskyOperation(-10);  // If this is the last call, will log RangeError
 * // debouncedRiskyOperation(100);  // If this is the last call, "Processing value: 100"
 *
 * @example
 * // Example 4: Using with a button to prevent rapid clicks
 * let clickCount = 0;
 * const myButton = document.getElementById('myButton');
 * if (myButton) {
 *   const debouncedClickHandler = debounce(() => {
 *     clickCount++;
 *     console.log(`Button clicked ${clickCount} times (debounced).`);
 *     // Perform action that should only happen once after rapid clicks
 *   }, 1000); // Wait 1 second after the last click
 *   myButton.addEventListener('click', debouncedClickHandler);
 * }
 */
export function debounce(func, delay) {
    // `timeoutId` stores the identifier for the timeout, returned by `setTimeout`.
    // This ID is used by `clearTimeout` to cancel the pending execution of `func`.
    // It's initialized as undefined.
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let timeoutId;
    // This is the actual debounced function that gets returned and subsequently called.
    // It uses a closure to maintain access to `timeoutId`, `func`, and `delay`.
    return /** @this {any} */ function (...args) {
        // `context` captures the `this` value from the time the debounced function is called.
        // This ensures that `func` is executed with the correct `this` context.
        // For example, if the debounced function is an event listener, `this` would be the element.
        const context = this;
        // Cancel any previously scheduled execution of `func`.
        // If `timeoutId` is undefined (e.g., on the very first call), `clearTimeout` does nothing.
        clearTimeout(timeoutId);
        // Schedule `func` to be executed after `delay` milliseconds.
        // `setTimeout` returns a new ID, which is stored in `timeoutId`.
        timeoutId = setTimeout(() => {
            try {
                // Execute the original function (`func`).
                // `func.apply(context, args)` calls `func` with:
                // - `context`: The `this` value captured when the debounced function was called.
                // - `args`: The arguments passed to the debounced function when it was last called.
                func.apply(context, args);
            }
            catch (error) {
                // If `func` throws an error, catch it here.
                // Log the error to the console. This is important because errors inside `setTimeout`
                // can be easily missed as they don't propagate like synchronous errors.
                // We avoid re-throwing the error, as it would become an uncaught exception
                // in the asynchronous context of `setTimeout`.
                console.error('Error in debounced function:', error);
            }
            // Once func has executed (or attempted to), the timeout is complete.
            // timeoutId remains the ID of this completed timeout but a new call to the
            // debounced function will clear it and set a new timeout.
        }, delay);
        // The debounced function itself does not return a value from `func` because `func`
        // is executed asynchronously.
    };
}
//# sourceMappingURL=debounce.js.map