// Checks that the data is consistent before any file is built from it.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { testCases, defects } = require('../suite-data');

const evidenceDir = path.join(__dirname, '..', '..', 'evidence');

test('test case ids are unique and sequential', () => {
  const ids = testCases.map((t) => t.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  ids.forEach((id, i) => assert.strictEqual(id, 'TC-' + String(i + 1).padStart(3, '0')));
});

test('every failed case names an existing defect, and every defect is raised by a failed case', () => {
  const defectIds = new Set(defects.map((d) => d.id));
  for (const t of testCases) {
    if (t.status === 'Fail') assert.ok(defectIds.has(t.defect), `${t.id} fails but has no valid defect`);
    else assert.ok(!t.defect, `${t.id} is not failed but names a defect`);
  }
  for (const d of defects) {
    const failed = testCases.filter((t) => t.defect === d.id);
    assert.ok(failed.length >= 1, `${d.id} is not linked to a failed case`);
    assert.strictEqual(d.cases, failed.map((t) => t.id).join(', '));
  }
});

test('a case that was run says how, and one that was not run has no result claimed', () => {
  for (const t of testCases) {
    if (t.status === 'Not run') assert.strictEqual(t.how, '-', `${t.id}`);
    else assert.notStrictEqual(t.how, '-', `${t.id} was run but has no executor`);
  }
});

test('every evidence file exists', () => {
  const files = [...testCases.map((t) => t.evidence), ...defects.map((d) => d.evidence)].filter(Boolean);
  for (const f of files) assert.ok(fs.existsSync(path.join(evidenceDir, f)), `missing evidence/${f}`);
});

test('every defect has steps, expected and actual results', () => {
  for (const d of defects) {
    assert.ok(d.steps.length >= 2 && d.expected && d.actual && d.impact, d.id);
    assert.ok(['Critical', 'Major', 'Minor', 'Cosmetic'].includes(d.severity), d.id);
  }
});
