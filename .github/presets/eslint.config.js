import pluginJs from '@eslint/js';
import eslintPluginMarkdown from 'eslint-plugin-markdown';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginYaml from 'eslint-plugin-yaml';
import globals from 'globals';

/**
 * ESLint configuration
 * This configuration is designed to work well with Prettier
 * and enforce consistent code quality and style
 */
export default [
	// Ignore certain files
	{
		ignores: [
			'**/*.yml',
			'**/*.yaml',
			'./dist/**',
			'./node_modules/**',
			'./docs/**',
		],
	},
	// Language options
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
			},
		},
	},
	// Base configurations
	pluginJs.configs.recommended,
	...eslintPluginMarkdown.configs.recommended,
	// YAML configuration
	{
		plugins: {
			yaml: eslintPluginYaml,
		},
		files: ['**/*.{yml,yaml}'],
		rules: {
			...eslintPluginYaml.configs.recommended.rules,
		},
	},
	// Prettier integration - must come before our custom rules
	{
		...eslintPluginPrettierRecommended,
		rules: {
			...eslintPluginPrettierRecommended.rules,
			'prettier/prettier': [
				'error',
				{
					printWidth: 80,
					tabWidth: 2,
					useTabs: true,
					semi: true,
					singleQuote: true,
					quoteProps: 'as-needed',
					jsxSingleQuote: false,
					trailingComma: 'all',
					bracketSpacing: true,
					bracketSameLine: true,
					arrowParens: 'avoid',
					endOfLine: 'lf',
					embeddedLanguageFormatting: 'auto',
					htmlWhitespaceSensitivity: 'css',
					proseWrap: 'always',
					singleAttributePerLine: true,
					vueIndentScriptAndStyle: false,
				},
			],
		},
	},
	// Custom rules that don't conflict with Prettier
	{
		rules: {
			// Style rules - defer to Prettier for most formatting
			quotes: [
				'error',
				'single',
				{ avoidEscape: true, allowTemplateLiterals: true },
			],
			semi: ['error', 'always'],
			'comma-dangle': ['error', 'always-multiline'],
			'no-useless-catch': 'warn',
			// Best practices
			eqeqeq: ['error', 'always', { null: 'ignore' }],
			'no-var': 'error',
			'prefer-const': ['error', { destructuring: 'all' }],
			curly: ['error', 'all'],
			'no-else-return': ['error', { allowElseIf: false }],
			'no-return-await': 'error',
			'prefer-template': 'error',
			radix: 'error',
			'no-throw-literal': 'error',
			'prefer-promise-reject-errors': 'error',
			yoda: ['error', 'never', { exceptRange: true }],

			// Variables and naming
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
			'no-shadow': [
				'warn',
				{
					builtinGlobals: true,
					hoist: 'functions',
					allow: ['_'],
					ignoreOnInitialization: true, // Added this option to reduce noise
				},
			],
			'no-use-before-define': [
				'error',
				{ functions: false, classes: false, variables: true },
			],

			// Disabled rules that conflict with Prettier
			indent: 'off', // Handled by Prettier
			'brace-style': 'off', // Handled by Prettier
			'linebreak-style': 'off', // Handled by Prettier via .editorconfig
			'object-curly-newline': 'off', // Handled by Prettier
		},
	},
	// Test file configuration - MUST come last to override previous rules
	{
		files: ['**/*.spec.js', '**/*.test.js', '**/test.utils.js'],
		languageOptions: {
			globals: {
				...globals.node,
				// Node.js test runner globals
				describe: 'readonly',
				it: 'readonly',
				test: 'readonly',
				expect: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				before: 'readonly',
				after: 'readonly',
			},
		},
		rules: {
			// Relax no-shadow for test files since test globals are common
			'no-shadow': 'off',
		},
	},
];
