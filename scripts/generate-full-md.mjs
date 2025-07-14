import { wcagData } from './data.mjs';
import { slug, formatConformance, getConformanceByRefId } from './utils.mjs';

export const generateFullMarkdown = async () => {
  const lines = ['# WCAG 2.2 Conformance Report\n'];

  lines.push('## Table of Contents\n');
  for (const principle of wcagData) {
    lines.push(`- [${principle.ref_id} ${principle.title}](#${slug(principle.ref_id + '-' + principle.title)})`);
    for (const guideline of principle.guidelines) {
      lines.push(`  - [${guideline.ref_id} ${guideline.title}](#${slug(guideline.ref_id + '-' + guideline.title)})`);
      for (const sc of guideline.success_criteria) {
        lines.push(`    - [${sc.ref_id} ${sc.title}](#${slug(sc.ref_id + '-' + sc.title)})`);
      }
    }
  }

  for (const principle of wcagData) {
    lines.push(`\n# ${principle.ref_id} ${principle.title}`);
    lines.push(`_${principle.description}_`);

    for (const guideline of principle.guidelines) {
      lines.push(`\n## ${guideline.ref_id} ${guideline.title}`);
      lines.push(guideline.description);

      for (const sc of guideline.success_criteria) {
        const anchor = slug(`${sc.ref_id}-${sc.title}`);
        lines.push(`\n### ${sc.ref_id} ${sc.title} <a id="${anchor}"></a>`);

        if (sc.level) lines.push(`**Level**: ${sc.level}`);
        lines.push('\n');
        if (sc.url) lines.push(`**URL**: [${sc.url}](${sc.url})`);

        lines.push(`\n**Description:**\n\n${sc.description}`);

        const conformance = formatConformance(getConformanceByRefId(sc.ref_id), { plainText: true });
        if (conformance.length) {
          lines.push('\n**Conformance Notes:**\n');
          lines.push(conformance.join('\n'));
        }

        const references = (sc.references || []).map(r => `- [${r.title}](${r.url})`);
        lines.push('\n**References:**\n');
        lines.push(references.length ? references.join('\n') : '_None_');

        if (sc.notes?.length) {
          lines.push('\n**Notes:**\n');
          lines.push(sc.notes.map(n => `- ${n.content}`).join('\n'));
        }

        lines.push('\n<div style="page-break-after: always;"></div>\n');
      }
    }
  }

  return lines.join('\n') + '\n';
};
