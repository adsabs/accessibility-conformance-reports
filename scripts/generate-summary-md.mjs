import { getConformanceByRefId } from './utils.mjs';
import { wcagData } from './data.mjs';

export const generateSummaryMarkdown = async () => {
  const lines = ['# WCAG 2.2 Conformance Summary\n'];
  lines.push('| Ref ID | Title | Level | ADS | SciX | Notes |');
  lines.push('|--------|-------|-------|-----|------|-------|');

  for (const principle of wcagData) {
    for (const guideline of principle.guidelines) {
      for (const sc of guideline.success_criteria) {
        const refId = sc.ref_id;
        const title = sc.title;
        const level = sc.level || '';

        const conformanceEntries = getConformanceByRefId(refId);
        const ads = conformanceEntries.find(e => e.name === 'ads')?.conformance.status || '—';
        const scix = conformanceEntries.find(e => e.name === 'scix')?.conformance.status || '—';

        const notes = conformanceEntries.flatMap(e => e.conformance.notes || []).join('; ');

        lines.push(`| ${refId} | ${title} | ${level} | ${ads} | ${scix} | ${notes || '—'} |`);
      }
    }
  }

  return lines.join('\n') + '\n';
};
