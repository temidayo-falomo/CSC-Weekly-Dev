'use strict';
const KEY = 'iro.weekend3.v1';
const $ = selector => document.querySelector(selector);
let reports = [];
let storageReadable = true;
function notify(message) { $('#global-error').textContent = message; }
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
  if (!Array.isArray(saved) || saved.some(r => !r || typeof r.id !== 'string' || !IRO.transitions[r.status] || !Array.isArray(r.history))) throw new Error('Invalid saved data');
  reports = saved;
} catch { storageReadable = false; notify('Saved reports could not be read. Restore or clear this demo site storage in your browser settings and reload. No stored data has been overwritten.'); }
function save(next) {
  if (!storageReadable) { notify('Saving is blocked because existing demo storage could not be read. Restore or clear this demo site storage and reload first.'); return false; }
  try { localStorage.setItem(KEY, JSON.stringify(next)); reports = next; notify(''); return true; }
  catch { notify('Could not save. Browser storage may be disabled or full. Your change was not saved.'); return false; }
}
function el(tag, content, className) {
  const element = document.createElement(tag);
  if (content !== undefined) element.textContent = content;
  if (className) element.className = className;
  return element;
}
function displayDate(value) { return new Date(value).toLocaleString(); }
function detail(report) {
  const box = el('article', undefined, 'result');
  box.append(el('span', report.status, 'pill'), el('h3', report.title), el('p', report.id, 'reference'), el('p', `${report.community} · ${report.role} · ${report.category} · ${report.priority} priority`, 'meta'), el('p', `Location: ${report.location}`), el('p', report.description), el('h4', 'Status history'));
  const history = el('ol');
  for (const item of report.history) history.append(el('li', `${item.status} — ${displayDate(item.at)}: ${item.note}`));
  box.append(history);
  return box;
}
document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-tab]').forEach(tab => {
    const selected = tab === button;
    tab.setAttribute('aria-selected', String(selected));
    document.getElementById(tab.dataset.tab).hidden = !selected;
  });
  if (button.dataset.tab === 'staff') renderStaff();
}));
$('#report-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  data.consent = event.target.elements.consent.checked;
  try {
    const id = `IRO-${crypto.randomUUID().toUpperCase()}`;
    const report = IRO.create(data, id, new Date().toISOString());
    if (!save([...reports, report])) return;
    const result = $('#report-result');
    result.replaceChildren(el('h3', 'Report saved in this browser'), el('p', 'Keep this reference to track progress. This is not a submission to an authority.'), el('p', id, 'reference'));
    event.target.reset();
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) { notify(error.message); }
});
$('#track-form').addEventListener('submit', event => {
  event.preventDefault();
  const reference = event.target.elements.reference.value.trim().toUpperCase();
  const report = reports.find(item => item.id === reference);
  $('#track-result').replaceChildren(report ? detail(report) : el('p', 'No matching report in this browser. Check the reference and use the device/browser where you created it.', 'empty'));
});
function renderStaff() {
  const stats = $('#stats'); stats.replaceChildren();
  for (const status of Object.keys(IRO.transitions)) {
    const box = el('div', undefined, 'stat');
    box.append(el('strong', String(reports.filter(r => r.status === status).length)), el('span', status)); stats.append(box);
  }
  const list = $('#report-list'); list.replaceChildren();
  const filter = $('#status-filter').value;
  const visible = reports.filter(r => filter === 'All' || r.status === filter).slice().reverse();
  if (!visible.length) list.append(el('p', 'No reports to display. Submit a fictional issue or add the sample reports.', 'empty'));
  for (const report of visible) {
    const card = detail(report); card.className = 'report-card';
    const allowed = IRO.transitions[report.status];
    if (allowed.length) {
      const form = el('form', undefined, 'staff-action');
      const statusLabel = el('label', 'Next status'); const select = el('select');
      for (const status of allowed) { const option = el('option', status); option.value = status; select.append(option); }
      statusLabel.append(select);
      const noteLabel = el('label', 'Update note'); const input = el('input'); input.required = true; input.maxLength = 300; input.placeholder = 'Explain this decision'; noteLabel.append(input);
      const button = el('button', 'Save update'); button.type = 'submit';
      form.append(statusLabel, noteLabel, button);
      form.addEventListener('submit', event => {
        event.preventDefault();
        try {
          const updated = IRO.update(report, select.value, input.value, new Date().toISOString());
          if (save(reports.map(r => r.id === report.id ? updated : r))) renderStaff();
        } catch (error) { notify(error.message); }
      }); card.append(form);
    }
    list.append(card);
  }
}
$('#status-filter').addEventListener('change', renderStaff);
$('#load-demo').addEventListener('click', () => {
  const samples = [
    { id: 'IRO-DEMO-001', role: 'Student', community: 'Akungba', category: 'Water and electricity', priority: 'Normal', title: 'Fictional broken streetlight', location: 'Sample hostel junction', description: 'A fictional streetlight has stopped working near the sample hostel junction.' },
    { id: 'IRO-DEMO-002', role: 'Indigene', community: 'Iwaro', category: 'Sanitation and environment', priority: 'High', title: 'Fictional blocked drainage', location: 'Sample market road', description: 'A fictional blocked drain is causing water to collect along the sample market road.' }
  ];
  const missing = samples.filter(sample => !reports.some(r => r.id === sample.id)).map(sample => IRO.create({ ...sample, consent: true }, sample.id, new Date().toISOString()));
  if (save([...reports, ...missing])) renderStaff();
});
