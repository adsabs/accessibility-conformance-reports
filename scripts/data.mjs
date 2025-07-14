import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const wcagData = JSON.parse(
  await fs.readFile(path.resolve(__dirname, '../wcag.json'), 'utf8')
);

export const conformanceData = JSON.parse(
  await fs.readFile(path.resolve(__dirname, '../wcag-conformance.json'), 'utf8')
);
