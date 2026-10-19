# Object listing

This JavaScript prototype uses plain objects and DOM objects rather than an object-oriented class hierarchy.

| Object/module | Key fields or operations | Responsibility |
| --- | --- | --- |
| Report | id, role, community, category, priority, title, location, description, status, createdAt, history | Holds one issue and its current state |
| HistoryEvent | status, at, note | Records creation or one status change |
| IRO model | roles, communities, categories, transitions, validate(), create(), update() | Validates data and controls workflow |
| reports array | Report[] | In-memory snapshot of saved reports |
| localStorage | key iro.weekend3.v1; JSON string | Per-origin browser persistence |
| Reporting form | role, community, category, priority, title, location, description, consent | Collects fictional report details |
| Tracking form | reference | Requests exact local lookup |
| Staff action form | selected next status, note | Requests a validated state change |
| DOM rendering helpers | el(), detail(), renderStaff(), displayDate() | Displays safe text, lists, counts and history |
| Persistence helper | save(next) | Commits storage before replacing memory |
| Questionnaire form | Google Form items and response sheet | Future requirements elicitation, separate from app storage |

Report ownership, authenticated staff accounts and a shared database are proposed live-system objects, not implemented objects in this submission.
