// scripts/generate-documentation.js
import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuration ---
const SRC_DIR = 'src';
const OUTPUT_DIR = 'docs/gemini'; // Output directory for generated markdown
const README_PATH = 'README.md'; // Path to the main README

// --- Helper Functions ---

/**
 * Finds all JavaScript files in a directory recursively.
 * @param {string} dir - The directory to search.
 * @returns {Promise<string[]>} A list of file paths.
 */
async function findJsFiles(dir) {
	let files = [];
	const items = await fs.readdir(dir, { withFileTypes: true });
	for (const item of items) {
		const fullPath = path.join(dir, item.name);
		if (item.isDirectory()) {
			files = files.concat(await findJsFiles(fullPath));
		} else if (item.isFile() && item.name.endsWith('.js') && !item.name.endsWith('.spec.js') && !item.name.endsWith('.test.js')) {
			// Exclude test/spec files
			files.push(fullPath);
		}
	}
	return files;
}

/**
 * A simplified JSDoc parser to extract comments, especially @example and function signature.
 * This will be very basic for now and can be improved.
 * @param {string} fileContent - The content of the JavaScript file.
 * @returns {Promise<Array<{fileName: string, jsdocs: string, examples: string[], codeSignature: string}>>} Extracted JSDoc info.
 */
async function parseJsDoc(filePath, fileContent) {
    const jsdocs = [];
    // Regex to find JSDoc blocks /** ... */
    const jsDocRegex = /\/\*\*\s*
([\s\S]*?)
\s*\*\//g;
    // Regex to find function/method signatures following a JSDoc block
    // This is a simplified regex and might need adjustments for complex cases
    const codeSignatureRegex = /export\s+(async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\)\s*{|\*\/\s*export\s+const\s+([a-zA-Z0-9_]+)\s*=\s*(async\s+)?\(([\s\S]*?)\)\s*=>\s*{|\*\/\s*export\s+class\s+([a-zA-Z0-9_]+)\s*{([\s\S]*?)}\s*(?:
\s*(?:async\s+)?(?:get\s+|set\s+)?([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\)\s*{)?/g;


    let match;
    let lastIndex = 0;

    while ((match = jsDocRegex.exec(fileContent)) !== null) {
        const docContent = match[1].split('\n').map(line => line.trim().replace(/^\*\s?/, '')).join('\n');
        const examples = [];
        const exampleRegex = /@example\s*\n([\s\S]*?)(?=\n\s*(@\w|\*\/|$))/g;
        let exampleMatch;
        while((exampleMatch = exampleRegex.exec(docContent)) !== null) {
            examples.push(exampleMatch[1].trim());
        }

        // Try to find the code signature immediately following the JSDoc block
        codeSignatureRegex.lastIndex = jsDocRegex.lastIndex; // Start search from end of JSDoc
        const signatureMatch = codeSignatureRegex.exec(fileContent);
        let codeSignature = '';
        if (signatureMatch) {
            // Construct a simplified signature. This can be greatly improved.
            if (signatureMatch[2]) { // function name(args)
                 codeSignature = `function ${signatureMatch[2]}(${signatureMatch[3].split('\n').map(l => l.trim()).filter(Boolean).join(', ')}) { ... }`;
            } else if (signatureMatch[4]) { // const name = (args) =>
                 codeSignature = `const ${signatureMatch[4]} = (${signatureMatch[5].split('\n').map(l => l.trim()).filter(Boolean).join(', ')}) => { ... }`;
            } else if (signatureMatch[7]) { // class Name { ... method(args) ... }
                 codeSignature = `class ${signatureMatch[7]} { ... }`;
                 if (signatureMatch[10]) { // method inside class
                     codeSignature += `\n  ${signatureMatch[10]}(${signatureMatch[11].split('\n').map(l => l.trim()).filter(Boolean).join(', ')}) { ... }`;
                 }
            }
        }


        jsdocs.push({
            fileName: path.basename(filePath),
            jsdoc: docContent,
            examples: examples,
            codeSignature: codeSignature
        });
        lastIndex = jsDocRegex.lastIndex;
    }

    return jsdocs;
}


/**
 * Generates documentation content using the Gemini API.
 * @param {Array<object>} allJsDocData - Array of extracted JSDoc data.
 * @param {string} readmeContent - Content of the README.md file.
 * @returns {Promise<string>} The generated Markdown documentation.
 */
async function generateDocumentationWithGemini(allJsDocData, readmeContent) {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error("GEMINI_API_KEY environment variable not set.");
	}
	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });

	// Constructing a detailed prompt
    let prompt = \`Generate comprehensive API documentation in Markdown format for a JavaScript library.

Project Overview (from README.md):
---
${readmeContent}
---

The library's source code is organized into 'browser' and 'system' utilities.
For each utility, I will provide JSDoc comments, code examples (@example), and the primary code signature.

Your task is to:
1.  Create a main page for the documentation (e.g., 'index.md').
2.  This main page should include:
    *   A brief introduction based on the project overview.
    *   Sections for 'Browser Utilities' and 'System Utilities'.
    *   Under each section, list the available functions/methods with a brief description derived from their JSDocs.
3.  For each function/method, generate a detailed section (or a separate linked Markdown file if you think it's better for organization). This section should include:
    *   The function/method name.
    *   The full JSDoc content.
    *   All provided @example code blocks, clearly formatted as JavaScript code (use \`\`\`javascript).
    *   The primary code signature, also formatted as JavaScript code (use \`\`\`javascript).
4.  Ensure the documentation is well-organized, easy to navigate, and uses clear language.
5.  Use Markdown for all formatting. Pay special attention to creating colored code blocks for JavaScript examples and signatures.

Here is the data extracted from the source files:
\`;

    for (const data of allJsDocData) {
        prompt += \`
---
File: ${data.fileName}
Path: ${data.filePath}

JSDoc:
${data.jsdoc}

Code Signature:
\`\`\`javascript
${data.codeSignature}
\`\`\`

Examples:
\`;
        data.examples.forEach((ex, idx) => {
            prompt += \`
Example ${idx + 1}:
\`\`\`javascript
${ex}
\`\`\`
\`;
        });
        prompt += \`---
\`;
    }

    prompt += "Please generate the Markdown documentation now."

	try {
		console.log("Sending prompt to Gemini API. Prompt length:", prompt.length);
        if (prompt.length > 30000) { // Gemini Pro has a limit, this is a rough check
            console.warn("Prompt is very long, might exceed API limits. Consider summarizing or splitting data.");
        }
		const result = await model.generateContent(prompt);
		const response = await result.response;
		return response.text();
	} catch (error) {
		console.error("Error calling Gemini API:", error);
		throw error;
	}
}

/**
 * Saves the generated documentation to files.
 * For now, it saves everything to a single index.md file.
 * @param {string} markdownContent - The Markdown content to save.
 */
async function saveDocumentation(markdownContent) {
	await fs.mkdir(OUTPUT_DIR, { recursive: true });
	const outputPath = path.join(OUTPUT_DIR, 'index.md');
	await fs.writeFile(outputPath, markdownContent);
	console.log(\`Documentation saved to ${outputPath}\`);
}

// --- Main Orchestration ---
async function main() {
	console.log("Starting documentation generation...");

	try {
		// 1. Find all JS files in src
		const jsFiles = await findJsFiles(SRC_DIR);
		console.log(\`Found ${jsFiles.length} JavaScript files in ${SRC_DIR}\`);
        if (jsFiles.length === 0) {
            console.log("No JavaScript files found to document.");
            return;
        }

		// 2. Parse JSDoc for each file
		let allJsDocData = [];
		for (const filePath of jsFiles) {
			const fileContent = await fs.readFile(filePath, 'utf-8');
            const docDataForFile = await parseJsDoc(filePath, fileContent);
            // Add filePath to each doc item
            allJsDocData = allJsDocData.concat(docDataForFile.map(doc => ({...doc, filePath})));
		}
        console.log(\`Extracted JSDoc data for ${allJsDocData.length} items.\`);
        if (allJsDocData.length === 0) {
            console.log("No JSDoc comments found to process.");
            return;
        }
        // console.log("Sample JSDoc Data:", JSON.stringify(allJsDocData.slice(0,1), null, 2));


		// 3. Read README.md content
		let readmeContent = '';
		try {
			readmeContent = await fs.readFile(README_PATH, 'utf-8');
			console.log(\`Successfully read ${README_PATH}\`);
		} catch (err) {
			console.warn(\`Warning: Could not read ${README_PATH}. Proceeding without it. Error: ${err.message}\`);
		}

		// 4. Generate documentation with Gemini
		console.log("Generating documentation with Gemini API...");
		const generatedMarkdown = await generateDocumentationWithGemini(allJsDocData, readmeContent);
        // console.log("Gemini Response (raw):\n", generatedMarkdown);


		// 5. Save the documentation
		await saveDocumentation(generatedMarkdown);

		console.log("Documentation generation completed successfully!");

	} catch (error) {
		console.error("Error during documentation generation:", error);
		process.exit(1); // Exit with error code
	}
}

main();
