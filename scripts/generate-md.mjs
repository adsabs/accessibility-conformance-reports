import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFullMarkdown } from './generate-full-md.mjs';
import { generateSummaryMarkdown } from './generate-summary-md.mjs';
import { generateDocsMarkdown } from './generate-docs-md.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

const showHelp = () => {
  console.log(`
Usage: node generate-md.mjs [options]

Options:
  --docs           Generate full WCAG Markdown files for documentation site (/docs)
  --summary-md     Generate summary Markdown table (/ _generated)
  --full-md        Generate full Markdown report in one file (/ _generated)
  --help, -h       Show this help message
`);
}

if (args.includes('--help') || args.includes('-h')) {
  showHelp()
  process.exit(0);
}

const run = async () => {
  const isSummary = args.includes('--summary-md');
  const isFull = args.includes('--full-md');
  const isDocs = args.includes('--docs');

  if (!isSummary && !isFull && !isDocs) {
    showHelp();
    process.exit(0);
  }

  if (isSummary) {
    const summaryDir = path.join(__dirname, '../_generated');
    await fs.ensureDir(summaryDir);
    const summary = await generateSummaryMarkdown();
    const outputPath = path.join(summaryDir, 'wcag-summary.md');
    await fs.outputFile(outputPath, summary);
    console.log(`📄 Generated ${outputPath}`);
  } else if (isFull || (!isSummary && !isDocs)) {
    const fullDir = path.join(__dirname, '../_generated');
    await fs.ensureDir(fullDir);
    const full = await generateFullMarkdown();
    const outputPath = path.join(fullDir, 'wcag-full.md');
    await fs.outputFile(outputPath, full);
    console.log(`📄 Generated ${outputPath}`);
  } else if (isDocs) {
    const docsDir = path.join(__dirname, '../docs');
    await fs.ensureDir(docsDir);
    await generateDocsMarkdown(docsDir);
    console.log(`📄 WCAG documentation files generated in ${docsDir}`);
  } else {
    showHelp();
    process.exit(0);
  }
};

run();
