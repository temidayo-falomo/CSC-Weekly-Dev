const test = require('node:test');
const assert = require('node:assert/strict');
const IRO = require('../app/model.js');
const input = { role: 'Student', community: 'Akungba', category: 'Water and electricity', priority: 'Normal', title: 'Broken streetlight', location: 'Sample road', description: 'A fictional streetlight is broken along the sample road.', consent: true };
const now = '2026-10-19T10:00:00Z';
test('creates a report with initial history and only permitted fields', () => {
  const r = IRO.create({ ...input, status: 'Resolved', malicious: true }, 'IRO-1', now);
  assert.equal(r.status, 'Submitted'); assert.equal(r.history.length, 1); assert.equal(r.malicious, undefined);
});
test('rejects invalid roles, missing consent and whitespace-only descriptions', () => {
  for (const patch of [{ role: 'Unknown' }, { consent: false }, { description: ' '.repeat(25) }, { priority: 'Emergency' }]) assert.throws(() => IRO.validate({ ...input, ...patch }));
});
test('accepts indigenes and people in both groups', () => {
  for (const role of ['Indigene', 'Both student and indigene']) assert.equal(IRO.validate({ ...input, role }).role, role);
});
test('preserves audit history and original report during valid transitions', () => {
  const original = IRO.create(input, 'IRO-1', now);
  const reviewed = IRO.update(original, 'Under review', 'Assigned for review.', now);
  const resolved = IRO.update(reviewed, 'Resolved', 'Fictional repair completed.', now);
  assert.equal(original.status, 'Submitted'); assert.equal(resolved.history.length, 3);
});
test('blocks skipped transitions and terminal-state changes', () => {
  const r = IRO.create(input, 'IRO-1', now);
  assert.throws(() => IRO.update(r, 'Resolved', 'Skip review', now));
  const rejected = IRO.update(r, 'Rejected', 'Duplicate demo report.', now);
  assert.throws(() => IRO.update(rejected, 'Under review', 'Reopen', now));
});
test('requires a bounded explanation for status changes', () => {
  const r = IRO.create(input, 'IRO-1', now);
  for (const note of ['', '   ', 'x'.repeat(301)]) assert.throws(() => IRO.update(r, 'Under review', note, now));
});
