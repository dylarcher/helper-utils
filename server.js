import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import Markdoc from '@markdoc/markdoc';
const { Tag } = Markdoc; // Adjusted import based on earlier finding
import markdocConfig from './docs/markdoc/markdoc.config.js';

const app = express();
const port = 3000;

const DOCS_DIR = path.join(process.cwd(), 'docs', 'spec');
const LAYOUTS_DIR = path.join(process.cwd(), 'docs', 'markdoc', 'layouts');
const CSS_DIR = path.join(process.cwd(), 'docs', 'spec', 'css');

// Function to get a basic HTML layout
async function getBasicLayout(title, content) {
  let layoutContent;
  try {
    layoutContent = await fs.readFile(path.join(LAYOUTS_DIR, 'default.html'), 'utf-8');
  } catch (e) {
    console.warn("docs/markdoc/layouts/default.html not found, using basic fallback layout.");
    layoutContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  <style>
    body { font-family: sans-serif; margin: 2em; }
    pre { background-color: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; }
    code { font-family: monospace; }
  </style>
</head>
<body>
  <main>
    {{ content }}
  </main>
</body>
</html>`;
  }
  return layoutContent.replace('{{ title }}', title).replace('{{ content }}', content);
}

// Middleware to render Markdoc files
app.use(async (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  let filePath = req.path;
  if (filePath.endsWith('/')) {
    filePath += 'index.md';
  } else if (!filePath.endsWith('.md')) {
    filePath += '.md';
  }

  // Normalize and validate the path
  const fullPath = path.resolve(DOCS_DIR, filePath);
  if (!fullPath.startsWith(DOCS_DIR)) {
    res.status(403).send('Forbidden: Invalid file path.');
    return;
  }

  try {
    await fs.access(fullPath);
    const markdown = await fs.readFile(fullPath, 'utf-8');
    const ast = Markdoc.parse(markdown);
    const content = Markdoc.transform(ast, markdocConfig);
    const html = Markdoc.renderers.html(content);

    let title = path.basename(filePath, '.md');
    if (ast.attributes.frontmatter) {
        const fm = {};
        ast.attributes.frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                fm[key.trim()] = valueParts.join(':').trim();
            }
        });
        if (fm.title) {
            title = fm.title;
        }
    }

    const pageHtml = await getBasicLayout(title, html);
    res.send(pageHtml);

  } catch (error) {
    if (error.code === 'ENOENT') {
      return next();
    }
    console.error(`Error processing ${fullPath}:`, error);
    res.status(500).send('Error rendering Markdoc file.');
  }
});

// Static CSS serving
app.use('/css', express.static(CSS_DIR));

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(port, () => {
  console.log(`Markdoc server listening at http://localhost:${port}`);
});
