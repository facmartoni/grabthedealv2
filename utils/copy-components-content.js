const fs = require("fs");
const path = require("path");

const componentsDir = "./app/components";
const outputFile = path.join(
  "/mnt/c/Users/thund/Downloads/GrabTheDealComponents",
  "all-components.txt",
);

// Function to recursively get all .jsx files in the components directory
function getJSXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      getJSXFiles(filePath, fileList); // Recurse into subdirectories
    } else if (path.extname(file) === ".jsx") {
      fileList.push(filePath); // Only add .jsx files
    }
  });

  return fileList;
}

// Function to copy content from all .jsx files into a single .txt file
function copyComponentsToTxt() {
  const jsxFiles = getJSXFiles(componentsDir);

  // Clear the output file if it exists or create it
  fs.writeFileSync(outputFile, "");

  jsxFiles.forEach((file) => {
    const fileName = path.basename(file, ".jsx");
    const fileContent = fs.readFileSync(file, "utf8");

    // Write the file name with ## at the top, followed by its contents
    fs.appendFileSync(outputFile, `##${fileName}\n\n${fileContent}\n\n`);
  });

  console.log(`All components copied to ${outputFile}`);
}

// Run the function to copy the components
copyComponentsToTxt();
