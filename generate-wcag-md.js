const fs = require('fs-extra');
const path = require('path');
const slugify = require('slugify');

const wcagData = require('./wcag.json');
const conformanceData = require('./wcag-conformance.json');

const args = process.argv.slice(2);
const useDocs = args.includes('--docs');
const outputDir = path.join(__dirname, useDocs ? 'docs' : '_generated');

const slug = (text) => slugify(text, { lower: true, strict: true });

const titleCase = (text) =>
  text
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const createCategoryFile = async (dirPath, label, position = 1, collapsed = true) => {
  const filePath = path.join(dirPath, '_category_.json');
  const data = {
    label,
    position,
  };
  if (collapsed !== undefined) {
    data.collapsed = collapsed;
  }
  await fs.writeJson(filePath, data, { spaces: 2 });
  console.log(`📁 Created _category_.json in ${dirPath}`);
};

const getConformanceByRefId = (refId) => {
  const entry = conformanceData.find((item) => item.ref_id === refId);
  return entry?.apps || [];
};

const formatConformance = (apps) => {
  if (!apps.length) return '';

  return apps
    .map(({ name, conformance }) => {
      const component = {
        'support': 'Support',
        'partial-support': 'PartialSupport',
        'no-support': 'NoSupport',
        'not-applicable': 'NotApplicable',
        'exception': 'Exception',
        'unknown': 'Unknown',
      }[conformance.status] || 'Unknown';

      const noteItems = conformance.notes.length
        ? conformance.notes.map((n) => `<li>${n}</li>`).join('\n')
        : '';

      const noteBlock = noteItems ? `\n<ul>\n${noteItems}\n</ul>` : '';

      return `<Project name="${name}">\n  <${component}>${noteBlock}</${component}>\n</Project>`;
    })
    .join('\n\n');
};

const generateMarkdownFiles = async () => {
  await fs.ensureDir(outputDir);

  for (const [principleIndex, principle] of wcagData.entries()) {
    const principleSlug = slug(principle.title);
    const principleDir = path.join(outputDir, principleSlug);
    await fs.ensureDir(principleDir);
    await createCategoryFile(principleDir, principle.title, principleIndex + 1, false);

    for (const [guidelineIndex, guideline] of principle.guidelines.entries()) {
      const guidelineSlug = `${guideline.ref_id}-${slug(guideline.title)}`;
      const guidelineDir = path.join(principleDir, guidelineSlug);
      await fs.ensureDir(guidelineDir);
      await createCategoryFile(guidelineDir, `${guideline.ref_id} ${guideline.title}`, guidelineIndex + 1);

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

${formatConformance(getConformanceByRefId(sc.ref_id))}

## References

${(sc.references || []).map(r => `- [${r.title}](${r.url})`).join('\n') || '_None_'}

${sc.notes?.length ? `## Notes\n\n${sc.notes.map(n => `- ${n.content}`).join('\n')}` : ''}
`;

        await fs.outputFile(filePath, frontmatter + content);
        console.log(`✅ ${filePath}`);
      }
    }
  }

  console.log('\n🎉 All WCAG Markdown files and category metadata generated.\n');
};

generateMarkdownFiles().catch((err) => console.error('❌ Error:', err));

