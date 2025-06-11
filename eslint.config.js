import pluginJs from "@eslint/js"
import eslintPluginMarkdown from "eslint-plugin-markdown"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import eslintPluginYaml from "eslint-plugin-yaml"
import globals from "globals"

export default [
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
			},
		},
	},
	pluginJs.configs.recommended,
	eslintPluginMarkdown.configs.recommended,
	{
		plugins: {
			yaml: eslintPluginYaml,
		},
		files: ["**/*.{yml,yaml}"],
		rules: {
			...eslintPluginYaml.configs.recommended.rules,
		},
	},
	eslintPluginPrettierRecommended,
	{
		rules: {
			indent: ["error", "tab", { SwitchCase: 1 }],
			"linebreak-style": ["error", "unix"],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"comma-dangle": ["error", "always-multiline"],
			"brace-style": ["error", "1tbs", { allowSingleLine: true }],
			"no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"no-console": ["warn", { allow: ["warn", "error", "info"] }],
			eqeqeq: ["error", "always", { null: "ignore" }],
			"no-var": "error",
			"prefer-const": ["error", { destructuring: "all" }],
			curly: ["error", "all"],
			"no-else-return": ["error", { allowElseIf: false }],
			"no-shadow": [
				"warn",
				{ builtinGlobals: true, hoist: "functions", allow: ["_"] },
			],
			"no-use-before-define": [
				"error",
				{ functions: false, classes: false, variables: true },
			],
			"no-return-await": "error",
			"prefer-template": "error",
			radix: "error",
			"no-throw-literal": "error",
			"prefer-promise-reject-errors": "error",
			yoda: ["error", "never", { exceptRange: true }],
			"object-curly-newline": ["error", { consistent: true }],
			"no-restricted-syntax": [
				"error",
				{
					selector: "CallExpression[callee.property.name='forEach']",
					message: "Use for...of instead of forEach.",
				},
			],
		},
	},
]
