/**
 * Asynchronously copy text to clipboard using the Clipboard API.
 * @param {string} text - The text to copy.
 * @returns {Promise<void>} A promise that resolves when copying is successful, or rejects if not.
 */
export function copyToClipboardAsync(text: string): Promise<void>;
