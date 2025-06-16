# js-helpers

[![CodeQL](https://github.com/dylarcher/js.helper-utils/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/dylarcher/js.helper-utils/actions/workflows/github-code-scanning/codeql)
[![Lint](https://github.com/dylarcher/js.helper-utils/actions/workflows/lint.yml/badge.svg)](https://github.com/dylarcher/js.helper-utils/actions/workflows/lint.yml)
[![Format](https://github.com/dylarcher/js.helper-utils/actions/workflows/format.yml/badge.svg)](https://github.com/dylarcher/js.helper-utils/actions/workflows/format.yml)
[![Test](https://github.com/dylarcher/js.helper-utils/actions/workflows/test.yml/badge.svg)](https://github.com/dylarcher/js.helper-utils/actions/workflows/test.yml)
[![Downloads](https://img.shields.io/npm/dm/js-helpers.svg)](https://www.npmjs.com/package/js-helpers)
[![Latest](https://img.shields.io/github/last-commit/dylarcher/js.helper-utils.svg)](https://github.com/dylarcher/js.helper-utils/commits/main)
[![Size](https://img.shields.io/github/repo-size/dylarcher/js.helper-utils.svg)](https://github.com/dylarcher/js.helper-utils)

A collection of reusable JavaScript helper utility methods for browser and
Node.js environments.

---

## Table of Contents

- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Available Utility Methods](#available-utility-methods)
    - [Browser Utilities](#browser-utilities)
    - [System Utilities (Node.js)](#system-utilities-nodejs)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Available Scripts](#available-scripts)
  - [Running Tests](#running-tests)
  - [Linting and Formatting](#linting-and-formatting)
  - [Building the Project](#building-the-project)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

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

```sh
# running `npm run test:coverage`

 > js-helpers@0.1.0 test:coverage
 > c8 --config .github/presets/.c8rc.json -- npm test

 > js-helpers@0.1.0 test
 > node --no-warnings --test src/**/*.spec.js src/**/*.test.js

▶ browser
  ✔ should export all expected functions correctly (0.687792ms)
  ✔ should export addClass function (0.083542ms)
  ✔ should export copyToClipboardAsync function (0.058834ms)
  ✔ should export createElement function (0.054042ms)
  ✔ should export debounce function (0.048917ms)
  ✔ should export fetchJSON function (0.058542ms)
  ✔ should export findClosest function (0.052791ms)
  ✔ should export getCookie function (0.05225ms)
  ✔ should export getGlobal function (0.053292ms)
  ✔ should export getLocalStorageJSON function (0.049167ms)
  ✔ should export getOSInfo function (0.047708ms)
  ✔ should export getStyle function (0.059917ms)
  ✔ should export hasClass function (0.051667ms)
  ✔ should export hideElement function (0.059875ms)
  ✔ should export once function (0.044292ms)
  ✔ should export onDelegate function (0.041667ms)
  ✔ should export parseQueryParams function (0.042708ms)
  ✔ should export querySelectorAllWrapper function (0.040459ms)
  ✔ should export querySelectorWrapper function (0.043334ms)
  ✔ should export querySelectorWrapperAll function (0.047584ms)
  ✔ should export removeClass function (0.044667ms)
  ✔ should export removeElement function (0.042333ms)
  ✔ should export setAttribute function (0.040792ms)
  ✔ should export setLocalStorageJSON function (0.049833ms)
  ✔ should export setStyle function (0.04ms)
  ✔ should export throttle function (0.041334ms)
  ✔ should export toggleClass function (0.040792ms)
  ✔ should export uuid function (0.04075ms)
✔ browser (3.159375ms)
▶ addClass(element, ...classNames)
  ✔ should add a single class to an element (0.782583ms)
  ✔ should add multiple classes to an element (0.131333ms)
  ✔ should not add duplicate classes (0.117625ms)
  ✔ should filter out falsy class names like null, undefined, and empty strings (0.111833ms)
  ✔ should not throw an error if the element is null (0.156917ms)
  ✔ should not throw an error if the element is undefined (0.092709ms)
  ✔ should not throw an error or modify if element has no classList property (0.085ms)
  ✔ should handle adding a class that already exists with other classes (2.361375ms)
  ✔ should handle adding multiple new classes when some already exist (0.139625ms)
✔ addClass(element, ...classNames) (4.826833ms)
▶ copyToClipboardAsync(text)
  ✔ should copy text to clipboard successfully (2.171834ms)
  ✔ should reject if navigator.clipboard is not available (1.507542ms)
  ✔ should reject if clipboard.writeText fails (0.231667ms)
  ✔ should handle empty string (2.999833ms)
  ✔ should handle special characters (0.27225ms)
✔ copyToClipboardAsync(text) (7.977917ms)
▶ createElement(tagName, attributes, children)
  ✔ should create an element with specified tag name (5.550834ms)
  ✔ should create an element with attributes (0.3465ms)
  ✔ should create an element with string child (0.233458ms)
  ✔ should create an element with Node child (0.194083ms)
  ✔ should create an element with array of children (0.160583ms)
  ✔ should handle empty attributes object (0.694917ms)
  ✔ should handle undefined attributes (0.170792ms)
  ✔ should handle empty children array (0.114583ms)
  ✔ should handle mixed children types in array (0.125542ms)
  ✔ should only set own properties from attributes object (0.120792ms)
✔ createElement(tagName, attributes, children) (8.631625ms)
▶ debounce(func, delay)
  ✔ should delay function execution (62.8495ms)
  ✔ should cancel previous calls when called multiple times rapidly (61.479417ms)
  ✔ should preserve function context (this) (42.863958ms)
  ✔ should handle multiple arguments correctly (40.915125ms)
  ✔ should work with zero delay (0.825625ms)
  ✔ should reset timer on each call (80.906959ms)
  ✔ should have error handling in the debounced function (51.406625ms)
  ✔ should log errors to console.error (50.781292ms)
✔ debounce(func, delay) (393.173542ms)
▶ fetchJSON(url, options)
  ✔ should fetch and parse JSON successfully (2.265625ms)
  ✔ should set default headers correctly (0.254667ms)
  ✔ should stringify object body and set content-type (18.2765ms)
  ✔ should handle non-ok response (1.054291ms)
  ✔ should handle 204 No Content response (0.360416ms)
✔ fetchJSON(url, options) (23.066125ms)
▶ findClosest(element, selector)
  ✔ should find closest element by tag name (0.614958ms)
  ✔ should find closest element by class name (0.090209ms)
  ✔ should find closest element by id (0.073417ms)
  ✔ should return the element itself if it matches (0.065041ms)
  ✔ should return null if no matching ancestor found (0.061125ms)
  ✔ should return null if element is null (0.058875ms)
  ✔ should return null if element is undefined (0.053083ms)
  ✔ should handle complex selectors (0.064958ms)
  ✔ should work with single element (no parents) (0.059209ms)
  ✔ should return null for empty selector (0.09275ms)
✔ findClosest(element, selector) (2.148167ms)
▶ getCookie(alias)
  ✔ should retrieve a simple cookie (0.877208ms)
  ✔ should retrieve a cookie with special characters (0.176458ms)
  ✔ should handle cookies with spaces around values (0.146625ms)
  ✔ should return null for non-existent cookie (0.122125ms)
  ✔ should handle empty cookie string (1.274916ms)
  ✔ should handle undefined document (0.213625ms)
  ✔ should handle document without cookie property (0.799292ms)
  ✔ should handle null document.cookie (0.150583ms)
  ✔ should retrieve first cookie when multiple cookies have similar names (0.127709ms)
  ✔ should handle cookie with equal signs in value (0.131208ms)
  ✔ should handle empty cookie value (0.109916ms)
  ✔ should be case sensitive (0.113959ms)
  ✔ should handle cookies with semicolons in values (0.098916ms)
✔ getCookie(alias) (5.2895ms)
▶ getGlobal()
  ✔ should return a global object (0.519209ms)
  ✔ should accept an options parameter (0.083791ms)
✔ getGlobal() (1.291417ms)
▶ getLocalStorageJSON(key)
  ✔ should parse and return valid JSON object (2.623167ms)
  ✔ should parse and return valid JSON array (0.247333ms)
  ✔ should parse and return valid JSON primitive (0.201833ms)
  ✔ should return null for non-existent key (0.15425ms)
  ✔ should return null for empty string value (0.12775ms)
  ✔ should return null and log error for invalid JSON (3.773417ms)
  ✔ should handle localStorage getItem throwing error (0.2565ms)
  ✔ should handle complex nested objects (0.200958ms)
  ✔ should handle special characters in values (0.133625ms)
  ✔ should handle JSON with escaped characters (0.129ms)
✔ getLocalStorageJSON(key) (9.425458ms)
▶ getOSInfo()
  ✔ should return an object with required properties (0.73575ms)
  ✔ should return strings for all properties (0.144375ms)
  ✔ should return non-empty strings (0.100333ms)
  ✔ should return consistent results on multiple calls (0.584041ms)
  ✔ should return valid platform values (0.115042ms)
  ✔ should return valid architecture values (0.928667ms)
  ✔ should have platform matching current environment (0.26325ms)
  ✔ should have type matching current environment (1.135125ms)
  ✔ should return release version in expected format (0.242083ms)
  ✔ should return immutable result (0.091208ms)
✔ getOSInfo() (5.528084ms)
▶ getStyle(element, pseudoElt)
  ✔ should return computed style for valid element (2.647292ms)
  ✔ should pass pseudoElement parameter to getComputedStyle (1.137875ms)
  ✔ should handle common pseudo-elements (0.199334ms)
  ✔ should return null for null element (0.155333ms)
  ✔ should return null for undefined element (0.131667ms)
  ✔ should return null when getComputedStyle is not available (0.208125ms)
  ✔ should return null when window is not defined (0.1305ms)
  ✔ should handle getComputedStyle returning null (0.165583ms)
  ✔ should work without pseudoElement parameter (0.173791ms)
  ✔ should handle elements with complex styles (0.17475ms)
  ✔ should handle empty style object (0.131291ms)
✔ getStyle(element, pseudoElt) (6.216791ms)
▶ hasClass(element, className)
  ✔ should return true when element has the specified class (0.790417ms)
  ✔ should return true for multiple existing classes (0.13825ms)
  ✔ should return false when element does not have the specified class (0.092291ms)
  ✔ should return false for null element (0.096708ms)
  ✔ should return false for undefined element (0.090625ms)
  ✔ should return false for element without classList (1.168541ms)
  ✔ should return false for empty className (0.150625ms)
  ✔ should return false for null className (0.159167ms)
  ✔ should return false for undefined className (0.099834ms)
  ✔ should be case sensitive (0.097459ms)
  ✔ should handle classes with special characters (0.115834ms)
  ✔ should handle element with no classes (0.079708ms)
  ✔ should not match partial class names (0.078917ms)
  ✔ should handle whitespace in className parameter (0.097542ms)
  ✔ should handle element with classList but no contains method (0.088208ms)
  ✔ should handle element where classList.contains throws (0.345667ms)
  ✔ should work with real DOM-like element structure (0.222625ms)
✔ hasClass(element, className) (4.981667ms)
▶ hideElement(element)
  ✔ should set display to none on valid element (0.696584ms)
  ✔ should not throw error for null element (0.169541ms)
  ✔ should not throw error for undefined element (0.100167ms)
  ✔ should not throw error for element without style property (0.108834ms)
  ✔ should not throw error for element with null style (0.099ms)
  ✔ should work with real DOM-like element (0.093083ms)
  ✔ should handle element with style but no setProperty method (0.085834ms)
  ✔ should override existing display property (0.914958ms)
  ✔ should work multiple times on same element (0.101458ms)
  ✔ should handle style.setProperty throwing an error (0.106917ms)
✔ hideElement(element) (3.360833ms)
▶ onDelegate(parentElement, eventType, selector, callback, options)
  ✔ should attach event listener to parent element (0.782375ms)
  ✔ should call callback when target matches selector (0.232584ms)
  ✔ should not call callback when target doesn't match selector (0.111375ms)
  ✔ should work with id selectors (0.110583ms)
  ✔ should work with tag selectors (0.109666ms)
  ✔ should handle multiple matching elements (4.30925ms)
  ✔ should pass options to addEventListener (0.371417ms)
  ✔ should handle boolean options parameter (0.141167ms)
  ✔ should not throw for null parent element (0.179209ms)
  ✔ should not throw for undefined parent element (0.091458ms)
  ✔ should handle target without matches method (0.115417ms)
  ✔ should handle null target (0.116375ms)
  ✔ should handle target.matches throwing error (0.136625ms)
  ✔ should work with complex selectors (0.11675ms)
  ✔ should preserve event object properties (0.126167ms)
  ✔ should handle multiple event types on same parent (0.0915ms)
✔ onDelegate(parentElement, eventType, selector, callback, options) (8.071458ms)
▶ once(element, eventType, listener, options)
  ✔ should add event listener with once option (0.778ms)
  ✔ should fire listener only once (0.236542ms)
  ✔ should preserve existing options and add once (0.142916ms)
  ✔ should handle boolean options parameter (0.108125ms)
  ✔ should handle undefined options (0.106042ms)
  ✔ should not throw for null element (0.160125ms)
  ✔ should not throw for undefined element (0.847666ms)
  ✔ should not throw for element without addEventListener (0.204375ms)
  ✔ should pass event object to listener (0.181084ms)
  ✔ should work with different event types (0.180667ms)
  ✔ should handle multiple listeners on same event (0.116833ms)
  ✔ should preserve listener context (0.108375ms)
✔ once(element, eventType, listener, options) (4.1165ms)
▶ parseQueryParams(queryString)
  ✔ should parse simple query parameters (3.569209ms)
  ✔ should use window.location.search by default (0.21075ms)
  ✔ should handle empty query string (0.16325ms)
  ✔ should handle query string without question mark (0.482333ms)
  ✔ should handle URL encoded values (0.811458ms)
  ✔ should handle parameters with no values (0.196792ms)
  ✔ should handle parameters with empty values (0.126ms)
  ✔ should handle duplicate parameter names (last one wins) (0.436375ms)
  ✔ should handle special characters in parameter names (0.142166ms)
  ✔ should handle plus signs as spaces (0.1225ms)
  ✔ should handle complex query strings (0.124334ms)
  ✔ should handle parameters with equals signs in values (0.114542ms)
  ✔ should handle array-like parameters (0.103833ms)
  ✔ should handle numeric-looking values as strings (0.1505ms)
  ✔ should handle boolean-looking values as strings (0.145916ms)
  ✔ should handle malformed query strings gracefully (0.10775ms)
  ✔ should handle query strings with just question mark (0.088083ms)
  ✔ should handle international characters (0.101792ms)
✔ parseQueryParams(queryString) (8.184916ms)
▶ querySelectorAllWrapper(selector, container)
  ✔ should return empty array for null container (0.999ms)
  ✔ should return empty array for undefined container (0.078833ms)
  ✔ should return empty array for container without querySelectorAll method (0.069167ms)
  ✔ should return empty array for container with null querySelectorAll method (0.073167ms)
  ✔ should convert NodeList to Array with custom container (0.15225ms)
  ✔ should handle empty NodeList (0.070375ms)
  ✔ should handle complex selectors (0.09ms)
  ✔ should handle querySelectorAll throwing error (0.100625ms)
  ✔ should work with various selector types (0.096167ms)
  ✔ should handle container with querySelectorAll as non-function (0.067584ms)
  ✔ should use document as default container (0.079833ms)
✔ querySelectorAllWrapper(selector, container) (3.523417ms)
▶ querySelectorWrapper(selector, container)
  ✔ should find element by id using document (3.724375ms)
  ✔ should find element by class using document (0.297292ms)
  ✔ should find element by tag using document (0.202625ms)
  ✔ should use custom container when provided (0.146584ms)
  ✔ should return null for non-existent selector (0.161833ms)
  ✔ should return null for null container (0.150666ms)
  ✔ should return null for undefined container (0.130875ms)
  ✔ should return null for container without querySelector method (0.164708ms)
  ✔ should handle container with null querySelector method (0.131834ms)
  ✔ should handle empty selector (0.14975ms)
  ✔ should handle complex selectors (0.166583ms)
  ✔ should handle querySelector throwing error (0.22475ms)
  ✔ should default to document when no container provided (0.167542ms)
  ✔ should work with various selector types (0.180708ms)
  ✔ should return null when document doesn't exist and only one argument is provided (0.16025ms)
✔ querySelectorWrapper(selector, container) (7.1365ms)
▶ removeClass(element, ...classNames)
  ✔ should remove a single class from element (0.795125ms)
  ✔ should remove multiple classes from element (0.136459ms)
  ✔ should not throw error when removing non-existent class (0.585042ms)
  ✔ should filter out falsy class names (0.168375ms)
  ✔ should handle empty class name gracefully (0.137875ms)
  ✔ should not throw error for null element (2.169792ms)
  ✔ should not throw error for undefined element (0.134583ms)
  ✔ should not throw error for element without classList (0.156958ms)
  ✔ should handle element with null classList (0.104125ms)
  ✔ should remove all specified classes even if some don't exist (0.083667ms)
  ✔ should handle duplicate class names in parameter list (0.082167ms)
  ✔ should work with classes containing special characters (0.076084ms)
  ✔ should preserve other classes when removing specific ones (0.077ms)
  ✔ should handle removing all classes (0.1275ms)
  ✔ should be case sensitive (0.071167ms)
  ✔ should work with classList.remove method variations (0.133375ms)
✔ removeClass(element, ...classNames) (6.0245ms)
▶ removeElement(element)
  ✔ should remove element from its parent (1.749833ms)
  ✔ should not throw for null element (0.211375ms)
  ✔ should not throw for undefined element (0.101417ms)
  ✔ should not throw for element without parentNode (0.101583ms)
  ✔ should not throw for element with null parentNode (0.1185ms)
  ✔ should handle element whose parent lacks removeChild method (3.132333ms)
  ✔ should handle nested element removal (0.139709ms)
  ✔ should handle multiple children removal (0.172542ms)
  ✔ should handle element already removed (0.104417ms)
  ✔ should work with different element types (0.120625ms)
  ✔ should handle parent with custom removeChild implementation (0.130167ms)
  ✔ should handle removeChild throwing error (0.093125ms)
  ✔ should preserve sibling relationships (0.075084ms)
  ✔ should handle element with complex parent structure (0.113708ms)
  ✔ should work in DOM-like environment (0.084708ms)
✔ removeElement(element) (7.454666ms)
▶ setAttribute(element, attributeName, value)
  ✔ should set attribute on valid element (0.762292ms)
  ✔ should set multiple different attributes (0.145ms)
  ✔ should overwrite existing attribute (0.098875ms)
  ✔ should convert non-string values to strings (0.115916ms)
  ✔ should handle empty string value (0.088041ms)
  ✔ should handle whitespace in attribute name (0.100292ms)
  ✔ should handle special characters in attribute name (0.120625ms)
  ✔ should not throw for null element (0.186083ms)
  ✔ should not throw for undefined element (0.088584ms)
  ✔ should not throw for element without setAttribute method (0.092834ms)
  ✔ should not throw for element with null setAttribute method (0.105417ms)
  ✔ should not set attribute for empty attribute name (0.584292ms)
  ✔ should not set attribute for null attribute name (0.099959ms)
  ✔ should not set attribute for undefined attribute name (0.085458ms)
  ✔ should handle common HTML attributes (0.141459ms)
  ✔ should handle setAttribute throwing error (0.110333ms)
  ✔ should work with DOM-like element (0.089917ms)
  ✔ should handle complex attribute values (0.094083ms)
  ✔ should handle repeated attribute setting (0.075708ms)
  ✔ should preserve attribute case sensitivity (0.139542ms)
✔ setAttribute(element, attributeName, value) (5.164291ms)
▶ setLocalStorageJSON(key, value)
  ✔ should stringify and store simple object (3.530458ms)
  ✔ should stringify and store array (0.233667ms)
  ✔ should stringify and store primitive values (0.1875ms)
  ✔ should handle complex nested objects (0.783333ms)
  ✔ should handle special characters in values (0.175125ms)
  ✔ should overwrite existing values (0.192625ms)
  ✔ should return false and log error when localStorage.setItem throws (0.206084ms)
  ✔ should return false and log error when JSON.stringify throws (0.132125ms)
  ✔ should handle undefined values (0.109167ms)
  ✔ should handle function values (0.101667ms)
  ✔ should handle objects with toJSON method (0.129958ms)
  ✔ should handle Date objects (2.280792ms)
  ✔ should handle empty objects and arrays (0.151958ms)
  ✔ should handle very large objects (1.237333ms)
  ✔ should handle objects with symbol properties (ignored) (0.163917ms)
✔ setLocalStorageJSON(key, value) (10.766125ms)
▶ setStyle(element, property, value)
  ✔ should set single CSS property (0.822542ms)
  ✔ should set multiple CSS properties from object (0.143208ms)
  ✔ should overwrite existing styles (0.114834ms)
  ✔ should handle camelCase property names (1.455042ms)
  ✔ should handle kebab-case property names converted to camelCase (0.202042ms)
  ✔ should handle empty object (0.626875ms)
  ✔ should handle empty string value (0.113ms)
  ✔ should handle zero values (0.097458ms)
  ✔ should not throw for null element (0.146125ms)
  ✔ should not throw for undefined element (0.072666ms)
  ✔ should not throw for element without style property (0.100625ms)
  ✔ should not throw for element with null style (0.079375ms)
  ✔ should handle undefined value parameter (0.074458ms)
  ✔ should handle null value parameter (0.074583ms)
  ✔ should not set property when property is object but value is provided (0.062ms)
  ✔ should handle complex CSS values (0.123333ms)
  ✔ should handle CSS custom properties (CSS variables) (0.071916ms)
  ✔ should handle numeric values (0.067833ms)
  ✔ should handle mixed property types in object (0.085375ms)
  ✔ should preserve existing styles when setting new ones (0.067084ms)
  ✔ should handle object with inherited properties (0.108333ms)
  ✔ should handle falsy property names (0.075833ms)
  ✔ should work with DOM-like element (0.109083ms)
✔ setStyle(element, property, value) (5.917291ms)
▶ throttle(func, limit)
  ✔ should call function immediately on first invocation (1.249083ms)
  ✔ should throttle subsequent calls within limit period (60.812709ms)
  ✔ should preserve function context (this) (41.295083ms)
  ✔ should handle multiple arguments correctly (0.282125ms)
  ✔ should work with zero limit (11.963167ms)
  ✔ should reset throttle after limit period (34.800083ms)
  ✔ should handle rapid successive calls correctly (60.8055ms)
  ✔ should handle function that throws error (0.518958ms)
  ✔ should handle different instances independently (62.157208ms)
  ✔ should work with async functions (41.834291ms)
✔ throttle(func, limit) (316.909042ms)
▶ toggleClass(element, className, force)
  ✔ should toggle class on when not present (0.824792ms)
  ✔ should toggle class off when present (0.139583ms)
  ✔ should force add class when force is true (0.152667ms)
  ✔ should force remove class when force is false (0.108ms)
  ✔ should not throw error for null element (0.167834ms)
  ✔ should not throw error for undefined element (0.17625ms)
  ✔ should not throw error for element without classList (0.128459ms)
  ✔ should not throw error for element with null classList (0.128042ms)
  ✔ should not throw error for empty className (0.472708ms)
  ✔ should not throw error for null className (0.086875ms)
  ✔ should not throw error for undefined className (0.065083ms)
  ✔ should handle classes with special characters (0.120292ms)
  ✔ should be case sensitive (0.101042ms)
  ✔ should handle multiple toggles correctly (0.066ms)
  ✔ should work with force parameter edge cases (0.082292ms)
  ✔ should handle element with broken classList.toggle method (0.095167ms)
  ✔ should preserve other classes during toggle (0.061ms)
  ✔ should handle DOM-like element with real classList behavior (0.110083ms)
  ✔ should handle undefined force parameter (0.059709ms)
✔ toggleClass(element, className, force) (5.273666ms)
▶ uuid()
  ✔ should generate a valid UUID v4 (3.807167ms)
  ✔ should generate different UUIDs on multiple calls (0.326792ms)
  ✔ should return string type (0.349417ms)
  ✔ should throw error when crypto is not available (0.699791ms)
  ✔ should throw error when crypto.randomUUID is not available (0.165708ms)
  ✔ should throw error when crypto.randomUUID is not a function (0.144583ms)
  ✔ should handle crypto.randomUUID returning null (0.128458ms)
  ✔ should handle crypto.randomUUID returning undefined (0.133667ms)
  ✔ should pass through any value from crypto.randomUUID (0.142958ms)
  ✔ should handle crypto.randomUUID throwing an error (0.1425ms)
  ✔ should work with real crypto.randomUUID if available (0.351875ms)
  ✔ should generate unique values in rapid succession (0.244833ms)
✔ uuid() (7.8195ms)
▶ system
  ✔ should export all expected functions correctly (0.66775ms)
  ✔ should export createDirectory function (0.089084ms)
  ✔ should export decrypt function (0.066ms)
  ✔ should export encrypt function (0.063375ms)
  ✔ should export env function (0.052458ms)
  ✔ should export execAsync function (0.055459ms)
  ✔ should export fileExists function (0.056375ms)
  ✔ should export generateHash function (0.048375ms)
  ✔ should export getBasename function (0.051709ms)
  ✔ should export getCPUInfo function (0.052709ms)
  ✔ should export getDirname function (0.04925ms)
  ✔ should export getExtension function (0.042583ms)
  ✔ should export getHostname function (0.073458ms)
  ✔ should export getMemoryInfo function (0.058625ms)
  ✔ should export getNetworkInterfaces function (0.060417ms)
  ✔ should export isDirectory function (0.043625ms)
  ✔ should export joinPaths function (0.039708ms)
  ✔ should export listDirectoryContents function (0.037125ms)
  ✔ should export readFileAsync function (0.0365ms)
  ✔ should export removeDirectory function (0.064083ms)
  ✔ should export resolvePath function (0.034292ms)
  ✔ should export uuid function (0.037875ms)
  ✔ should export writeFileAsync function (0.033209ms)
✔ system (2.830084ms)
▶ createDirectory(dirPath, options)
  ✔ should create a directory with default recursive option (6.303625ms)
  ✔ should create nested directories when recursive is true (5.842708ms)
  ✔ should use custom options (1.67275ms)
  ✔ should not throw if directory already exists with recursive option (0.964667ms)
  ✔ should throw error when creating nested directory without recursive option (3.493666ms)
✔ createDirectory(dirPath, options) (19.431ms)
▶ decrypt(encryptedTextWithIv, key)
  ✔ should decrypt text encrypted with AES-256-CBC (1.034625ms)
  ✔ should decrypt empty string (0.144584ms)
  ✔ should decrypt unicode text (0.119833ms)
  ✔ should throw error for invalid format (no colon) (0.5505ms)
  ✔ should throw error for invalid format (empty IV) (0.0925ms)
  ✔ should throw error for invalid format (empty encrypted text) (1.427ms)
  ✔ should throw error for invalid hex in IV (0.136166ms)
  ✔ should throw error with wrong key (0.189625ms)
✔ decrypt(encryptedTextWithIv, key) (4.526583ms)
▶ encrypt(text, key, iv)
  ✔ should encrypt text using AES-256-CBC (2.047208ms)
  ✔ should encrypt empty string (0.147959ms)
  ✔ should encrypt unicode text (0.1035ms)
  ✔ should produce different output with different IVs (0.14075ms)
  ✔ should produce different output with different keys (0.12875ms)
  ✔ should produce consistent output with same inputs (0.730583ms)
  ✔ should handle long text (0.168583ms)
  ✔ should integrate properly with decrypt function (0.175667ms)
✔ encrypt(text, key, iv) (4.817291ms)
▶ env(key, defaultValue)
  ✔ should return environment variable value when it exists (0.916292ms)
  ✔ should return default value when environment variable does not exist (0.190792ms)
  ✔ should return undefined when environment variable does not exist and no default provided (0.145792ms)
  ✔ should return empty string when environment variable is empty string (1.718875ms)
  ✔ should return environment variable value even when it's '0' (0.147792ms)
  ✔ should return environment variable value even when it's 'false' (0.159959ms)
  ✔ should work with various default value types (0.747417ms)
  ✔ should handle non-string environment variable keys (0.094541ms)
  ✔ should work with common environment variables (0.140916ms)
✔ env(key, defaultValue) (5.088375ms)
▶ execAsync(command, options)
  ✔ should execute a simple command and return stdout (9.999792ms)
  ✔ should execute command and return both stdout and stderr (45.821125ms)
  ✔ should handle commands with no output (5.439125ms)
  ✔ should reject on command failure (6.544375ms)
  ✔ should reject on non-existent command (5.887667ms)
  ✔ should work with multi-line output (44.198208ms)
  ✔ should pass options to child_process.exec (101.531416ms)
  ✔ should handle commands with special characters (43.202333ms)
  ✔ should execute commands in different working directories (9.530042ms)
  ✔ should handle environment variables in options (39.839ms)
✔ execAsync(command, options) (313.228459ms)
▶ fileExists(filePath)
  ✔ should return true when file exists (6.262542ms)
  ✔ should return false when file does not exist (1.825625ms)
  ✔ should return true when directory exists (1.337542ms)
  ✔ should return false when directory does not exist (0.8215ms)
  ✔ should handle absolute paths (2.391458ms)
  ✔ should handle relative paths (4.219875ms)
  ✔ should handle empty file paths (1.051166ms)
  ✔ should handle special characters in file names (3.747791ms)
  ✔ should handle nested directory paths (3.457584ms)
  ✔ should handle permission denied scenarios gracefully (1.093167ms)
  ✔ should handle symbolic links (2.617ms)
✔ fileExists(filePath) (30.128666ms)
▶ generateHash(data, algorithm, encoding)
  ✔ should generate SHA256 hash with hex encoding by default (1.004208ms)
  ✔ should generate MD5 hash when specified (0.197458ms)
  ✔ should generate SHA1 hash when specified (0.666416ms)
  ✔ should generate SHA512 hash when specified (0.40975ms)
  ✔ should generate base64 encoded hash when specified (1.056292ms)
  ✔ should generate latin1 encoded hash when specified (0.092875ms)
  ✔ should handle empty string (0.079416ms)
  ✔ should handle unicode text (0.072709ms)
  ✔ should handle large strings (0.116125ms)
  ✔ should produce different hashes for different inputs (0.10125ms)
  ✔ should produce consistent hashes for same inputs (0.062083ms)
  ✔ should handle binary-like strings (0.061042ms)
  ✔ should handle newlines and special characters (0.059667ms)
✔ generateHash(data, algorithm, encoding) (4.941833ms)
▶ getBasename(p, ext)
  ✔ should return filename from path without extension parameter (0.690667ms)
  ✔ should return filename without extension when extension parameter provided (0.130125ms)
  ✔ should handle Windows-style paths (0.1ms)
  ✔ should handle Unix-style paths (0.069041ms)
  ✔ should return directory name when path ends with separator (0.055542ms)
  ✔ should handle paths with no directory (0.055458ms)
  ✔ should handle empty extension parameter (0.054583ms)
  ✔ should handle partial extension matches (0.075209ms)
  ✔ should handle files with multiple dots (0.136916ms)
  ✔ should handle files with no extension (0.897125ms)
  ✔ should handle hidden files (starting with dot) (0.286708ms)
  ✔ should handle root path (0.16275ms)
  ✔ should handle current directory path (0.069584ms)
  ✔ should handle parent directory path (0.0695ms)
  ✔ should handle complex paths with spaces and special characters (0.066916ms)
  ✔ should be consistent with Node.js path.basename (0.103667ms)
  ✔ should be consistent with Node.js path.basename with extension parameter (0.103125ms)
  ✔ should handle empty string path (0.044708ms)
✔ getBasename(p, ext) (4.517333ms)
▶ getCPUInfo()
  ✔ should return an array of CPU information (0.710792ms)
  ✔ should return CPU info objects with expected properties (0.132459ms)
  ✔ should be consistent with os.cpus() (0.660333ms)
  ✔ should return consistent results on multiple calls (0.143334ms)
  ✔ should handle CPUs with missing or empty model (0.1035ms)
  ✔ should handle CPUs with negative or zero speed (0.096584ms)
  ✔ should handle mixed edge cases (0.085416ms)
  ✔ should have reasonable CPU speed values (0.097416ms)
  ✔ should have non-empty CPU model (1.201125ms)
  ✔ should have valid times values (0.187167ms)
  ✔ should return multiple CPU cores on multi-core systems (0.111208ms)
✔ getCPUInfo() (4.403958ms)
▶ getDirname(p)
  ✔ should return directory name from file path (0.615ms)
  ✔ should handle Windows-style paths (0.082708ms)
  ✔ should handle Unix-style paths (0.081625ms)
  ✔ should handle paths ending with separator (0.058375ms)
  ✔ should handle relative paths (0.051667ms)
  ✔ should handle paths with no directory (0.051459ms)
  ✔ should handle root path (0.050083ms)
  ✔ should handle current directory path (0.059875ms)
  ✔ should handle parent directory path (2.187333ms)
  ✔ should handle nested relative paths (0.109ms)
  ✔ should handle paths with multiple consecutive separators (0.066334ms)
  ✔ should handle complex paths with spaces and special characters (0.053584ms)
  ✔ should handle hidden files and directories (0.048333ms)
  ✔ should be consistent with Node.js path.dirname (0.124542ms)
  ✔ should handle deeply nested paths (0.052833ms)
  ✔ should handle paths with file extensions in directory names (0.064083ms)
  ✔ should handle UNC paths on Windows (0.047709ms)
  ✔ should handle empty string (0.040417ms)
  ✔ should handle paths with only separators (0.038583ms)
✔ getDirname(p) (4.874666ms)
▶ getExtension(p)
  ✔ should return file extension including the dot (0.815292ms)
  ✔ should handle files with no extension (0.181917ms)
  ✔ should handle hidden files with extension (0.103041ms)
  ✔ should handle hidden files with actual extension (0.063291ms)
  ✔ should handle files with multiple dots (0.070625ms)
  ✔ should handle Windows-style paths (0.067375ms)
  ✔ should handle paths with no directory (0.053625ms)
  ✔ should handle directories ending with extension-like names (0.066416ms)
  ✔ should handle current directory (0.799584ms)
  ✔ should handle parent directory (0.108125ms)
  ✔ should handle root path (0.058333ms)
  ✔ should handle files ending with dot (0.050333ms)
  ✔ should handle complex extensions (0.10325ms)
  ✔ should handle special characters in filename (0.083458ms)
  ✔ should handle long extensions (0.049208ms)
  ✔ should be consistent with Node.js path.extname (0.217666ms)
  ✔ should handle empty string (0.052875ms)
  ✔ should handle paths with unicode characters (0.072375ms)
  ✔ should handle numeric extensions (0.038292ms)
  ✔ should handle case sensitivity (0.067084ms)
✔ getExtension(p) (4.465167ms)
▶ getHostname()
  ✔ should return a string (0.561166ms)
  ✔ should return a non-empty hostname (0.115083ms)
  ✔ should be consistent with os.hostname() (0.064875ms)
  ✔ should return consistent results on multiple calls (0.065ms)
  ✔ should return valid hostname format (0.108375ms)
  ✔ should not return null or undefined (0.091834ms)
  ✔ should have reasonable length (0.053916ms)
  ✔ should not start or end with hyphen (0.061042ms)
  ✔ should handle system hostname correctly (0.061084ms)
✔ getHostname() (1.993208ms)
▶ getMemoryInfo()
  ✔ should return an object with totalMemory and freeMemory properties (0.726958ms)
  ✔ should return numbers for memory values (0.10025ms)
  ✔ should match os.freemem() (0.072917ms)
  ✔ should return positive memory values (0.081666ms)
  ✔ should have freeMemory less than or equal to totalMemory (0.071625ms)
  ✔ should be consistent with os.totalmem() and os.freemem() (0.074167ms)
  ✔ should return reasonable memory values (0.063042ms)
  ✔ should return consistent totalMemory across calls (0.061458ms)
  ✔ should return memory values in bytes (0.063167ms)
  ✔ should show that freeMemory can vary between calls (1.552833ms)
  ✔ should have reasonable free memory percentage (0.068584ms)
  ✔ should return only the expected properties (0.076291ms)
  ✔ should handle memory values as integers (0.05175ms)
✔ getMemoryInfo() (5.012583ms)
▶ getNetworkInterfaces()
  ✔ should return an object (0.779417ms)
  ✔ should be consistent with os.networkInterfaces() (0.771125ms)
  ✔ should contain network interface information (0.120875ms)
  ✔ should have valid interface structures (0.219833ms)
  ✔ should have valid IP address formats (0.439792ms)
  ✔ should have valid netmask formats (0.152917ms)
  ✔ should have valid family values (0.74ms)
  ✔ should have valid MAC address formats (0.21525ms)
  ✔ should have valid internal boolean values (0.133792ms)
  ✔ should typically include loopback interface (0.145291ms)
  ✔ should return consistent results on multiple calls (0.171833ms)
  ✔ should have unique interface names (0.255584ms)
✔ getNetworkInterfaces() (5.012416ms)
▶ isDirectory(dirPath)
  ✔ should return true for existing directory (5.5ms)
  ✔ should return false for existing file (2.10575ms)
  ✔ should return false for non-existent path (0.730083ms)
  ✔ should handle absolute paths (0.535417ms)
  ✔ should handle relative paths (1.286791ms)
  ✔ should handle nested directories (3.522625ms)
  ✔ should handle current directory (0.708833ms)
  ✔ should handle parent directory (1.114958ms)
  ✔ should handle root directory (0.830458ms)
  ✔ should handle empty string path (0.36925ms)
  ✔ should handle special characters in directory names (0.879917ms)
  ✔ should handle permission denied scenarios gracefully (0.9885ms)
  ✔ should handle symbolic links to directories (2.439291ms)
  ✔ should handle symbolic links to files (2.405625ms)
  ✔ should handle broken symbolic links (1.144709ms)
✔ isDirectory(dirPath) (26.302167ms)
▶ joinPaths(...paths)
  ✔ should join two simple paths (0.641875ms)
  ✔ should join multiple paths (0.08425ms)
  ✔ should handle absolute paths (0.083334ms)
  ✔ should handle relative paths (0.068ms)
  ✔ should handle empty strings (0.06275ms)
  ✔ should handle single path (0.057417ms)
  ✔ should handle no arguments (0.053583ms)
  ✔ should normalize path separators (0.057ms)
  ✔ should handle Windows-style paths (0.140708ms)
  ✔ should handle Unix-style paths (0.076709ms)
  ✔ should handle current directory references (0.062333ms)
  ✔ should handle parent directory references (0.108833ms)
  ✔ should handle trailing separators (0.054666ms)
  ✔ should handle leading separators (0.061375ms)
  ✔ should handle special characters in paths (0.074792ms)
  ✔ should handle unicode characters (0.063375ms)
  ✔ should handle many arguments (0.093708ms)
  ✔ should be consistent with Node.js path.join (0.177209ms)
  ✔ should handle null and undefined gracefully (0.249958ms)
  ✔ should handle root path correctly (0.044625ms)
  ✔ should resolve complex path combinations (0.048666ms)
✔ joinPaths(...paths) (4.061ms)
▶ listDirectoryContents(dirPath)
  ✔ should return an array of filenames (8.653709ms)
  ✔ should include all files and directories (4.764292ms)
  ✔ should return only filenames without full paths (5.79025ms)
  ✔ should handle empty directory (5.376875ms)
  ✔ should handle absolute paths (4.557417ms)
  ✔ should handle relative paths (3.634417ms)
  ✔ should handle current directory (1.565333ms)
  ✔ should be consistent with fs.readdir (2.775625ms)
  ✔ should reject for non-existent directory (2.28375ms)
  ✔ should reject when trying to list a file instead of directory (1.818375ms)
  ✔ should handle special characters in filenames (2.824083ms)
  ✔ should handle hidden files (starting with dot) (4.185042ms)
  ✔ should handle nested directory structure (4.894167ms)
  ✔ should handle large number of files (56.828667ms)
✔ listDirectoryContents(dirPath) (111.523708ms)
▶ readFileAsync(filePath, encoding)
  ✔ should read file content with default UTF-8 encoding (4.765125ms)
  ✔ should read file content with explicit UTF-8 encoding (1.78825ms)
  ✔ should handle different encodings (2.817208ms)
  ✔ should handle empty files (0.978834ms)
  ✔ should handle absolute paths (1.674833ms)
  ✔ should handle relative paths (2.49225ms)
  ✔ should be consistent with fs.readFile (1.418958ms)
  ✔ should reject for non-existent file (1.121916ms)
  ✔ should reject when trying to read a directory (2.122334ms)
  ✔ should handle unicode content (2.579917ms)
  ✔ should handle large files (5.257083ms)
  ✔ should handle files with special characters in names (2.192333ms)
  ✔ should handle newlines and special characters in content (3.188625ms)
  ✔ should handle JSON files (2.7295ms)
  ✔ should handle binary-like content with different encodings (1.789209ms)
✔ readFileAsync(filePath, encoding) (38.347875ms)
▶ removeDirectory(dirPath, options)
  ✔ should remove empty directory with default options (5.695792ms)
  ✔ should remove directory with recursive option (5.020417ms)
  ✔ should fail to remove non-empty directory without recursive option (2.866292ms)
  ✔ should remove directory with force option (1.026375ms)
  ✔ should handle non-existent directory with force option (0.969375ms)
  ✔ should reject for non-existent directory without force option (0.84075ms)
  ✔ should handle absolute paths (3.842209ms)
  ✔ should handle relative paths (2.725541ms)
  ✔ should remove deeply nested directories (12.669208ms)
  ✔ should be consistent with fs.rm (3.530833ms)
  ✔ should handle special characters in directory names (0.981459ms)
  ✔ should handle directories with many files (16.791958ms)
  ✔ should handle mixed content (files and subdirectories) (6.383291ms)
  ✔ should reject when trying to remove a file (1.52025ms)
  ✔ should handle symbolic links to directories (3.225875ms)
✔ removeDirectory(dirPath, options) (69.868834ms)
▶ resolvePath(...paths)
  ✔ should resolve single absolute path (1.023291ms)
  ✔ should resolve single relative path (0.133209ms)
  ✔ should resolve multiple path segments (0.079042ms)
  ✔ should resolve mixed absolute and relative paths (0.082291ms)
  ✔ should handle current directory references (0.066083ms)
  ✔ should handle parent directory references (0.065875ms)
  ✔ should handle no arguments (1.2845ms)
  ✔ should resolve to absolute path (0.149209ms)
  ✔ should handle Windows-style paths (0.075792ms)
  ✔ should handle Unix-style paths (0.080792ms)
  ✔ should normalize path separators (0.057666ms)
  ✔ should handle trailing separators (0.101583ms)
  ✔ should handle empty strings (0.066292ms)
  ✔ should handle special characters in paths (0.049834ms)
  ✔ should handle unicode characters (0.071625ms)
  ✔ should resolve complex path navigation (0.051875ms)
  ✔ should handle absolute path override (0.07025ms)
  ✔ should be consistent with Node.js path.resolve (0.164625ms)
  ✔ should handle root path (0.04475ms)
  ✔ should handle many path segments (0.056708ms)
  ✔ should resolve relative to current working directory (0.047833ms)
  ✔ should handle double dots correctly (0.042167ms)
  ✔ should handle mixed separators on Windows (0.039ms)
  ✔ should handle UNC paths on Windows (0.04175ms)
  ✔ should handle edge cases with dots (0.081958ms)
✔ resolvePath(...paths) (5.162459ms)
▶ uuid()
  ✔ should return a string (0.880875ms)
  ✔ should return a valid UUID v4 format (0.216375ms)
  ✔ should have correct length (0.076458ms)
  ✔ should have hyphens in correct positions (0.078791ms)
  ✔ should have version 4 identifier (0.136208ms)
  ✔ should have valid variant bits (0.089584ms)
  ✔ should generate unique UUIDs (0.098042ms)
  ✔ should be consistent with crypto.randomUUID() (0.154667ms)
  ✔ should generate many unique UUIDs (1.325208ms)
  ✔ should only contain valid hexadecimal characters and hyphens (0.108917ms)
  ✔ should not contain uppercase letters (assuming lowercase format) (0.0765ms)
  ✔ should be usable as an identifier with a prefix (0.079916ms)
  ✔ should be suitable as an identifier (0.0635ms)
  ✔ should have proper entropy distribution (0.159708ms)
  ✔ should maintain format consistency across multiple calls (0.084375ms)
  ✔ should be cryptographically random (0.087458ms)
✔ uuid() (5.492417ms)
▶ writeFileAsync(filePath, data, encoding)
  ✔ should write string data to file with default UTF-8 encoding (7.691333ms)
  ✔ should write string data with explicit UTF-8 encoding (1.728042ms)
  ✔ should write Buffer data (3.611875ms)
  ✔ should handle different encodings (2.296708ms)
  ✔ should overwrite existing file (2.812709ms)
  ✔ should create file if it doesn't exist (3.024125ms)
  ✔ should handle empty string (1.929083ms)
  ✔ should handle absolute paths (1.034542ms)
  ✔ should handle relative paths (1.032291ms)
  ✔ should be consistent with fs.writeFile (3.39575ms)
  ✔ should handle unicode content (1.048292ms)
  ✔ should handle large content (1.160042ms)
  ✔ should handle special characters in filename (1.099459ms)
  ✔ should handle newlines and special characters in content (0.747958ms)
  ✔ should create directories when writing to nested path (3.482208ms)
  ✔ should reject when writing to directory that doesn't exist (0.902542ms)
  ✔ should handle JSON content (0.812625ms)
  ✔ should handle binary-like content with Buffer (0.610125ms)
  ✔ should handle base64 encoded content (1.671459ms)
  ✔ should handle concurrent writes to different files (1.440583ms)
✔ writeFileAsync(filePath, data, encoding) (43.225042ms)
ℹ tests 680
ℹ suites 50
ℹ pass 680
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 688.931125
-----------------------------|---------|----------|---------|---------|-------------------
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------|---------|----------|---------|---------|-------------------
All files                    |     100 |      100 |     100 |     100 |
 src                         |     100 |      100 |     100 |     100 |
  browser.js                 |     100 |      100 |     100 |     100 |
  system.js                  |     100 |      100 |     100 |     100 |
 src/browser                 |     100 |      100 |     100 |     100 |
  addClass.js                |     100 |      100 |     100 |     100 |
  copyToClipboardAsync.js    |     100 |      100 |     100 |     100 |
  createElement.js           |     100 |      100 |     100 |     100 |
  debounce.js                |     100 |      100 |     100 |     100 |
  fetchJSON.js               |     100 |      100 |     100 |     100 |
  findClosest.js             |     100 |      100 |     100 |     100 |
  getCookie.js               |     100 |      100 |     100 |     100 |
  getGlobal.js               |     100 |      100 |     100 |     100 |
  getLocalStorageJSON.js     |     100 |      100 |     100 |     100 |
  getOSInfo.js               |     100 |      100 |     100 |     100 |
  getStyle.js                |     100 |      100 |     100 |     100 |
  hasClass.js                |     100 |      100 |     100 |     100 |
  hideElement.js             |     100 |      100 |     100 |     100 |
  onDelegate.js              |     100 |      100 |     100 |     100 |
  once.js                    |     100 |      100 |     100 |     100 |
  parseQueryParams.js        |     100 |      100 |     100 |     100 |
  querySelectorAllWrapper.js |     100 |      100 |     100 |     100 |
  querySelectorWrapper.js    |     100 |      100 |     100 |     100 |
  removeClass.js             |     100 |      100 |     100 |     100 |
  removeElement.js           |     100 |      100 |     100 |     100 |
  setAttribute.js            |     100 |      100 |     100 |     100 |
  setLocalStorageJSON.js     |     100 |      100 |     100 |     100 |
  setStyle.js                |     100 |      100 |     100 |     100 |
  throttle.js                |     100 |      100 |     100 |     100 |
  toggleClass.js             |     100 |      100 |     100 |     100 |
  uuid.js                    |     100 |      100 |     100 |     100 |
 src/system                  |     100 |      100 |     100 |     100 |
  createDirectory.js         |     100 |      100 |     100 |     100 |
  decrypt.js                 |     100 |      100 |     100 |     100 |
  encrypt.js                 |     100 |      100 |     100 |     100 |
  env.js                     |     100 |      100 |     100 |     100 |
  execAsync.js               |     100 |      100 |     100 |     100 |
  fileExists.js              |     100 |      100 |     100 |     100 |
  generateHash.js            |     100 |      100 |     100 |     100 |
  getBaseName.js             |     100 |      100 |     100 |     100 |
  getCPUInfo.js              |     100 |      100 |     100 |     100 |
  getDirname.js              |     100 |      100 |     100 |     100 |
  getExtension.js            |     100 |      100 |     100 |     100 |
  getHostname.js             |     100 |      100 |     100 |     100 |
  getMemoryInfo.js           |     100 |      100 |     100 |     100 |
  getNetworkInterfaces.js    |     100 |      100 |     100 |     100 |
  isDirectory.js             |     100 |      100 |     100 |     100 |
  joinPaths.js               |     100 |      100 |     100 |     100 |
  listDirectoryContents.js   |     100 |      100 |     100 |     100 |
  readFileAsync.js           |     100 |      100 |     100 |     100 |
  removeDirectory.js         |     100 |      100 |     100 |     100 |
  resolvePath.js             |     100 |      100 |     100 |     100 |
  uuid.js                    |     100 |      100 |     100 |     100 |
  writeFileAsync.js          |     100 |      100 |     100 |     100 |
-----------------------------|---------|----------|---------|---------|-------------------
```

</details>
</td></tr></table>

Coverage reports will be generated in the `coverage/` directory.

To run tests in watch mode (re-running tests on file changes):

```sh
npm run test:watch
```

### Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting.

- **Check formatting:**

  ```sh
  npm run format:check
  ```

- **Apply formatting:**

  ```sh
  npm run format
  ```

- **Check for linting errors:**

  ```sh
  npm run lint:check
  ```

- **Apply linting fixes:**

  ```sh
  npm run lint
  ```

It's recommended to set up your editor to use these tools for a better
development experience.

### Building the Project

To build the project (compile TypeScript/JavaScript from `src/` to `dist/`):

```sh
npm run build
npm run bundle
```


---

## Contributing

Contributions are what make the open-source community such an amazing place to
learn, inspire, and create. Any contributions you make are **greatly
appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code adheres to the existing style and all tests pass.

---

## License

Distributed under the MIT License. See `LICENSE` file (if one exists) or
`package.json` for more information.

---

## Contact

Dylan Archer - @dylarcher - <dylarcher@gmail.com>

Project Link:
[https://github.com/dylarcher/js.helper-utils](https://github.com/dylarcher/js.helper-utils)
Homepage:
[https://dylarcher.github.io/js.helper-utils/](https://dylarcher.github.io/js.helper-utils/)
