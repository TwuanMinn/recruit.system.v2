import type { Candidate } from './types';
import { escapeHtml } from './utils/escapeHtml';

function formatSalary(v: string | number): string {
  return v ? Number(v).toLocaleString('en-US') : '';
}

export function exportCandidatePDF(c: Candidate): void {
  const iv = c.interview || ({} as Record<string, string>);
  const sal = iv.salaryExpectation
    ? `$${formatSalary(iv.salaryExpectation)}${iv.salaryType === 'monthly' ? ' /month' : ' /year'}`
    : 'Not provided';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${escapeHtml(c.name)} - Report</title>
<style>
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1f2937;background:#fff}
.header{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:36px 40px 28px}
.header h1{font-size:28px}.header .sub{opacity:.85;font-size:14px}
.badge{display:inline-block;padding:3px 14px;border-radius:999px;font-size:12px;font-weight:700;margin-left:10px}
.badge-level{background:rgba(255,255,255,.25);color:#fff}
.content{padding:32px 40px}
.section{margin-bottom:28px}
.section-title{font-size:16px;font-weight:700;color:#6366f1;margin-bottom:14px;padding-bottom:6px;border-bottom:2px solid #e5e7eb}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 24px}
.field{margin-bottom:10px}
.field-label{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#6b7280;font-weight:600;margin-bottom:2px}
.field-value{font-size:14px;color:#111827}
.card{background:#f9fafb;border-radius:10px;padding:16px;margin-bottom:10px}
.card-label{font-size:12px;color:#6b7280;margin-bottom:4px;font-weight:600}
.card-value{font-size:14px;color:#374151;white-space:pre-wrap}
.note-box{background:#fffbeb;border-left:4px solid #f59e0b;border-radius:8px;padding:16px}
.salary-box{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:16px;text-align:center}
.salary-amount{font-size:26px;font-weight:800;color:#059669}
.salary-type{font-size:13px;color:#6b7280}
.footer{text-align:center;padding:20px 40px;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;margin-top:12px}
a{color:#6366f1}
</style></head><body>
<div class="header">
  <h1>${escapeHtml(c.name)} <span class="badge badge-level">${escapeHtml(c.level)}</span></h1>
  <div class="sub">Interview Report • ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
</div>
<div class="content">
  <div class="section">
    <div class="section-title">Contact</div>
    <div class="grid">
      <div class="field"><div class="field-label">Phone</div><div class="field-value">${escapeHtml(c.phone)}</div></div>
      <div class="field"><div class="field-label">Email</div><div class="field-value">${escapeHtml(c.gmail)}</div></div>
      <div class="field"><div class="field-label">Gender</div><div class="field-value">${escapeHtml(c.gender || 'N/A')}</div></div>
      <div class="field"><div class="field-label">Interview Status</div><div class="field-value">${escapeHtml(c.interviewStatus || 'No Response')}</div></div>
      <div class="field"><div class="field-label">CV</div><div class="field-value">${escapeHtml(c.linkCV || 'N/A')}</div></div>
    </div>
  </div>
  ${iv.interviewDate ? `
  <div class="section">
    <div class="section-title">Assessment</div>
    <div class="grid">
      <div class="field"><div class="field-label">Date</div><div class="field-value">${escapeHtml(String(iv.interviewDate))}</div></div>
      <div class="field"><div class="field-label">Experience</div><div class="field-value">${escapeHtml(String(iv.yearsExp || 'N/A'))} years</div></div>
      <div class="field"><div class="field-label">Result</div><div class="field-value">${escapeHtml(String(iv.result || 'Pending'))}</div></div>
    </div>
    <div class="salary-box" style="margin:16px 0">
      <div class="salary-type">Salary Expectation</div>
      <div class="salary-amount">${escapeHtml(sal)}</div>
    </div>
    <div class="grid">
      ${iv.strength ? `<div class="card"><div class="card-label">Strengths</div><div class="card-value">${escapeHtml(String(iv.strength))}</div></div>` : ''}
      ${iv.weakness ? `<div class="card"><div class="card-label">Weaknesses</div><div class="card-value">${escapeHtml(String(iv.weakness))}</div></div>` : ''}
      ${iv.background ? `<div class="card"><div class="card-label">Background</div><div class="card-value">${escapeHtml(String(iv.background))}</div></div>` : ''}
      ${iv.skill ? `<div class="card"><div class="card-label">Skills</div><div class="card-value">${escapeHtml(String(iv.skill))}</div></div>` : ''}
    </div>
    ${iv.note ? `<div class="note-box" style="margin-top:12px"><div class="card-label">Notes</div><div class="card-value">${escapeHtml(String(iv.note))}</div></div>` : ''}
  </div>` : ''}
</div>
<div class="footer">Recruitment System • Confidential</div>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, '_blank');
  if (w) w.onload = () => setTimeout(() => w.print(), 400);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function exportAllPDF(candidates: Candidate[]): void {
  const rows = candidates
    .map((c) => {
      const iv = c.interview;
      const sal = iv?.salaryExpectation
        ? `$${formatSalary(iv.salaryExpectation)}${iv.salaryType === 'monthly' ? '/mo' : '/yr'}`
        : '-';
      return `<tr>
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.gender || '-')}</td>
        <td>${escapeHtml(c.level)}</td>
        <td>${escapeHtml(c.phone)}</td>
        <td>${escapeHtml(c.gmail)}</td>
        <td>${escapeHtml(c.interviewStatus || 'N/A')}</td>
        <td>${escapeHtml(String(iv?.yearsExp || '-'))}</td>
        <td>${escapeHtml(sal)}</td>
        <td>${escapeHtml(String(iv?.result || 'Pending'))}</td>
      </tr>`;
    })
    .join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>All Candidates</title>
<style>
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{size:landscape;margin:12mm}}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1f2937;background:#fff}
.header{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:28px 36px 20px}
.header h1{font-size:24px}.header .sub{opacity:.85;font-size:13px;margin-top:4px}
.content{padding:24px 36px}
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:#6366f1;color:#fff;padding:10px 8px;text-align:left;font-weight:700;font-size:11px;text-transform:uppercase}
td{padding:9px 8px;border-bottom:1px solid #e5e7eb}
tr:nth-child(even){background:#f9fafb}
.footer{text-align:center;padding:16px;color:#9ca3af;font-size:11px;border-top:1px solid #e5e7eb;margin-top:16px}
</style></head><body>
<div class="header">
  <h1>All Candidates Report</h1>
  <div class="sub">Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • ${candidates.length} candidates</div>
</div>
<div class="content">
  <table>
    <thead><tr><th>Name</th><th>Gender</th><th>Level</th><th>Phone</th><th>Email</th><th>Status</th><th>Exp</th><th>Salary</th><th>Result</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>
<div class="footer">Recruitment System • Confidential</div>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, '_blank');
  if (w) w.onload = () => setTimeout(() => w.print(), 400);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
