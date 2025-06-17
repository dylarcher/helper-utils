/**
 * @file src/index.js
 * @module @dylarcher/js-helpers
 *
 * @description
 * This is the main entry point for the `@dylarcher/js-helpers` library.
 * It aggregates and re-exports utility functions from different modules,
 * primarily from `./browser.js` (for browser-specific utilities) and
 * `./system.js` (for Node.js/system-level utilities).
 *
 * This setup allows consumers of the library to import all available utilities
 * directly from the library's root import path, for example:
 * `import { addClass, readFileAsync, uuid } from '@dylarcher/js-helpers';`
 *
 * Name Collisions:
 * If utilities with the same name exist in both `./browser.js` and `./system.js`
 * (e.g., `uuid`), this file explicitly resolves such collisions. As per the current
 * implementation, if a name collision occurs, the utility from `./system.js` is
 * given precedence for the root export. For instance, `uuid` imported from the
 * library root will be the system version. To access a specific version in case of
 * a collision, users can import directly from the sub-modules:
 * `import { uuid as browserUuid } from '@dylarcher/js-helpers/browser';`
 * `import { uuid as systemUuid } from '@dylarcher/js-helpers/system';`
 */
// Re-export all named exports from the browser-specific utilities module.
// This makes all utilities defined in './browser.js' (which itself aggregates
// utilities from the './browser/' directory) available directly from the
// library's main entry point.
export * from './browser.js';
// Re-export all named exports from the system-specific (Node.js) utilities module.
// This makes all utilities defined in './system.js' (which likely aggregates
// utilities from a './system/' directory or defines them directly) available
// from the library's main entry point.
export * from './system.js';
// Explicitly handle the name collision for the `uuid` function.
// Both `./browser.js` and `./system.js` export a function named `uuid`.
// When using `export * from ...`, if multiple modules export the same name,
// the last one "wins" if not explicitly resolved. However, to make the choice clear
// and intentional, we explicitly re-export `uuid` from `./system.js`.
// This means that when a user imports `uuid` from the root of this library
// (e.g., `import { uuid } from '@dylarcher/js-helpers';`), they will get the
// version from `./system.js`.
// If the user needs the browser-specific `uuid`, they should import it directly
// from './browser.js' (e.g., `import { uuid as browserUuid } from '@dylarcher/js-helpers/browser';`).
export { uuid } from './system.js';
//# sourceMappingURL=index.js.map