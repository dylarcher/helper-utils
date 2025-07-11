# js-helpers

[![CodeQL](https://github.com/dylarcher/js.helper-utils/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/dylarcher/js.helper-utils/actions/workflows/github-code-scanning/codeql)
[![PR Build](https://github.com/dylarcher/helper-utils/actions/workflows/build.yml/badge.svg)](https://github.com/dylarcher/helper-utils/actions/workflows/build.yml)
[![PR Integrate](https://github.com/dylarcher/helper-utils/actions/workflows/merge.yml/badge.svg)](https://github.com/dylarcher/helper-utils/actions/workflows/merge.yml)
[![Downloads](https://img.shields.io/npm/dm/js-helpers.svg)](https://www.npmjs.com/package/js-helpers)
[![Latest](https://img.shields.io/github/last-commit/dylarcher/js.helper-utils.svg)](https://github.com/dylarcher/js.helper-utils/commits/main)
[![Size](https://img.shields.io/github/repo-size/dylarcher/js.helper-utils.svg)](https://github.com/dylarcher/js.helper-utils)

A collection of reusable JavaScript helper utility methods for browser and
Node.js environments. (public npmjs library: [@darcher/js-helpers](https://www.npmjs.com/package/@darcher/js-helpers "Go to npmjs library"))

---

## Table of Contents

- [js-helpers](#js-helpers)
  - [Table of Contents](#table-of-contents)
  - [About The Project](#about-the-project)
    - [Built With](#built-with)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
    - [Available Utility Methods](#available-utility-methods)
      - [Browser Utilities](#browser-utilities)
      - [System Utilities (Node.js)](#system-utilities-nodejs)
  - [API Documentation](#api-documentation)
  - [Development](#development)
    - [Project Structure](#project-structure)
    - [Available Scripts](#available-scripts)
    - [Running Tests](#running-tests)

---

## About The Project

`@dylarcher/js-helpers` is a lightweight, zero-dependency library offering a
collection of reusable JavaScript utility methods designed to streamline common
development tasks.

This project aims to provide well-tested, efficient, and easy-to-use functions
for your JavaScript projects.

### Built With

- Node.js
- TypeScript (for type definitions and compilation)

---

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Make sure you have the following installed:

- Node.js (version >=18.20.8 recommended)

  ```sh
  node -v
  ```

- npm (version >=10.8.2 recommended)

  ```sh
  npm -v
  ```

### Installation

1. Clone the repo:

   ```sh
   git clone https://github.com/dylarcher/js.helper-utils.git
   cd js.helper-utils
   ```

2. Install NPM packages:

   ```sh
   npm install
   ```

To use `js-helpers` in your own project:

```sh
npm install js-helpers
# or
yarn add js-helpers
```

---

## Usage

Once installed, you can import and use the utility methods in your project.

```javascript
// ESM
import { addClass, readFileAsync } from '@dylarcher/js-helpers';

// Example for a browser utility
const myElement = document.getElementById('my-element');
if (myElement) {
 addClass(myElement, 'new-class', 'another-class');
}

// Example for a system utility (if in a Node.js environment)
async function logFile() {
 try {
  const content = await readFileAsync('path/to/my-file.txt');
  console.info(content);
 } catch (err) {
  console.error('Error reading file:', err);
 }
}
logFile();
```

### Available Utility Methods

The library is organized into browser-specific and system-level (Node.js)
utilities.

#### Browser Utilities

These functions are intended for use in a browser environment.

- `addClass(element, ...classNames)`: Adds one or more CSS classes to an HTML
  element.
- `copyToClipboardAsync(text)`: Asynchronously copies the given text to the
  clipboard.
- `createElement(tagName, attributes, children)`: Creates an HTML element with
  specified tag, attributes, and children.
- `debounce(func, delay)`: Returns a debounced version of the function that
  delays invoking `func` until after `delay` milliseconds have elapsed since the
  last time the debounced function was invoked.
- `fetchJSON(url, options)`: Fetches JSON data from a URL.
- `findClosest(element, selector)`: Finds the closest ancestor of an element
  that matches a selector.
- `getCookie(name)`: Retrieves the value of a cookie by its name.
- `getGlobal()`: Returns the global object (e.g., `window` in browsers).
- `getLocalStorageJSON(key)`: Retrieves and parses a JSON value from
  `localStorage`.
- `getOSInfo()`: Returns information about the operating system (primarily from
  `navigator.userAgentData` or `navigator.platform`).
- `getStyle(element, pseudoElt)`: Gets the computed style of an element.
- `hasClass(element, className)`: Checks if an element has a specific CSS class.
- `hideElement(element)`: Hides an HTML element by setting its `display` style
  to `none`.
- `once(element, eventType, listener, options)`: Adds an event listener that is
  automatically removed after it executes once.
- `onDelegate(parentElement, eventType, selector, callback, options)`: Attaches
  an event listener to a parent element that only triggers for events on
  descendant elements matching a selector.
- `parseQueryParams(queryString)`: Parses a URL query string into an object of
  key-value pairs.
- `querySelectorAllWrapper(selector, container)`: A wrapper for
  `querySelectorAll` that returns an array.
- `querySelectorWrapper(selector, container)`: A wrapper for `querySelector`.
- `querySelectorWrapperAll(selector, container)`: Alias for
  `querySelectorAllWrapper`.
- `removeClass(element, ...classNames)`: Removes one or more CSS classes from an
  HTML element.
- `removeElement(element)`: Removes an HTML element from its parent node.
- `setAttribute(element, attributeName, value)`: Sets an attribute on an HTML
  element.
- `setLocalStorageJSON(key, value)`: Stringifies and stores a JSON value in
  `localStorage`.
- `setStyle(element, property, value)`: Sets a style property on an HTML
  element. Can also take an object of styles.
- `throttle(func, limit)`: Returns a throttled version of the function that only
  invokes `func` at most once per every `limit` milliseconds.
- `toggleClass(element, className, force)`: Toggles a CSS class on an HTML
  element.
- `uuid()`: Generates a v4 UUID (primarily using `crypto.randomUUID` if
  available in the browser).

**Example Usage (Browser):**

```javascript
import { createElement, addClass, setStyle } from '@dylarcher/js-helpers';

const newDiv = createElement(
 'div',
 { id: 'myDiv', 'data-custom': 'value' },
 'Hello World!',
);
addClass(newDiv, 'mt-2', 'p-4');
setStyle(newDiv, { backgroundColor: 'lightblue', borderRadius: '5px' });
document.body.appendChild(newDiv);
```

#### System Utilities (Node.js)

These functions are primarily designed for use in a Node.js environment. Some
might work in modern browsers if the underlying Node.js modules they depend on
(like `crypto`, `fs`, `path`, `os`) have browser-compatible counterparts or
polyfills.

- `createDirectory(dirPath, options)`: Creates a directory, including parent
  directories if needed.
- `decrypt(encryptedTextWithIv, key)`: Decrypts text that was encrypted using
  AES-256-CBC (expects format 'iv:encryptedText').
- `encrypt(text, key, iv)`: Encrypts text using AES-256-CBC.
- `env(key, defaultValue)`: Gets an environment variable's value, with an
  optional default.
- `execAsync(command, options)`: Asynchronously executes a shell command.
- `fileExists(filePath)`: Checks if a file or directory exists.
- `generateHash(data, algorithm, encoding)`: Generates a hash (e.g., SHA256,
  MD5) of the given data.
- `getBasename(p, ext)`: Gets the basename of a path (filename with optional
  extension removal).
- `getCPUInfo()`: Returns information about the system's CPUs.
- `getDirname(p)`: Gets the directory name of a path.
- `getExtension(p)`: Gets the extension of a path.
- `getHostname()`: Returns the system's hostname.
- `getMemoryInfo()`: Returns information about system memory (total and free).
- `getNetworkInterfaces()`: Returns network interface information.
- `isDirectory(dirPath)`: Checks if a path is a directory.
- `joinPaths(...paths)`: Joins path segments into a single path.
- `listDirectoryContents(dirPath)`: Lists the contents of a directory.
- `readFileAsync(filePath, encoding)`: Asynchronously reads the content of a
  file.
- `removeDirectory(dirPath, options)`: Removes a directory, recursively if
  specified.
- `resolvePath(...paths)`: Resolves a sequence of paths or path segments into an
  absolute path.
- `uuid()`: Generates a v4 UUID (primarily using `crypto.randomUUID` from
  Node.js).
- `writeFileAsync(filePath, data, encoding)`: Asynchronously writes data to a
  file.

**Example Usage (Node.js):**

```javascript
import {
 writeFileAsync,
 readFileAsync,
 joinPaths,
 createDirectory,
} from '@dylarcher/js-helpers';
import { homedir } from 'os'; // Node.js core module

async function manageFiles() {
 const userHome = homedir();
 const myAppDir = joinPaths(userHome, '.myApp');
 const myFile = joinPaths(myAppDir, 'example.txt');

 try {
  await createDirectory(myAppDir);
  console.info('Directory created:', myAppDir);

  await writeFileAsync(myFile, 'Hello from js-helpers!\nThis is a new line.');
  console.info('File written:', myFile);

  const content = await readFileAsync(myFile, 'utf8');
  console.info('File content:', content);
 } catch (error) {
  console.error('An error occurred:', error);
 }
}

manageFiles();
```

---

## API Documentation

Detailed API documentation for this library is automatically generated using Google's Gemini AI.
It includes descriptions, code signatures, and examples for all available utility methods.

You can find the generated documentation in the [docs/gemini](./docs/gemini/) directory.
The documentation is updated automatically whenever changes are pushed to the `main` branch.

---

## Development

### Project Structure

```bash
.
├── .github/              # GitHub specific files (workflows, linters configs)
│   └── linters/
├── dist/                 # Compiled JavaScript output and type definitions
├── src/                  # TypeScript/JavaScript source files
│   └── index.ts          # Main entry point for the library
├── test/                 # Test files (e.g., *.test.js)
├── .gitignore
├── package.json          # Project metadata and dependencies
├── README.md             # This file
└── tsconfig.json         # TypeScript compiler configuration
```

### Available Scripts

The `package.json` includes several scripts to help with development:

### Running Tests

To execute the test suite:

```sh
npm test
```

This command will:

1. (Via `pretest`) Build the project (`npm run build`).
2. Run test files (e.g., `**/*.test.js`) using the Node.js runtime with specific
   flags (`--no-warnings`, `--experimental-specifier-resolution=node`,
   `--inspect-brk`). The `--inspect-brk` flag enables the debugger and pauses
   execution at the start of the script.

To run tests and generate a coverage report (currently 0%):

```sh
npm run test:coverage
```

<table><tr><td>
<details>
 <summary>Test coverage results report</summary>
