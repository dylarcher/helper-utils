---
title: Browser Utilities
---

# Browser Utilities

This section covers utility functions for browser environments.

{% partial file="partials/note.md" %}
These functions are intended for use in a browser environment and may rely on browser-specific APIs like the DOM.
{% /partial %}

## addClass

Adds a class to an HTML element.

{% codeblock src="src/browser/addClass.js" /%}

## getCookie

Retrieves a cookie by its name.

{% codeblock src="src/browser/getCookie.js" /%}

## createElement

Creates an HTML element with specified attributes and children.

{% codeblock src="src/browser/createElement.js" /%}

## fetchJSON

Fetches JSON data from a URL.

{% codeblock src="src/browser/fetchJSON.js" /%}

## getOSInfo

Retrieves operating system information from the user agent string.

{% codeblock src="src/browser/getOSInfo.js" /%}
