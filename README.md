# js-helpers

[![CodeQL](https://github.com/dylarcher/js.helper-utils/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/dylarcher/js.helper-utils/actions/workflows/github-code-scanning/codeql)
[![Checks](https://github.com/dylarcher/js.helper-utils/actions/workflows/checks.yml/badge.svg)](https://github.com/dylarcher/js.helper-utils/actions/workflows/checks.yml)
[![npm downloads](https://img.shields.io/npm/dm/js-helpers.svg)](https://www.npmjs.com/package/js-helpers)
[![GitHub last commit](https://img.shields.io/github/last-commit/dylarcher/js.helper-utils.svg)](https://github.com/dylarcher/js.helper-utils/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/dylarcher/js.helper-utils.svg)](https://github.com/dylarcher/js.helper-utils)

Reusable javascript helper utility methods.

---

## Table of Contents

* [About The Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
  * [Available Utility Methods](#available-utility-methods)
* [Development](#development)
  * [Project Structure](#project-structure)
  * [Available Scripts](#available-scripts)
  * [Running Tests](#running-tests)
  * [Linting and Formatting](#linting-and-formatting)
  * [Building the Project](#building-the-project)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## About The Project

`js-helpers` is a lightweight, zero-dependency library offering a collection of reusable JavaScript utility methods designed to streamline common development tasks.

This project aims to provide well-tested, efficient, and easy-to-use functions for your JavaScript projects.

### Built With

* Node.js
* TypeScript (for type definitions and compilation)

---

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Make sure you have the following installed:

* Node.js (version >=18.20.8 recommended)

  ```sh
  node -v
  ```

* npm (version >=10.8.2 recommended)

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
import { exampleMethod } from 'js-helpers';
const result = exampleMethod(data);
console.info(result);
```

### Available Utility Methods

This section will be updated with a comprehensive list of available utility methods, their parameters, return values, and usage examples as they are developed.

* **Method 1:** (Description)
  * Usage: `method1(params)`
  * Test Coverage: 0%
* **Method 2:** (Description)
  * Usage: `method2(params)`
  * Test Coverage: 0%

> Currently, all methods are under development or pending documentation. Test coverage is 0%.

---

## Development

This section outlines how to contribute to the development of `js-helpers`, including understanding the project structure and using the available npm scripts.

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

| Script             | Description                                                                                                | How to use                |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------- |
| `prepare`        | Runs `npm dedupe && npm prune`. Executed automatically by npm after `npm install`.                     | (Automatic)               |
| `format`         | Formats code using Prettier (`.github/linters/.prettierrc.yml`).                                         | `npm run format`        |
| `format:check`   | Checks code formatting using Prettier without writing changes.                                             | `npm run format:check`  |
| `lint`           | Lints code using ESLint (`.github/linters/eslint.config.js`) and attempts to fix issues.                 | `npm run lint`          |
| `lint:check`     | Lints code using ESLint without fixing issues.                                                             | `npm run lint:check`    |
| `prebuild`       | Runs `lint:check` and `format:check` before building. Executed automatically before `npm run build`. | (Automatic)               |
| `build`          | Compiles source files from `src/` to `dist/` using `tsc`.                                            | `npm run build`         |
| `pretest`        | Runs `build` script. Executed automatically before `npm test`.                                         | (Automatic)               |
| `test`           | Runs tests using `node --no-warnings --experimental-specifier-resolution=node --inspect-brk test ...`.   | `npm test`              |
| `test:watch`     | Runs tests in watch mode.                                                                                  | `npm run test:watch`    |
| `c8`             | Base command for `c8` test coverage tool.                                                                | `npm run c8 -- <args>`  |
| `test:coverage`  | Runs tests and generates a coverage report using `c8`.                                                   | `npm run test:coverage` |
| `prepublishOnly` | Runs `build` script. Executed automatically before `npm publish`.                                      | (Automatic)               |

### Running Tests

To execute the test suite:

```sh
npm test
```

This command will:

1. (Via `pretest`) Build the project (`npm run build`).
2. Run test files (e.g., `**/*.test.js`) using the Node.js runtime with specific flags (`--no-warnings`, `--experimental-specifier-resolution=node`, `--inspect-brk`). The `--inspect-brk` flag enables the debugger and pauses execution at the start of the script.

To run tests and generate a coverage report (currently 0%):

```sh
npm run test:coverage
```

Coverage reports will be generated in the `coverage/` directory.

To run tests in watch mode (re-running tests on file changes):

```sh
npm run test:watch
```

### Linting and Formatting

This project uses ESLint for linting and Prettier for code formatting.

* **Check formatting:**

  ```sh
  npm run format:check
  ```

* **Apply formatting:**

  ```sh
  npm run format
  ```

* **Check for linting errors:**

  ```sh
  npm run lint:check
  ```

* **Apply linting fixes:**

  ```sh
  npm run lint
  ```

It's recommended to set up your editor to use these tools for a better development experience.

### Building the Project

To build the project (compile TypeScript/JavaScript from `src/` to `dist/`):

```sh
npm run build
npm run bundle
```

The `npm run build` script handles the compilation, and `npm run bundle` generates the `types.d.ts` file.
The `prepublishOnly` script automatically runs these before publishing.

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code adheres to the existing style and all tests pass.

---

## License

Distributed under the MIT License. See `LICENSE` file (if one exists) or `package.json` for more information.

---

## Contact

Dylan Archer - @dylarcher - <dylarcher@gmail.com>

Project Link: [https://github.com/dylarcher/js.helper-utils](https://github.com/dylarcher/js.helper-utils)
Homepage: [https://dylarcher.github.io/js.helper-utils/](https://dylarcher.github.io/js.helper-utils/)
