import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Resolve __dirname in an ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to read files and directories recursively
function readDirectory(directoryPath, output) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // If it's a directory, recursively read it
      readDirectory(filePath, output);
    } else {
      // If it's a file, output in the specified formats
      const content = fs.readFileSync(filePath, "utf8");

      // Append output to the file
      output.push(`path-file-output: ${filePath}\n`);
      output.push(`path-file-content: ${content}\n`);
      output.push(`path-file-name-content: ${file} - ${content}\n`);
    }
  });
}

// Replace 'src' with your source directory
const srcDirectory = path.join(__dirname, "src");
const output = [];

// Read the directory and collect output
readDirectory(srcDirectory, output);

// Write the output to a text file
const outputFilePath = path.join(__dirname, "output.txt");
fs.writeFileSync(outputFilePath, output.join("\n"), "utf8");

console.log(`Output written to ${outputFilePath}`);
