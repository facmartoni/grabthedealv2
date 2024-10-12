const fs = require("fs");
const path = require("path");

const componentsDir = "./app/components";
const appDir = "./app"; // Root directory for Next.js pages (app/)
const projectRoot = "./"; // Root directory for searching for CSS files
const outputFile = path.join(
  "/mnt/c/Users/thund/Downloads/GrabTheDealComponents",
  "all-components-and-styles.txt",
);

// Function to recursively get all .jsx, page.jsx, and .css files in a directory
function getFilesByExtension(dir, extensions, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      getFilesByExtension(filePath, extensions, fileList); // Recurse into subdirectories
    } else if (
      extensions.includes(path.extname(file)) ||
      path.basename(file) === "page.jsx"
    ) {
      fileList.push(filePath); // Add .jsx, .css, and specifically 'page.jsx' files
    }
  });

  return fileList;
}

// Function to copy content from all specified files into a single .txt file
function copyFilesToTxt() {
  const jsxFiles = getFilesByExtension(componentsDir, [".jsx"]);
  const pageFiles = getFilesByExtension(appDir, [".jsx"]); // Includes 'page.jsx' files
  const cssFiles = getFilesByExtension(projectRoot, [".css"]);

  const allFiles = [...jsxFiles, ...pageFiles, ...cssFiles];

  // Clear the output file if it exists or create it
  fs.writeFileSync(outputFile, "");

  allFiles.forEach((file) => {
    const fileName = path.basename(file);
    const fileContent = fs.readFileSync(file, "utf8");

    // Write the file name with ## at the top, followed by its contents
    fs.appendFileSync(outputFile, `##${fileName}\n\n${fileContent}\n\n`);
  });

  console.log(`All components, pages, and styles copied to ${outputFile}`);
}

// Function to watch for file changes and trigger the copy process
function watchFiles() {
  // Watch for changes in components directory
  fs.watch(componentsDir, { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith(".jsx") || filename === "page.jsx")) {
      console.log(`${filename} was modified in components. Updating file...`);
      copyFilesToTxt();
    }
  });

  // Watch for changes in the app directory for pages
  fs.watch(appDir, { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith(".jsx") || filename === "page.jsx")) {
      console.log(
        `${filename} was modified in app directory. Updating file...`,
      );
      copyFilesToTxt();
    }
  });

  // Watch for changes in the entire project for CSS files
  fs.watch(projectRoot, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith(".css")) {
      console.log(`${filename} was modified in project. Updating file...`);
      copyFilesToTxt();
    }
  });

  console.log("Watching for file changes...");
}

// Initial copy of all files
copyFilesToTxt();

// Start watching for file changes
watchFiles();
