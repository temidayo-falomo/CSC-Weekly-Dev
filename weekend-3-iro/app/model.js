/* Shared validation and state rules. Browser demo; no authentication or server. */
(function (root) {
  'use strict';
  const roles = ['Student', 'Indigene', 'Both student and indigene'];
  const communities = ['Akungba', 'Iwaro', 'Etioro', 'Ayegunle', 'Other neighbouring community'];
  const categories = ['Safety and security', 'Housing and accommodation', 'Water and electricity', 'Sanitation and environment', 'Transport and roads', 'Student-community relations', 'Other'];
  const transitions = { Submitted: ['Under review', 'Rejected'], 'Under review': ['Resolved', 'Rejected'], Resolved: [], Rejected: [] };
  function validate(data) {
    if (!roles.includes(data.role)) throw new Error('Select a valid community role.');
    if (!communities.includes(data.community)) throw new Error('Select a valid community.');
    if (!categories.includes(data.category)) throw new Error('Select a valid issue category.');
    if (!['Normal', 'High'].includes(data.priority)) throw new Error('Select a valid priority.');
    for (const [field, min, max] of [['title', 5, 100], ['location', 3, 150], ['description', 20, 2000]]) {
      if (typeof data[field] !== 'string' || data[field].trim().length < min || data[field].trim().length > max) throw new Error(`${field} must contain ${min}-${max} characters.`);
    }
    if (data.consent !== true) throw new Error('Confirm the fictional-data notice.');
    return Object.fromEntries(['role', 'community', 'category', 'priority', 'title', 'location', 'description'].map(key => [key, data[key].trim()]));
  }
  function create(data, id, now) {
    return { ...validate(data), id, status: 'Submitted', createdAt: now, history: [{ status: 'Submitted', at: now, note: 'Report created.' }] };
  }
  function update(report, status, note, now) {
    if (!transitions[report.status]?.includes(status)) throw new Error('That status change is not permitted.');
    if (typeof note !== 'string' || !note.trim() || note.trim().length > 300) throw new Error('Add an update note of 1-300 characters.');
    return { ...report, status, history: [...report.history, { status, at: now, note: note.trim() }] };
  }
  const api = { roles, communities, categories, transitions, validate, create, update };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.IRO = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
