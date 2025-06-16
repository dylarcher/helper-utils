/**
 * Creates a debounced version of a function that delays its execution until after
 * a specified 'delay' in milliseconds has passed since the last time it was invoked.
 *
 * The debounced function will be called with the `this` context and arguments of the last call.
 * Any errors thrown by the original function during its debounced execution are caught
 * and logged to `console.error`; they are not re-thrown.
 * The debounced function itself does not return any value from the original function's execution
 * due to the asynchronous nature of `setTimeout`.
 *
 * @param {(...args: any[]) => any} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds. Must be a non-negative number.
 * @returns {(...args: any[]) => void} A new function that, when invoked, delays the execution of `func`.
 *
 * @example
 * // Example 1: Debouncing a window resize handler
 * const debouncedResizeHandler = debounce(() => {
 *   console.info(`Window resized. Width: ${window.innerWidth}, Height: ${window.innerHeight}`);
 * }, 250);
 * window.addEventListener('resize', debouncedResizeHandler);
 *
 * // Example 2: Debouncing an input handler that uses 'this' and arguments
 * const myInput = document.getElementById('myInput');
 * if (myInput) {
 *   const debouncedInputHandler = debounce(function(event) {
 *     // 'this' refers to myInput
 *     console.info(`Input value (debounced): ${this.value}, Event type: ${event.type}`);
 *   }, 500);
 *   myInput.addEventListener('input', debouncedInputHandler);
 * }
 *
 * // Example 3: Debouncing a function that might throw an error
 * const riskyFunction = (value) => {
 *   if (value < 0) throw new Error("Value cannot be negative.");
 *   console.info("Value is fine:", value);
 * };
 * const debouncedRiskyFunction = debounce(riskyFunction, 300);
 * // debouncedRiskyFunction(10); // Logs "Value is fine: 10" after 300ms
 * // debouncedRiskyFunction(-5); // Logs "Error in debounced function: Error: Value cannot be negative." to console after 300ms
 */
export function debounce(func, delay) {
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let timeoutId;
    // The returned function is what gets called directly.
    // It manages the setTimeout behavior.
    return /** @this {any} */ function (...args) {
        // `this` context of this returned function is preserved for `func.apply`
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            try {
                // Execute the original function with the preserved context and arguments.
                func.apply(context, args);
            }
            catch (error) {
                // Log errors from the original function.
                // Avoid re-throwing as this would be an uncaught exception in setTimeout.
                console.error('Error in debounced function:', error);
            }
        }, delay);
    };
}
