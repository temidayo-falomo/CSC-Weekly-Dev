# IRO - Issues Reporting Outlet

**Temidayo Ayomide Falomo | 220404260 | CSC426 Weekend 3**

## Run the application

No packages, build process or external services are required. Use a local HTTP server so the browser has a stable storage origin:

```bash
cd weekend-3-iro
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000/app/ in a modern browser. Always use that same address and browser to retrieve saved reports. Directly opening the HTML file is not recommended because browser storage behavior for file URLs varies.

Run the model tests with Node.js:

```bash
node --test tests/model.test.cjs
```

## Demonstration

1. Read the academic prototype notice and enter fictional information only.
2. Submit a report as a student, indigene, or both. Copy the report reference.
3. Look it up in **Track a report**.
4. Open **Staff demo**. Move it from Submitted to Under review, with a note.
5. Resolve or reject the report with another note; track it again to see its history.
6. Reload the page to confirm persistence. Use the sample-data button for two explicitly fictional examples. Repeated clicks do not duplicate them.

## What is implemented

- Responsive reporting form distinguishing students and indigenes.
- Community, category, priority, location, and description fields.
- Fictional-data consent, validation and unique report references.
- Reference lookup, local persistence, staff workflow preview, status filtering and counts.
- Status-change notes and history; safe text rendering of user input.
- No third-party scripts, tracking, reporter names or contact fields.

## Scope and limitations

This is a **single-browser academic prototype**, not an operational reporting service. Browser localStorage is not encrypted, server-backed or access-controlled. Reference lookup is not authentication. The staff page is deliberately labelled as an unrestricted demonstration. Clearing browser site data deletes reports. Reports do not reach AAUA or community authorities, and no notifications or emergency dispatch occur. Do not use real complaints or personal information.

A live service would require authenticated staff, server-side validation and authorization, a secure database, retention/deletion rules, moderation procedures, verified escalation contacts and privacy review. The SRS separates the implemented prototype from those proposed production requirements.

## Deliverables

| Brief | Location | Status |
| --- | --- | --- |
| Google Form questionnaire | `questionnaire/questionnaire.md`, `questionnaire/create-google-form.gs` | Prepared; must run in user's Google account and distribute |
| Ishikawa analysis using draw.io | `diagrams/ishikawa.drawio`, `docs/ishikawa.md` | Editable diagram and written hypotheses |
| Mini web interface | `app/` | Implemented locally |
| Use-case diagram | `diagrams/use-case.drawio`, `docs/use-cases.md` | Editable diagram and scenarios |
| SRS | `docs/SRS.md` | Prepared |
| Object listing | `docs/object-listing.md` | Prepared |
| Code listing and 10pt print manual | `docs/print-manual.html` | Generated from current sources |
| Repository upload | https://github.com/temidayo-falomo/CSC-Weekly-Dev | Must verify successful push |
| Email to lecturer | `docs/submission-checklist.md` | Not sent |

Open each `.drawio` file in the diagrams.net / draw.io editor using **File > Open from > Device**. They are uncompressed native draw.io XML, not screenshots. Both diagrams also appear in the print manual.

## Printing and submission

Open `docs/print-manual.html` in a browser. Print at **100% scale** on A4; turn off browser headers/footers. Body text, object listing and code listing are set to **10pt**. The manual includes the SRS, diagrams, object listing and complete executable source code. Review the preview before printing; diagrams use dedicated landscape-style wide layouts within the page width.

Follow `docs/submission-checklist.md`. The brief lists **Friday 10 July 2026** as its deadline; this has passed as of preparation on 19 October 2026. Confirm late-submission instructions. The brief asks you to print the material **after the lecturer acknowledges your email**.

No questionnaire responses have been collected, no findings are claimed, and no lecturer acknowledgment has been received as part of this package.
