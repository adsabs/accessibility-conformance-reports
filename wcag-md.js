const fs = require('fs-extra');
const path = require('path');
const slugify = require('slugify');

// Load structured WCAG data
const wcagData = require('./wcag.json');
const outputDir = path.join(__dirname, 'wcag-md');

const slug = (text) => slugify(text, { lower: true, strict: true });

const generateMarkdownFiles = async () => {
  await fs.ensureDir(outputDir);

  for (const principle of wcagData) {
    const principleSlug = slug(principle.title);
    const principleDir = path.join(outputDir, principleSlug);
    await fs.ensureDir(principleDir);

    for (const guideline of principle.guidelines) {
      const guidelineSlug = `${guideline.ref_id}-${slug(guideline.title)}`;
      const guidelineDir = path.join(principleDir, guidelineSlug);
      await fs.ensureDir(guidelineDir);

      for (const sc of guideline.success_criteria) {
        const scSlug = `${sc.ref_id}-${slug(sc.title)}`;
        const fileName = `${scSlug}.md`;
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

<!-- Add your conformance notes and evaluation here -->

## References

${(sc.references || []).map(r => `- [${r.title}](${r.url})`).join('\n') || '_None_'}

${sc.notes?.length ? `## Notes\n\n${sc.notes.map(n => `- ${n.content}`).join('\n')}` : ''}

`;

        await fs.outputFile(filePath, frontmatter + content);
        console.log(`✅ ${filePath}`);
      }
    }
  }

  console.log('\n🎉 All WCAG Markdown files generated for Docusaurus.\n');
};

generateMarkdownFiles().catch((err) => console.error('❌ Error:', err));

