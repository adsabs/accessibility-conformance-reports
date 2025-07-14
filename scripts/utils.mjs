import fs from 'fs-extra';
import path from 'path';
import slugify from 'slugify';
import { conformanceData } from './data.mjs';

export const slug = (text) => slugify(text, { lower: true, strict: true });

export const getConformanceByRefId = (refId) => {
  const entry = conformanceData.find((item) => item.ref_id === refId);
  return entry?.apps || [];
};

export const formatConformance = (apps, { plainText = false } = {}) => {
  if (!apps?.length) return [];

  return apps.map(({ name, conformance }) => {
    const status = conformance.status || 'unknown';

    const noteItems = conformance.notes?.length
      ? conformance.notes.map((n) => `<li>${n}</li>`).join('\n')
      : '';

    const noteBlock = noteItems ? `\n<ul>\n${noteItems}\n</ul>` : '';

    if (plainText) {
      const icons = {
        'support': '✅',
        'partial-support': '🟡',
        'no-support': '❌',
        'not-applicable': '⚪',
        'unknown': '⚫',
        'exception': '🔷'
      };

      return `<div class="project ${status}">\n <strong>${icons[status] || ''} ${name}</strong><em>${status}</em>${noteBlock}\n </div>`;
    }

    const component = {
      'support': 'Support',
      'partial-support': 'PartialSupport',
      'no-support': 'NoSupport',
      'not-applicable': 'NotApplicable',
      'exception': 'Exception',
      'unknown': 'Unknown',
    }[status] || 'Unknown';

    return `<Project name="${name}">\n  <${component}>${noteBlock}</${component}>\n</Project>`;
  });
};

export const ensureOutputDir = async (useDocs) => {
  const outputDir = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    useDocs ? '../docs' : '../_generated'
  );
  await fs.ensureDir(outputDir);
  return outputDir;
};

