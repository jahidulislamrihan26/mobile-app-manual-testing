// Builds every generated file from suite-data.js:  npm run build
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { testCases, defects } = require('./suite-data');

const root = path.join(__dirname, '..');
const out = (...p) => path.join(root, ...p);
fs.mkdirSync(out('test-suite'), { recursive: true });
fs.mkdirSync(out('defects'), { recursive: true });

const csvCell = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
const csv = (header, rows) => [header.map(csvCell).join(','), ...rows.map((r) => r.map(csvCell).join(','))].join('\n') + '\n';

const count = (arr, f) => arr.filter(f).length;
const stats = {
  total: testCases.length,
  executed: count(testCases, (t) => t.status !== 'Not run'),
  pass: count(testCases, (t) => t.status === 'Pass'),
  fail: count(testCases, (t) => t.status === 'Fail'),
  notRun: count(testCases, (t) => t.status === 'Not run'),
  smoke: count(testCases, (t) => t.smoke),
  smokePass: count(testCases, (t) => t.smoke && t.status === 'Pass'),
  defects: defects.length,
  bySeverity: Object.fromEntries(['Critical', 'Major', 'Minor', 'Cosmetic'].map((s) => [s, count(defects, (d) => d.severity === s)])),
};

// ---- test cases CSV
const tcHeader = ['ID', 'Module', 'Title', 'Type', 'Priority', 'Suite', 'Steps', 'Expected result', 'Actual result', 'Status', 'Defect', 'Executed by', 'Evidence'];
const how = { maestro: 'Maestro flow (Android emulator)', exploration: 'Exploratory session scenario (Android emulator)', '-': '' };
const tcRows = testCases.map((t) => [t.id, t.module, t.title, t.type, t.priority, t.smoke ? 'Smoke + Regression' : 'Regression', t.steps, t.expected, t.actual, t.status, t.defect || '', how[t.how], t.evidence ? 'evidence/' + t.evidence : '']);
fs.writeFileSync(out('test-suite', 'test-cases.csv'), csv(tcHeader, tcRows));

// ---- defect pages and logs
const link = (f) => `![${f}](../evidence/${f})`;
for (const d of defects) {
  const md = `# ${d.id}: ${d.title}

| Field | Value |
|---|---|
| Severity | ${d.severity} |
| Priority | ${d.priority} |
| Module | ${d.module} |
| Status | Open |
| Found in | My Demo App 1.3.0 (build 244), Android 11 emulator (API 30, Pixel 6 profile, 1080 x 2400) |
| Failed test case | ${d.cases} |

## Steps to reproduce
${d.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Expected result
${d.expected}

## Actual result
${d.actual}

## Evidence
${link(d.evidence)}

> Impact if real: ${d.impact}
>
> The app is a public demo, so this is reported as it would be on a real product; the demo has no real customers or payments.
`;
  fs.writeFileSync(out('defects', d.id + '.md'), md);
}
fs.writeFileSync(out('defects', 'defect-log.csv'), csv(['ID', 'Title', 'Severity', 'Priority', 'Module', 'Status', 'Test case', 'Evidence'], defects.map((d) => [d.id, d.title, d.severity, d.priority, d.module, 'Open', d.cases, 'evidence/' + d.evidence])));

const jiraPriority = { Critical: 'Highest', Major: 'High', Minor: 'Medium', Cosmetic: 'Low' };
fs.writeFileSync(out('defects', 'jira-import.csv'), csv(['Summary', 'Issue Type', 'Priority', 'Labels', 'Component', 'Environment', 'Description'],
  defects.map((d) => [
    `${d.id}: ${d.title}`, 'Bug', jiraPriority[d.severity], `${d.severity.toLowerCase()}-severity mobile android`, d.module,
    'My Demo App 1.3.0 build 244, Android 11 emulator (API 30)',
    `*Severity:* ${d.severity}\n*Steps to reproduce*\n${d.steps.map((s, i) => `# ${s}`).join('\n')}\n*Expected*\n${d.expected}\n*Actual*\n${d.actual}\n*Test case:* ${d.cases}\n*Evidence:* evidence/${d.evidence}`,
  ])));

// ---- Excel workbook
(async () => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Md. Jahidul Islam Rihan';
  const style = (ws, widths) => {
    ws.columns = widths.map((w, i) => ({ width: w, key: String(i) }));
    const head = ws.getRow(1);
    head.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F3A5F' } };
    ws.views = [{ state: 'frozen', ySplit: 1 }];
    ws.eachRow((row) => row.eachCell((c) => { c.alignment = { vertical: 'top', wrapText: true }; }));
  };

  const sum = wb.addWorksheet('Summary');
  sum.addRows([
    ['Mobile app test summary', ''],
    ['App', 'My Demo App 1.3.0 (build 244), Android'],
    ['Environment', 'Android 11 emulator (API 30), Pixel 6 profile'],
    ['Test cases', stats.total],
    ['Executed', stats.executed],
    ['Passed', stats.pass],
    ['Failed', stats.fail],
    ['Not run', stats.notRun],
    ['Smoke cases passed', `${stats.smokePass} of ${stats.smoke}`],
    ['Defects', stats.defects],
    ['  Critical', stats.bySeverity.Critical], ['  Major', stats.bySeverity.Major], ['  Minor', stats.bySeverity.Minor], ['  Cosmetic', stats.bySeverity.Cosmetic],
  ]);
  sum.getColumn(1).width = 28; sum.getColumn(2).width = 50;
  sum.getRow(1).font = { bold: true, size: 14 };

  const tcs = wb.addWorksheet('Test Cases');
  tcs.addRow(tcHeader);
  tcRows.forEach((r) => tcs.addRow(r));
  style(tcs, [9, 14, 42, 13, 10, 18, 44, 44, 44, 10, 10, 26, 30]);
  tcs.autoFilter = { from: 'A1', to: 'M1' };
  tcs.eachRow((row, n) => {
    if (n === 1) return;
    const st = row.getCell(10);
    const color = { Pass: 'FFC6EFCE', Fail: 'FFFFC7CE', 'Not run': 'FFFFEB9C' }[st.value];
    if (color) st.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
  });

  const bugs = wb.addWorksheet('Defects');
  bugs.addRow(['ID', 'Title', 'Severity', 'Priority', 'Module', 'Status', 'Test case', 'Steps', 'Expected', 'Actual', 'Evidence']);
  defects.forEach((d) => bugs.addRow([d.id, d.title, d.severity, d.priority, d.module, 'Open', d.cases, d.steps.map((s, i) => `${i + 1}. ${s}`).join('\n'), d.expected, d.actual, 'evidence/' + d.evidence]));
  style(bugs, [9, 44, 10, 10, 12, 8, 10, 50, 40, 50, 36]);

  await wb.xlsx.writeFile(out('test-suite', 'Mobile-Test-Suite.xlsx'));
  fs.writeFileSync(out('test-suite', 'stats.json'), JSON.stringify(stats, null, 2) + '\n');
  console.log(JSON.stringify(stats));
})();
