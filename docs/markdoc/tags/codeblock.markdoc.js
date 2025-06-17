import fs from 'fs';
import path from 'path';
import Markdoc from '@markdoc/markdoc';
const { Tag } = Markdoc;

export const codeblock = {
  render: 'fence',
  attributes: {
    src: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      default: 'javascript'
    }
  },
  async transform(node, config) {
    const attributes = node.transformAttributes(config);
    const { src, lang } = attributes;
    const filePath = path.join(process.cwd(), src); // Assuming src is relative to project root

    try {
      const code = await fs.promises.readFile(filePath, 'utf-8');
      return new Tag('fence', { content: code, language: lang }, []);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return new Tag('fence', { content: `Error: Could not load code from ${src}`, language: 'text' }, []);
    }
  }
};
