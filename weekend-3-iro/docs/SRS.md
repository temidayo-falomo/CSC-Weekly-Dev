# Software Requirements Specification

## 1. Identification

**System:** IRO - Issues Reporting Outlet  
**Author:** Temidayo Ayomide Falomo  
**Matric number:** 220404260  
**Course:** CSC426, Weekend 3  
**Document version:** 1.0  
**Prepared:** 19 October 2026

## 2. Purpose and scope

IRO demonstrates how AAUA students and indigenes can report issues affecting their shared communities and follow their progress. It covers Akungba, Iwaro, Etioro, Ayegunle and other neighbouring communities. Examples include infrastructure, sanitation, housing, transport, safety and student-community relations.

The deliverable is a deliberately small browser application. The implemented scope is report capture, local persistence, reference lookup, a staff workflow demonstration, filtering and status history. It excludes live authority routing, emergency dispatch, private messaging, attachments, user accounts, email and a shared server database.

The staff workflow is a simulation. It must not be described as secure administration. The interface prominently instructs users to enter fictional data because all records are stored on the same device without authentication.

## 3. Stakeholders and elicitation

- Students: raise concerns affecting study, housing, travel and welfare.
- Indigenes: raise concerns affecting residents and their relationship with students.
- People belonging to both groups: must be able to identify both roles.
- Proposed authorized issue officers: review and act on reports in a future live system.
- Course assessor: reviews application behavior and supporting documentation.

The prepared questionnaire distinguishes these groups, asks about current reporting channels and barriers, and gathers preferences. No survey distribution, responses or empirical conclusions are claimed. The Ishikawa causes are hypotheses to validate using questionnaire responses and stakeholder interviews.

## 4. Operating environment and assumptions

A modern browser with JavaScript, Web Crypto randomUUID and localStorage, served from localhost or HTTPS. A simple Python HTTP server is sufficient for the demonstration. No installation of application dependencies is necessary. Node.js runs the supplied model tests. Browser storage must be enabled and users must reuse the same browser and origin. Browser records can be removed through the browser's site-data controls.

The prototype is intended for a single user/device at a time. Simultaneous tabs are not synchronized and may overwrite each other's latest changes. No assumption is made that the project has authority to receive real reports on behalf of AAUA or host communities.

## 5. System components and interaction

1. Reporting interface (`index.html` and `styles.css`): captures role, affected community, issue details and demo consent.
2. Domain model (`model.js`): validates enumerations and trimmed text, constructs reports, and enforces status transitions.
3. Interaction controller (`app.js`): connects forms to the model, persists records, switches views and renders results.
4. Browser storage: holds a JSON array under `iro.weekend3.v1` for the current browser origin.
5. Tracking view: retrieves a report from memory by its exact reference and displays status history.
6. Staff demonstration view: lists and filters local reports, shows status counts and requests validated status changes with notes.

Report flow: user input -> browser form checks -> model validation -> new report and initial history -> storage write -> confirmation. The in-memory state changes only after a successful storage write. Tracking uses the same stored records after page reload. A staff action passes through transition validation before the replacement record is saved.

## 6. Functional requirements: implemented prototype

- **FR-01 Role capture:** The form shall accept Student, Indigene, or Both student and indigene. Verify by selecting and submitting each role.
- **FR-02 Community capture:** The form shall accept Akungba, Iwaro, Etioro, Ayegunle, or Other neighbouring community.
- **FR-03 Issue capture:** The form shall collect category, Normal/High priority, title, general location and description. It shall not request the reporter's name, matric number or contact information.
- **FR-04 Validation:** The system shall require a valid role, community, category and priority, a trimmed 5-100 character title, 3-150 character location, 20-2000 character description and explicit fictional-data consent. Invalid values shall not be stored.
- **FR-05 Creation:** A valid submission shall receive an IRO-prefixed random UUID reference, Submitted status, an ISO timestamp and its first history event.
- **FR-06 Persistence:** Reports shall be serialized to localStorage. If a write fails, the system shall show an error and retain the previous in-memory state.
- **FR-07 Tracking:** A user shall retrieve a local report by reference, ignoring surrounding whitespace and letter case. Unknown references shall produce a clear no-match message.
- **FR-08 Staff overview:** The demonstration view shall list all local reports, filter by status and display counts for all four statuses.
- **FR-09 Status control:** Permitted transitions shall be Submitted -> Under review or Rejected; Under review -> Resolved or Rejected. Resolved and Rejected shall be terminal in this prototype.
- **FR-10 History:** Every status change shall require a trimmed 1-300 character note and append a timestamped history event without modifying prior events.
- **FR-11 Sample data:** The user shall be able to add two explicitly fictional sample reports, representing a student and an indigene, without duplicate sample IDs.
- **FR-12 Notices:** Each user shall be informed that the application is a local demo, staff access is unrestricted, reports are not sent to authorities and real sensitive information must not be entered.

