import fs from 'fs/promises';
import path from 'path';
import doctrine from 'doctrine';

const SCRIPT_NAME = '[gather-content]';
const SRC_DIR = 'src';
const ROOT_DIR = '.'; // Project root

async function findFiles(dir, extension, excludePatterns = []) {
  let results = [];
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        if (dirent.name === 'node_modules' || dirent.name.startsWith('.')) { // Skip node_modules and hidden directories
          continue;
        }
        results = results.concat(await findFiles(res, extension, excludePatterns));
      } else if (dirent.isFile() && dirent.name.endsWith(extension)) {
        let excluded = false;
        for (const pattern of excludePatterns) {
          if (dirent.name.endsWith(pattern)) {
            excluded = true;
            break;
          }
        }
        if (!excluded) {
          results.push(res);
        }
      }
    }
  } catch (err) {
    if (err.code === 'ENOENT' && dir === SRC_DIR) {
      console.warn(`${SCRIPT_NAME} Warn: Directory ${SRC_DIR} not found. Skipping JS file search in src.`);
      return []; // Return empty if src doesn't exist, not an error for this script's purpose
    }
    console.error(`${SCRIPT_NAME} Error finding files in ${dir}:`, err);
    throw err; // Re-throw other errors
  }
  return results;
}

// Helper function to format a single JSDoc tag
function formatJSDocTag(tag) {
  let tagString = `**@${tag.title}**`;
  if (tag.name) {
    tagString += ` \`${tag.name}\``;
  }
  if (tag.type) {
    let typeName = '';
    try {
      // Attempt to format complex types, might need more robust handling
      if (tag.type.type === 'TypeApplication' && tag.type.expression && tag.type.applications.length > 0) {
        typeName = `${tag.type.expression.name}<${tag.type.applications.map(app => app.name || 'Object').join(', ')}>`;
      } else if (tag.type.name) {
        typeName = tag.type.name;
      } else if (typeof tag.type === 'string') {
        typeName = tag.type;
      } else {
        typeName = 'Object'; // Fallback for unhandled types
      }
    } catch (e) {
      typeName = 'Object'; // Fallback if type parsing is tricky
    }
    tagString += ` \`{${typeName}}\``;
  }
  if (tag.description) {
    tagString += ` - ${tag.description}`;
  }
  return tagString;
}

// Helper function to parse JSDoc comments and format them as Markdown
function parseJSDocToMarkdown(jsdocString) {
  try {
    // { unwrap: true, sloppy: true, recoverable: true } allows for more lenient parsing
    const ast = doctrine.parse(jsdocString, { unwrap: true, sloppy: true, recoverable: true });
    let markdown = '';

    if (ast.description) {
      markdown += `${ast.description}\n\n`;
    }

    if (ast.tags && ast.tags.length > 0) {
      markdown += '### Details\n';
      ast.tags.forEach(tag => {
        markdown += `- ${formatJSDocTag(tag)}\n`;
      });
    }
    return markdown.trim();
  } catch (e) {
    console.warn(`${SCRIPT_NAME} Warn: Failed to parse JSDoc comment: ${e.message}`);
    return ''; // Return empty string if parsing fails
  }
}


async function gatherContent() {
  console.log(`${SCRIPT_NAME} Starting content gathering...`);
  const gatheredContent = [];

  // 1. Identify all .js files in src/, excluding *.spec.js and *.test.js
  // For JS files, parse JSDoc comments and store them alongside the content.
  try {
    const jsFiles = await findFiles(SRC_DIR, '.js', ['.spec.js', '.test.js']);
    for (const file of jsFiles) {
      const originalContent = await fs.readFile(file, 'utf-8');
      let jsdocMarkdown = '';

      // Regex to find all JSDoc blocks (/** ... */)
      // This is a simplified approach and might not capture all edge cases perfectly,
      // especially for JSDoc not directly associated with a standard function/class/export.
      const jsdocRegex = /\/\*\*(?:[^*]|\*(?!\/))*?\*\//gs;
      let match;
      const allJSDocMarkdown = [];

      while ((match = jsdocRegex.exec(originalContent)) !== null) {
        const parsed = parseJSDocToMarkdown(match[0]);
        if (parsed) {
          allJSDocMarkdown.push(parsed);
        }
      }

      if (allJSDocMarkdown.length > 0) {
        // For simplicity, concatenate all found JSDoc blocks.
        // A more sophisticated approach might try to associate them with specific code elements.
        jsdocMarkdown = allJSDocMarkdown.join('\n\n---\n\n');
      }

      gatheredContent.push({
        filepath: path.relative(ROOT_DIR, file),
        content: originalContent, // Store the original content without modifications
        jsdocMarkdown: jsdocMarkdown || null, // Store null if no JSDoc found
      });
    }
    console.log(`${SCRIPT_NAME} Found ${jsFiles.length} JS files in ${SRC_DIR}.`);
  } catch (error) {
    // Error already logged in findFiles if it's not ENOENT for src
    // If src doesn't exist, findFiles logs a warning and returns [], so this block might not even be hit for that case.
     if (error.code !== 'ENOENT') { // Log only if it's not a "src not found" error
        console.error(`${SCRIPT_NAME} Error processing JS files:`, error);
    }
  }


  // 2. Identify all .md files in the project (root and src/ for now)
  const markdownSearchPaths = [ROOT_DIR, SRC_DIR];
  const foundMdFiles = new Set(); // Use a Set to avoid duplicates if src is project root or similar overlaps

  for (const dir of markdownSearchPaths) {
    try {
      const mdFiles = await findFiles(dir, '.md');
      mdFiles.forEach(file => foundMdFiles.add(file));
    } catch (error) {
        // Log error if it's not an ENOENT for a specific directory (findFiles handles ENOENT for initial SRC_DIR)
        if (error.code !== 'ENOENT' || dir !== SRC_DIR) {
             console.error(`${SCRIPT_NAME} Error finding .md files in ${dir}:`, error);
        } else if (dir === SRC_DIR) {
            // This case is already handled by the warning in findFiles if SRC_DIR doesn't exist.
            // No need to log an additional error here.
        }
    }
  }

  for (const file of foundMdFiles) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      gatheredContent.push({
        filepath: path.relative(ROOT_DIR, file),
        content: content
      });
    } catch (readError) {
        console.error(`${SCRIPT_NAME} Error reading .md file ${file}:`, readError);
    }
  }
  console.log(`${SCRIPT_NAME} Found ${foundMdFiles.size} total .md files in specified paths.`);

  // 3. Log gathered content for verification
  console.log(`\n${SCRIPT_NAME} Gathered Content Summary:`);
  if (gatheredContent.length === 0) {
    console.log(`${SCRIPT_NAME} No content gathered. Check paths and file types.`);
  }
  gatheredContent.forEach(item => {
    const snippet = item.content.substring(0, 100).replace(/\n/g, ' ') + (item.content.length > 100 ? '...' : '');
    console.log(`- File: ${item.filepath}, Snippet: "${snippet}"`);
  });

  console.log(`\n${SCRIPT_NAME} Content gathering finished.`);
  return gatheredContent; // In case we want to use it programmatically later
}

export { gatherContent };

// If called directly, run and log results (optional, for testing this script independently)
if (import.meta.url === `file://${process.argv[1]}`) {
  gatherContent().catch(error => {
    console.error(`${SCRIPT_NAME} An unhandled error occurred during direct execution:`, error);
    process.exit(1);
  });
}
