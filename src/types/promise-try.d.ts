declare global {
	interface PromiseConstructor {
		/**
		 * Creates a promise that resolves with the result of calling the provided callback function.
		 * If the callback throws an error synchronously, the promise will be rejected with that error.
		 * If the callback returns a promise, the returned promise will be resolved/rejected based on that promise.
		 * @param callback - The function to execute
		 * @returns A promise that resolves with the callback result or rejects with any thrown error
		 */
		try<T>(callback: () => T | Promise<T>): Promise<T>;
	}
}

export {};
