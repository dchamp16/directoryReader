const fs = require('fs');
const path = require('path');

// Check if a directory path is provided as an argument
const parentDirectory = process.argv[2];

if (!parentDirectory) {
    console.log("Usage: node directoryReader.js <directory_path> [--compress]");
    console.log("Please provide the path to the directory you want to scan.");
    console.log("Optional: Use the '--compress' flag to minimize the output.");
    process.exit(1); // Exit the script if no directory path is provided
}

// Check if the --compress argument is passed to remove extra spaces and line breaks
const compressOutput = process.argv.includes('--compress');

// Set the base file name and the output file name based on whether the --compress flag is used
const baseFileName = 'directory_contents.txt';
const outputFile = compressOutput
    ? path.join(__dirname, 'directory_contents_compressed.txt')
    : path.join(__dirname, baseFileName);

// Excluded directories and files
const excludedDirs = ['node_modules', '.idea', 'venv', '.git']; // Directories to exclude
const excludedFiles = ['package-lock.json', '.DS_Store', '.gitattributes', '.gitignore']; // Files to exclude
const excludedExtensions = ['.o', '.out', '.exe', '.png', '.pdf']; // Exclude binary and compiled file extensions

// Helper function to generate a directory tree structure
function generateDirectoryTree(directory, depth = 0) {
    let tree = '';

    // Read directory contents
    const items = fs.readdirSync(directory, { withFileTypes: true });

    items.forEach((item) => {
        const itemPath = path.join(directory, item.name);

        // Skip excluded directories and files
        if (item.isDirectory() && shouldExcludeDirectory(item.name)) return;
        if (item.isFile() && shouldExcludeFile(item.name)) return;

        // Add indentation based on depth (skip indentation if compressing)
        const indentation = compressOutput ? '' : '  '.repeat(depth);

        if (item.isDirectory()) {
            tree += `${indentation}├── ${item.name}/\n`; // Add directory to the tree
            tree += generateDirectoryTree(itemPath, depth + 1); // Recurse into subdirectory
        } else if (item.isFile()) {
            tree += `${indentation}├── ${item.name}\n`; // Add file to the tree
        }
    });

    return tree;
}

// Function to recursively read the directory and write content to the file
function readDirectory(directory) {
    // Read directory contents
    const items = fs.readdirSync(directory, { withFileTypes: true });

    items.forEach((item) => {
        const itemPath = path.join(directory, item.name);
        const relativePath = path.relative(parentDirectory, itemPath);

        // Skip excluded directories
        if (item.isDirectory() && shouldExcludeDirectory(item.name)) {
            console.log(`Skipping directory: ${itemPath}`); // Debugging message
            return; // Skip this directory and do not recurse into it
        }

        // Skip excluded files
        if (item.isFile() && shouldExcludeFile(item.name)) {
            console.log(`Skipping file: ${itemPath}`); // Debugging message
            return; // Skip this file
        }

        // If it's a directory, recurse into it
        if (item.isDirectory()) {
            readDirectory(itemPath);
        } else if (item.isFile()) {
            // If it's a file and not excluded, read and write the content
            const fileContent = fs.readFileSync(itemPath, 'utf-8');

            // Create the file info format based on the compress option
            const fileInfo = compressOutput
                ? `File:${relativePath},Content:${fileContent.replace(/\s+/g, ' ').trim()}\n`
                : `File: ${relativePath}\nContent:\n${fileContent}\n\n-----------------------------\n\n`;

            fs.appendFileSync(outputFile, fileInfo, 'utf-8'); // Append content to the output file
        }
    });
}

// Helper function to determine if a directory should be excluded based on its name
function shouldExcludeDirectory(dirName) {
    // Check if the directory name exactly matches any of the excluded directories
    const isExcluded = excludedDirs.includes(dirName);
    console.log(`Checking directory: ${dirName}, Excluded: ${isExcluded}`); // Debugging line to see which directories are being excluded
    return isExcluded;
}

// Helper function to determine if a file should be excluded based on name or extension
function shouldExcludeFile(fileName) {
    const fileExt = path.extname(fileName);
    const isExcluded = excludedFiles.includes(fileName) || excludedExtensions.includes(fileExt);
    console.log(`Checking file: ${fileName}, Excluded: ${isExcluded}`); // Debugging line to see which files are being excluded
    return isExcluded;
}

// Start by generating the directory tree and clearing the output file
const directoryTree = generateDirectoryTree(parentDirectory);
const formattedTree = compressOutput ? directoryTree.replace(/\s+/g, ' ').trim() : directoryTree;
fs.writeFileSync(outputFile, `Directory Tree for ${parentDirectory}:\n\n${formattedTree}\n\n`, 'utf-8');

// Begin the recursive directory reading to write file content details
console.log(`Reading directory: ${parentDirectory}`);
readDirectory(parentDirectory);
console.log(`Directory content has been written to ${outputFile}`);
