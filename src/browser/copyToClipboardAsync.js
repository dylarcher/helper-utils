/**
 * Asynchronously copy text to clipboard using the Clipboard API.
 * @param {string} text - The text to copy.
 * @returns {Promise<void>} A promise that resolves when copying is successful, or rejects if not.
 */
export async function copyToClipboardAsync(text) {
	if (!navigator.clipboard) {
		return Promise.reject(
			new Error(
				"Clipboard API not available. Use a fallback or ensure secure context (HTTPS).",
			),
		);
	}
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		return Promise.reject(err);
	}
}
