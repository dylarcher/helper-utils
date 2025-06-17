/**
 * Asynchronously copies the provided text to the user's clipboard using the modern Clipboard API.
 * This function is designed for web browser environments.
 *
 * The Clipboard API (`navigator.clipboard`) is generally available in secure contexts (HTTPS)
 * and when the page (document) has focus. User permission may also be required by the browser,
 * though `writeText` often benefits from a more lenient permission model than `readText`
 * if initiated from a user gesture.
 *
 * @async
 * @param {string} text - The text string to be copied to the clipboard. Can be an empty string.
 *                        If not a string, `navigator.clipboard.writeText` might coerce it or throw an error;
 *                        it's best to ensure `text` is a string.
 * @returns {Promise<void>} A Promise that resolves if the text is successfully written to the clipboard.
 *                          The Promise rejects with an Error if:
 *                          1. The Clipboard API (`navigator.clipboard`) is not available (e.g., older browser, insecure context, specific browser settings).
 *                          2. The attempt to write to the clipboard fails (e.g., document not focused, user denied permission,
 *                             or other browser/OS-level restrictions). The error object in this case is typically a `DOMException`.
 *
 * @example
 * // Example 1: Basic successful copy
 * async function copyMyData() {
 *   try {
 *     await copyToClipboardAsync("This is important data!");
 *     alert("Data copied to clipboard!");
 *   } catch (error) {
 *     console.error("Copy failed:", error);
 *     alert("Could not copy data. See console for details.");
 *   }
 * }
 * // Call from a user-initiated event, like a button click:
 * // myButton.addEventListener('click', copyMyData);
 *
 * @example
 * // Example 2: Handling potential errors, like API unavailability or permission issues
 * const shareButton = document.getElementById('share');
 * shareButton.addEventListener('click', async () => {
 *   const shareText = "Check out this page: " + window.location.href;
 *   try {
 *     await copyToClipboardAsync(shareText);
 *     // Provide user feedback for success
 *     shareButton.textContent = 'Copied!';
 *     setTimeout(() => { shareButton.textContent = 'Share'; }, 2000);
 *   } catch (err) {
 *     // Provide user feedback for failure
 *     console.error('Clipboard write failed: ', err.name, err.message);
 *     if (err.message.includes('Clipboard API not available')) {
 *       alert('Clipboard API is not supported in your browser or context.');
 *     } else if (err.name === 'NotAllowedError') {
 *       alert('Permission to access the clipboard was denied. Please allow access in your browser settings.');
 *     } else if (err.name === 'SecurityError') {
 *        alert('Clipboard access is restricted in this context (e.g. insecure HTTP or sandboxed iframe without allow-same-origin).');
 *     } else {
 *       alert('Failed to copy. Your browser might not have focus on the page or another issue occurred.');
 *     }
 *     // Optionally, implement a fallback method here (e.g., showing a text area for manual copy)
 *   }
 * });
 *
 * @example
 * // Example 3: Copying an empty string
 * async function copyEmpty() {
 *   try {
 *     await copyToClipboardAsync("");
 *     console.log("Empty string copied to clipboard.");
 *   } catch (error) {
 *     console.error("Failed to copy empty string:", error);
 *   }
 * }
 */
export function copyToClipboardAsync(text: string): Promise<void>;
