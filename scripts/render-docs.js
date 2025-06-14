import fs from 'fs'; // Using sync methods for mkdir and writeFile for simplicity here
import path from 'path';
import Markdoc from '@markdoc/markdoc';
import { gatherContent } from './gather-content.js'; // Custom script to find and read content
import markdocConfig from '../markdoc.config.js'; // Markdoc configuration

const SCRIPT_NAME = '[render-docs]';
const OUTPUT_DIR = 'docs'; // All generated HTML files will be placed here

// Main function to render documentation
async function renderDocs() {
  console.log(`${SCRIPT_NAME} Starting documentation rendering...`);

  let allContent;
  // Step 1: Gather all content that needs to be documented
  try {
    // Temporarily suppress console output from gatherContent when it's used as a module.
    // This keeps the output of render-docs.js cleaner.
    const originalLog = console.log;
    const originalWarn = console.warn;
    // No-op the console functions
    console.log = () => {};
    console.warn = () => {};

    allContent = await gatherContent(); // Fetch file paths and their raw/JSDoc content

    // Restore original console functions
    console.log = originalLog;
    console.warn = originalWarn;

    if (allContent.length === 0) {
      console.log(`${SCRIPT_NAME} No content found by gather-content.js. Exiting.`);
      return;
    }
    console.log(`${SCRIPT_NAME} Successfully gathered ${allContent.length} file(s).`);

  } catch (error) {
    console.error(`${SCRIPT_NAME} Failed to gather content:`, error);
    return; // Exit if content gathering fails
  }

  console.log(`${SCRIPT_NAME} Processing ${allContent.length} files for Markdoc rendering...`);
  const generatedHtmlFiles = []; // To store paths of generated HTML for the index

  // Step 2: Process each gathered file
  for (const fileData of allContent) {
    try {
      console.log(`${SCRIPT_NAME} Processing: ${fileData.filepath}`);
      // fileData is an object like: { filepath: 'path/to/file.js', content: '...', jsdocMarkdown: '...' }

      // Prepare the input for Markdoc:
      // - For .md files, use the raw content.
      // - For .js files, prepend formatted JSDoc Markdown (if any) to the code block.
      let markdocInput = '';
      if (fileData.filepath.endsWith('.md')) {
        markdocInput = fileData.content; // Use Markdown content directly
      } else {
        // For JS files (or other code files if support is added)
        if (fileData.jsdocMarkdown && fileData.jsdocMarkdown.trim() !== '') {
          markdocInput += fileData.jsdocMarkdown + '\n\n'; // Add JSDoc Markdown if available
        }
        // Add the code block itself, using file extension for language hint or defaulting to 'javascript'
        const lang = path.extname(fileData.filepath).substring(1) || 'javascript';
        markdocInput += `\`\`\`${lang}\n${fileData.content}\n\`\`\``;
      }

      // Markdoc processing pipeline: Parse -> Transform -> Render
      const ast = Markdoc.parse(markdocInput);
      const transformedContent = Markdoc.transform(ast, markdocConfig); // Apply configurations (tags, nodes)
      const html = Markdoc.renderers.html(transformedContent); // Render to HTML

      // Determine the output path for the HTML file
      let outputSubPath = fileData.filepath;
      // Change extension to .html for all relevant files
      if (outputSubPath.endsWith('.md') || outputSubPath.endsWith('.js')) { // Check for original extension
        outputSubPath = outputSubPath.substring(0, outputSubPath.lastIndexOf('.')) + '.html';
      } else {
        // Fallback for any other file types that might be processed directly to HTML
        outputSubPath = outputSubPath + '.html';
      }

      const outputPath = path.join(OUTPUT_DIR, outputSubPath); // Full path in the 'docs' directory
      const outputDirForFile = path.dirname(outputPath); // Directory for the current file

      // Ensure the output directory exists
      if (!fs.existsSync(outputDirForFile)) {
        fs.mkdirSync(outputDirForFile, { recursive: true }); // Create directories recursively
        console.log(`${SCRIPT_NAME} Created directory: ${outputDirForFile}`);
      }

      // Write the rendered HTML to the file
      fs.writeFileSync(outputPath, html, 'utf-8');
      console.log(`${SCRIPT_NAME} Rendered HTML to: ${outputPath}`);
      generatedHtmlFiles.push(outputSubPath); // Add to list for the main index page

    } catch (error) {
      console.error(`${SCRIPT_NAME} Error processing file ${fileData.filepath}:`, error);
      // Continue to the next file if one fails, to prevent a single error from stopping the whole process
    }
  }

  // Step 3: Generate a main index HTML file linking to all generated documents
  try {
    const mainHtmlPath = path.join(OUTPUT_DIR, 'main.html');
    // Create list items for each generated HTML file
    const listItems = generatedHtmlFiles
      .map(filePath => `    <li><a href="${filePath.replace(/\\/g, '/')}">${filePath.replace(/\\/g, '/')}</a></li>`) // Ensure forward slashes for href
      .join('\n');

    // Basic HTML structure for the main index page
    const mainHtmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Project Documentation</title>
</head>
<body>
  <h1>Project Documentation</h1>
  <ul>
${listItems}
  </ul>
</body>
</html>`;

    fs.writeFileSync(mainHtmlPath, mainHtmlContent, 'utf-8');
    console.log(`${SCRIPT_NAME} Generated main index file: ${mainHtmlPath}`);
  } catch (error) {
    console.error(`${SCRIPT_NAME} Error generating main.html:`, error);
  }

  console.log(`${SCRIPT_NAME} Documentation rendering finished.`);
}

renderDocs().catch(error => {
  console.error(`${SCRIPT_NAME} An unhandled error occurred:`, error);
  process.exit(1);
});