## 7. Non-functional requirements: prototype acceptance targets

- **NFR-01 Usability:** The three views shall have clear labels and show feedback after submission, lookup or storage failure.
- **NFR-02 Responsive layout:** At 375px and 1280px viewport widths, the form shall fit the viewport and remain usable without horizontal scrolling.
- **NFR-03 Accessibility:** Form controls shall have visible labels, the interface shall be keyboard operable, focus indicators shall be visible and feedback shall use live/status or alert regions. These are acceptance targets, not a claim of certified WCAG conformance.
- **NFR-04 Input rendering:** Reporter-controlled content shall be inserted as text nodes, never interpreted as HTML.
- **NFR-05 Data minimization:** The application shall request no direct reporter identifiers and shall make no network requests to submit reports. Free text can still contain personal information, hence the fictional-data warning.
- **NFR-06 Reliability:** Invalid state changes shall be rejected. Storage errors shall be visible. Persistence is limited to the browser profile and is not a backup guarantee.
- **NFR-07 Performance:** For an illustrative dataset of up to 100 local reports, submission, tracking and filtering should complete within one second on the demonstration device; this target must be measured before being claimed as achieved.
- **NFR-08 Maintainability:** Markup, styling, UI logic and domain validation shall remain in separate files; core domain rules shall have executable regression tests.
- **NFR-09 Portability:** The prototype shall use standard HTML, CSS and JavaScript without external packages or services. It requires a modern browser and a secure context for randomUUID.

## 8. Data dictionary

**Report:** id (unique string), role (enumeration), community (enumeration), category (enumeration), priority (Normal/High), title (5-100 characters), location (3-150 characters), description (20-2000 characters), status (Submitted/Under review/Resolved/Rejected), createdAt (ISO timestamp), history (ordered list of HistoryEvent objects).

**HistoryEvent:** status (status enumeration), at (ISO timestamp), note (text). The initial note is system-generated; later notes are required and limited to 300 characters.

**Consent:** required transient boolean checked before creation; not stored as a reporter identifier or a legal consent record.

**Storage:** JSON array in localStorage, key `iro.weekend3.v1`. No passwords, files, phone numbers or names are intentionally collected. IDs are lookup references, not access-control credentials.

## 9. Use cases and exception handling

**UC-01 Submit issue:** Reporter completes the form and consent; system validates, saves and returns a reference. Invalid input leaves the form for correction. Failed storage displays an error without claiming success.

**UC-02 Track issue:** Reporter supplies a reference; system displays the matching record and history. Unknown references show a no-match message explaining device/browser dependence.

**UC-03 Review queue:** Staff-demo user opens the overview and optionally filters by status. Empty results show guidance.

**UC-04 Update status:** Staff-demo user selects an allowed transition and supplies a note. System saves the new state and appends history. Disallowed transitions or missing notes produce errors.

**UC-05 Add sample records:** Demonstrator loads the two fictional examples. Existing sample references are not added again.

The use-case diagram depicts prototype actors and actions. In this version a staff-demo user is any person using the browser; production authorization is not implemented.

## 10. Proposed live-system requirements - not implemented

- Authenticated, individually identifiable staff with server-enforced roles and authorization on every report and status update.
- A protected server database, TLS transport, server-side validation, controlled access to sensitive records, backups and audit events resistant to browser tampering.
- A documented lawful basis, privacy notice, retention and deletion schedule, complaint-handling policy and responsible operator.
- Verified escalation and moderation procedures; clear boundaries between general complaints, allegations and emergencies.
- Secure reporter access and recovery, without exposing private reports through a public reference alone.
- Approved authority assignments, cross-device tracking and notifications if stakeholders request them.

These requirements require further elicitation and operational agreement before live deployment. The prototype does not satisfy them.

## 11. Verification and acceptance

Automated domain tests cover initial state, identifier-field isolation, supported roles, invalid input, consent, valid transitions, audit history, terminal states and note bounds. Run `node --test tests/model.test.cjs` from the project directory.

Manual checks to record before assessment: submit all three roles; inspect the confirmation; track a known and unknown reference; reload and track again; filter the staff list; reject and resolve reports through permitted paths; test sample deduplication; enter HTML-like text and confirm it renders literally; test keyboard navigation, a 375px layout and a 1280px layout; disable storage and verify clear failure feedback. Do not mark these manual checks as passed until actually performed.

Acceptance requires the mini app to demonstrate the documented flow, editable diagrams to open in draw.io, the questionnaire to be created in Google Forms, and all required files to be present in the GitHub repository. Questionnaire distribution, survey findings, a successful remote push and lecturer acknowledgment are separate external completion steps.
