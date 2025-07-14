import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { wcagData } from './data.mjs';
import { getConformanceByRefId, formatConformance, slug } from './utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../docs');

const generateMarkdownFiles = async () => {
  await fs.ensureDir(outputDir);

  for (const [principleIndex, principle] of wcagData.entries()) {
    const principleSlug = slug(principle.title);
    const principleDir = path.join(outputDir, principleSlug);
    await fs.ensureDir(principleDir);
    await writeCategoryFile(principleDir, principle.title, principleIndex + 1, false);

    for (const [guidelineIndex, guideline] of principle.guidelines.entries()) {
      const guidelineSlug = `${guideline.ref_id}-${slug(guideline.title)}`;
      const guidelineDir = path.join(principleDir, guidelineSlug);
      await fs.ensureDir(guidelineDir);
      await writeCategoryFile(guidelineDir, `${guideline.ref_id} ${guideline.title}`, guidelineIndex + 1);

      for (const sc of guideline.success_criteria) {
        const scSlug = `${sc.ref_id}-${slug(sc.title)}`;
        const fileName = `${scSlug}.mdx`;
        const filePath = path.join(guidelineDir, fileName);
        const sidebarPos = parseInt(sc.ref_id.split('.').pop(), 10);

        const frontmatter = `---
id: wcag-${scSlug}
title: ${sc.ref_id} ${sc.title}
sidebar_label: ${sc.ref_id} ${sc.title}
slug: /wcag/${scSlug}
description: "${sc.description.replace(/"/g, "'")}"
keywords: [wcag, accessibility, ${slug(sc.title)}]
sidebar_position: ${isNaN(sidebarPos) ? 0 : sidebarPos}
level: ${sc.level}
guideline: ${guideline.ref_id}
principle: ${principle.ref_id}
url: ${sc.url}
---
`;

        const content = `## Description

${sc.description}

## Conformance Notes

${formatConformance(getConformanceByRefId(sc.ref_id)).join('\n')}

## References

${(sc.references || []).map(r => `- [${r.title}](${r.url})`).join('\n') || '_None_'}

${sc.notes?.length ? `## Notes\n\n${sc.notes.map(n => `- ${n.content}`).join('\n')}` : ''}`;

        await fs.outputFile(filePath, frontmatter + content);
        console.log(`✅ ${filePath}`);
      }
    }
  }

  console.log('\n🎉 All WCAG Markdown docs generated.\n');
};

const writeCategoryFile = async (dirPath, label, position = 1, collapsed = true) => {
  const filePath = path.join(dirPath, '_category_.json');
  const data = { label, position };
  if (collapsed !== undefined) data.collapsed = collapsed;
  await fs.writeJson(filePath, data, { spaces: 2 });
  console.log(`📁 Created _category_.json in ${dirPath}`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateMarkdownFiles();
}

export { generateMarkdownFiles as generateDocsMarkdown };
