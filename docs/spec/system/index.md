---
title: System Utilities
---

# System Utilities

This section covers utility functions for Node.js (system) environments.

{% partial file="partials/warning.md" %}
Ensure that these functions are used in a Node.js environment. Some functions interact with the file system and require appropriate permissions.
{% /partial %}

## createDirectory

Creates a directory if it doesn't already exist.

{% codeblock src="src/system/createDirectory.js" /%}

## fileExists

Checks if a file exists at the given path.

{% codeblock src="src/system/fileExists.js" /%}

## generateHash

Generates a hash (SHA-256 by default) for a given string.

{% codeblock src="src/system/generateHash.js" /%}

## getCPUInfo

Retrieves information about the system's CPUs.

{% codeblock src="src/system/getCPUInfo.js" /%}

## getMemoryInfo

Retrieves information about the system's memory usage.

{% codeblock src="src/system/getMemoryInfo.js" /%}
