
# Directory Reader and File Content Extractor

This project is a Node.js script that recursively reads the content of files within a specified directory and writes it to an output file. It supports both a formatted and a compressed version of the output file based on a command-line flag.

## Features
- **Directory Tree Structure**: Generates a visual representation of the directory tree at the top of the output file.
- **File Content Extraction**: Extracts and writes the content of each file in the directory to the output file.
- **Exclusion Options**: Supports excluding specific directories, files, and file types.
- **Compressed Output Option**: Can create a minimized version of the output file without extra spaces or line breaks.

## Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

## Installation
1. Clone the repository or download the script.
2. Navigate to the directory where the script is located.
3. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage
### 1. Generate a Regular Output File
To run the script and generate a regular `directory_contents.txt` file:

```bash
node yourScript.js /path/to/your/project
```
This command will generate a file named `directory_contents.txt` containing:
- The directory tree structure at the top.
- Detailed content of all included files.

### 2. Generate a Compressed Output File
To run the script with compressed formatting:

```bash
node yourScript.js /path/to/your/project --compress
```
This command will generate a file named `directory_contents_compressed.txt` containing:
- The minimized directory tree structure.
- Compact file contents without extra spaces or new lines.

### 3. Customize Exclusions
By default, the script excludes certain directories and files. You can modify these exclusions directly in the script:
- **Excluded Directories**: `['node_modules', '.idea', 'venv', '.git']`
- **Excluded Files**: `['package-lock.json', '.DS_Store', '.gitattributes', '.gitignore']`
- **Excluded File Extensions**: `['.o', '.out', '.exe', '.png', '.pdf']`

### 4. Modify the Output File Name
The script automatically uses `directory_contents.txt` for regular output and `directory_contents_compressed.txt` for compressed output. You can modify these names in the script if needed.

## Example Output

### Non-Compressed Output
```
Directory Tree for /path/to/your/project:

├── folder1/
├── folder2/
├── file1.txt
├── file2.txt

File: file1.txt
Content:
This is some content in file1.

-----------------------------

File: file2.txt
Content:
This is some content in file2.

-----------------------------

```

### Compressed Output
```
Directory Tree for /path/to/your/project: ├── folder1/ ├── folder2/ ├── file1.txt ├── file2.txt File:file1.txt,Content:This is some content in file1. File:file2.txt,Content:This is some content in file2.
```

## Troubleshooting
- Ensure that you have write permissions in the directory where the script is generating the output file.
- Verify that the `--compress` flag is correctly passed if you want a compressed version of the output.

## License
This project is licensed under the MIT License.
