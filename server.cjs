const fs = require('fs').promises;
const path = require('path');

async function listFilesInDirectory(directory) {
    try {
        const files = await fs.readdir(directory);
        console.log(`Files in ${directory}:`, files);
    } catch (error) {
        console.error(`Error reading directory ${directory}:`, error);
    }
}

const testDirectory = path.resolve(__dirname, 'test');
listFilesInDirectory(testDirectory);
