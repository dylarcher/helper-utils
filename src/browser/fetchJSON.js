/**
 * @typedef {function(): any} PromiseTryCallback
 */

/**
 * @typedef {Object} PromiseWithTryMethod
 * @property {function(function(): any): Promise<any>} try - Executes a function and returns a Promise
 */

/**
 * Polyfill for Promise.try - executes a callback and returns a Promise
 * @template T
 * @param {() => T | Promise<T>} callback - Function to execute
 * @returns {Promise<T>} Promise that resolves with callback result or rejects with callback error
 */
if (!(/** @type {PromiseConstructor & PromiseWithTryMethod} */ (Promise).try)) {
	/**
	 * @template T
	 * @param {() => T | Promise<T>} callback
	 * @returns {Promise<T>}
	 */
	/** @type {PromiseConstructor & PromiseWithTryMethod} */ (Promise).try =
		function (/** @type {Function} */ callback) {
			return new Promise(function (resolve, reject) {
				try {
					// Ensure the callback result is resolved if it's a promise,
					// or wrapped in a promise if it's a synchronous value/error.
					resolve(callback());
				} catch (e) {
					reject(e);
				}
			});
		};
}

/**
 * Simplified fetch for JSON requests/responses using Promise.try pattern.
 * @param {string} url - The URL to fetch.
 * @param {{
 *  method?: string,
 *  headers?: Record<string, string>,
 *  body?: any,
 *  [key: string]: any
 * }} [options={}] - Fetch options.
 * @returns {Promise<any>} A promise that resolves with the parsed JSON response.
 */
export function fetchJSON(url, options = {}) {
	return /** @type {PromiseConstructor & PromiseWithTryMethod} */ (Promise).try(
		async () => {
			/** @type {Record<string, string>} */
			const defaultHeaders = {
				Accept: 'application/json',
			};

			// Create a mutable copy of options to avoid modifying the original object directly.
			const processedOptions = { ...options };

			if (
				processedOptions.body &&
				typeof processedOptions.body === 'object' &&
				!(processedOptions.body instanceof FormData)
			) {
				processedOptions.body = JSON.stringify(processedOptions.body);
				// Ensure defaultHeaders isn't mutated if fetchJSON is called multiple times.
				processedOptions.headers = {
					'Content-Type': 'application/json',
					...defaultHeaders,
					...(processedOptions.headers || {}),
				};
			} else {
				processedOptions.headers = {
					...defaultHeaders,
					...(processedOptions.headers || {}),
				};
			}

			const response = await fetch(url, processedOptions);

			if (!response.ok) {
				const errorData = await response.text(); // Try to get error text
				throw new Error(
					`HTTP error ${response.status}: ${response.statusText}. Body: ${errorData}`,
				);
			}

			// Handle cases where response might be empty but still OK (e.g., 204 No Content)
			const contentType = response.headers.get('content-type');
			if (
				response.status === 204 ||
				!contentType ||
				!contentType.includes('application/json')
			) {
				return null; // Or response.text() if plain text is expected for some OK statuses
			}
			return response.json();
		},
	);
}
