# Table: Browser Utility Function Candidates

The following table summarizes potential utility functions for a browser-centric JavaScript library, outlining their core purpose and the primary vanilla JavaScript APIs or concepts they would leverage.

> These helper utility methods, and possibly others yet to make it into this list, are listed in the [wip/](./wip/ "Work in progress directory") folder.

| **Utility Function Name (Conceptual)** | **Core Purpose**                                           | **Key Vanilla JS APIs/Concepts**                                                               | **Environment** |
| -------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------- |
| `querySelectorWrapper`                     | Wrapper for `querySelector`with optional parent context.       | `document.querySelector`,`Element.prototype.querySelector`                                       | Browser               |
| `querySelectorAllWrapper`                  | Wrapper for `querySelectorAll`, returns an Array.              | `document.querySelectorAll`,`Element.prototype.querySelectorAll`,`Array.from`                  | Browser               |
| `addClass`                                 | Adds a CSS class to an element.                                  | `Element.classList.add`                                                                            | Browser               |
| `removeClass`                              | Removes a CSS class from an element.                             | `Element.classList.remove`                                                                         | Browser               |
| `toggleClass`                              | Toggles a CSS class on an element.                               | `Element.classList.toggle`                                                                         | Browser               |
| `hasClass`                                 | Checks if an element has a specific CSS class.                   | `Element.classList.contains`                                                                       | Browser               |
| `setAttribute`                             | Sets an attribute on an element.                                 | `Element.setAttribute`                                                                             | Browser               |
| `createElement`                            | Creates a new DOM element with optional attributes and children. | `document.createElement`,`Element.setAttribute`,`Node.appendChild`,`document.createTextNode` | Browser               |
| `removeElement`                            | Removes an element from the DOM.                                 | `Node.parentNode`,`Node.removeChild`                                                             | Browser               |
| `setStyle`                                 | Sets CSS style(s) on an element.                                 | `HTMLElement.style`                                                                                | Browser               |
| `getStyle`                                 | Gets the computed style of an element.                           | `window.getComputedStyle`                                                                          | Browser               |
| `onDelegate`                               | Simplified event delegation.                                     | `Event.target`,`Element.matches`,`addEventListener`                                            | Browser               |
| `debounce`                                 | Limit function execution rate after inactivity.                  | `setTimeout`,`clearTimeout`                                                                      | Browser               |
| `throttle`                                 | Limit function execution rate to once per interval.              | `setTimeout`                                                                                       | Browser               |
| `once`                                     | Attach an event listener that fires only once.                   | `addEventListener`,`removeEventListener`                                                         | Browser               |
| `getLocalStorageJSON`                      | Get and parse JSON from localStorage.                            | `localStorage.getItem`,`JSON.parse`                                                              | Browser               |
| `setLocalStorageJSON`                      | Stringify and store JSON in localStorage.                        | `localStorage.setItem`,`JSON.stringify`                                                          | Browser               |
| `parseQueryParams`                         | Parse URL query string into an object.                           | `URLSearchParams`,`window.location.search`                                                       | Browser               |
| `copyToClipboardAsync`                     | Asynchronously copy text to clipboard.                           | `navigator.clipboard.writeText`                                                                    | Browser               |
| `fetchJSON`                                | Simplified `fetch`for JSON requests/responses.                 | `fetch`,`Response.json`,`JSON.stringify`,`Headers`                                           | Browser               |
| `getCookie`                                | Retrieves a browser cookie by name.                              | `document.cookie`                                                                                  | Browser               |

[Export to Sheets](https://docs.google.com/spreadsheets/d/15jJiZ477MR75dNBRkabxSnZC0T9ln8NISaVtXpdJtBU/edit?usp=sharing "Download a CSV format document.")
