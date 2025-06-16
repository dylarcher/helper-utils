/**
 * Asynchronously copies the provided text to the user's clipboard using the modern Clipboard API.
 * This API is generally available in secure contexts (HTTPS) and when the page is active.
 *
 * The returned Promise will:
 * - Resolve when the text has been successfully written to the clipboard.
 * - Reject if:
 *   - The Clipboard API (`navigator.clipboard`) is not available in the current browser or context.
 *   - The attempt to write to the clipboard fails (e.g., due to denied permissions,
 *     document not focused, or other browser/OS-level restrictions).
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @returns {Promise<void>} A promise that resolves when copying is successful, or rejects with an error if it fails.
 *
 * @example
 * async function handleCopyText(textToCopy) {
 *   try {
 *     await copyToClipboardAsync(textToCopy);
 *     console.info('Text copied to clipboard successfully!');
 *     // You could show a success message to the user here.
 *   } catch (error) {
 *     console.error('Failed to copy text to clipboard:', error);
 *     // You could show an error message or provide a fallback mechanism here.
 *     // Common errors include:
 *     // - "Clipboard API not available..." (if navigator.clipboard is missing)
 *     // - DOMException if writeText fails (e.g. "Document is not focused", "User denied access to clipboard")
 *   }
 * }
 *
 * // Usage:
 * // handleCopyText('Hello, world!');
 * // handleCopyText(''); // Copies an empty string
 */
export async function copyToClipboardAsync(text) {
	if (typeof navigator === 'undefined' || !navigator.clipboard) {
		return Promise.reject(
			new Error(
				'Clipboard API not available. Use a fallback or ensure secure context (HTTPS).',
			),
		);
	}
	try {
		// The text parameter must be a string.
		// navigator.clipboard.writeText will handle empty strings correctly.
		await navigator.clipboard.writeText(text);
	} catch (err) {
		// The error (err) is often a DOMException.
		return Promise.reject(err);
	}
}
//# sourceMappingURL=copyToClipboardAsync.js.map
