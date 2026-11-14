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
  const files = [...testCases.map((t) => t.evidence), ...defects.flatMap((d) => [d.evidence, ...(d.extra || [])])].filter(Boolean);
  for (const f of files) assert.ok(fs.existsSync(path.join(evidenceDir, f)), `missing evidence/${f}`);
});

test('every case traces to a requirement and every requirement has at least one case', () => {
  const { requirements } = require('../suite-data');
  const reqIds = new Set(requirements.map((r) => r.id));
  for (const t of testCases) assert.ok(reqIds.has(t.req), `${t.id} has no valid requirement`);
  for (const r of requirements) assert.ok(testCases.some((t) => t.req === r.id), `${r.id} has no test case`);
});

test('every automated-by reference points at a test id that exists in the automation repositories', () => {
  const sources = {
    Maestro: ['mobile-e2e-maestro/flows'],
    Appium: ['appium-android-pytest/tests'],
  };
  const text = {};
  for (const [tool, dirs] of Object.entries(sources)) {
    const base = path.join(__dirname, '..', '..', '..');
    text[tool] = '';
    for (const d of dirs) {
      const full = path.join(base, d);
      if (!fs.existsSync(full)) return; // the sibling repository is not checked out here, so this check cannot run
      for (const f of fs.readdirSync(full)) text[tool] += f.toLowerCase() + '\n' + fs.readFileSync(path.join(full, f), 'utf8').toLowerCase();
    }
  }
  for (const t of testCases) {
    for (const ref of t.auto.split(';').map((s) => s.trim()).filter(Boolean)) {
      const [, tool, id] = ref.match(/^(Maestro|Appium) (TC-\d+)/);
      const needle = tool === 'Maestro' ? id.toLowerCase() : 'test_' + id.toLowerCase().replace('-', '');
      assert.ok(text[tool].includes(needle), `${t.id}: ${ref} not found in the ${tool} repository`);
    }
  }
});

test('every defect has steps, expected and actual results', () => {
  for (const d of defects) {
    assert.ok(d.steps.length >= 2 && d.expected && d.actual && d.impact, d.id);
    assert.ok(['Critical', 'Major', 'Minor', 'Cosmetic'].includes(d.severity), d.id);
  }
});
