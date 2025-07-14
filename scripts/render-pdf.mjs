import puppeteer from 'puppeteer';
import { readFile, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const summaryPath = path.resolve(__dirname, '../_generated/wcag-summary.md');
const fullPath = path.resolve(__dirname, '../_generated/wcag-full.md');
const cssPath = path.resolve(__dirname, './pdf.css');
const summaryOutputPath = path.resolve(__dirname, '../static/pdf/wcag-summary.pdf');
const fullOutputPath = path.resolve(__dirname, '../static/pdf/wcag-full.pdf');

const css = await readFile(cssPath, 'utf8');
marked.setOptions({ breaks: true, gfm: true, async: true });

const exists = async (filepath) => {
  try {
    await access(filepath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const renderPdf = async (mdPath, outputPath, label) => {
  const markdown = await readFile(mdPath, 'utf8');
  const html = await marked.parse(markdown);
  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${label}</title>
  <style>${css}</style>
</head>
<body>
${html}
</body>
</html>
`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm',
    },
  });
  await browser.close();
  console.log(`✅ ${label} PDF generated at ${outputPath}`);
};

if (await exists(summaryPath)) {
  await renderPdf(summaryPath, summaryOutputPath, 'Summary');
} else {
  console.warn(`⚠️  Summary file not found at ${summaryPath}`);
}

if (await exists(fullPath)) {
  await renderPdf(fullPath, fullOutputPath, 'Full');
} else {
  console.warn(`⚠️  Full report file not found at ${fullPath}`);
}
