const fs = require("node:fs/promises");
const path = require("node:path");

const reportsDirectory = path.join(__dirname, "..", "reports");
const formatCharacterPattern = /\p{Cf}/gu;
const hasFormatCharacterPattern = /\p{Cf}/u;
const unicodeTablePattern = /new Uint16Array\('([\s\S]*?)'\)/g;

async function findHtmlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(entryPath)));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".html") {
      files.push(entryPath);
    }
  }

  return files;
}

function escapeFormatterData(html, filePath) {
  let cursor = 0;
  let escapedCount = 0;
  let sanitized = "";
  let match;

  unicodeTablePattern.lastIndex = 0;
  while ((match = unicodeTablePattern.exec(html)) !== null) {
    const beforeTable = html.slice(cursor, match.index);
    if (hasFormatCharacterPattern.test(beforeTable)) {
      throw new Error(`Unexpected hidden format character outside formatter data: ${filePath}`);
    }
    sanitized += beforeTable;

    const escapedTable = match[1].replace(formatCharacterPattern, (character) => {
      escapedCount += 1;
      const codePoint = character.codePointAt(0);
      const hex = codePoint.toString(16).padStart(4, "0");
      return codePoint <= 0xffff ? `\\u${hex}` : `\\u{${hex}}`;
    });
    sanitized += `new Uint16Array('${escapedTable}')`;
    cursor = match.index + match[0].length;
  }

  const remainder = html.slice(cursor);
  if (hasFormatCharacterPattern.test(remainder)) {
    throw new Error(`Unexpected hidden format character outside formatter data: ${filePath}`);
  }
  sanitized += remainder;

  return { sanitized, escapedCount };
}

async function main() {
  const htmlFiles = await findHtmlFiles(reportsDirectory);
  let changedReports = 0;

  for (const filePath of htmlFiles) {
    const html = await fs.readFile(filePath, "utf8");
    const { sanitized, escapedCount } = escapeFormatterData(html, filePath);

    if (escapedCount > 0) {
      await fs.writeFile(filePath, sanitized, "utf8");
      changedReports += 1;
      console.log(`Escaped ${escapedCount} hidden format characters in ${path.relative(reportsDirectory, filePath)}`);
    }
  }

  console.log(`Sanitized ${changedReports} HTML report(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
