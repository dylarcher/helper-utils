// Main entry point - exports both browser and system utilities
export * from './browser.js';
export * from './system.js';

// Handle uuid function name collision by explicitly exporting system uuid
// (system uuid takes precedence over browser uuid based on import order expectation)
export { uuid } from './system.js';
