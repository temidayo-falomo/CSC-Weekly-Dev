# Verification record

Prepared on 19 October 2026.

## Passed

- `node --test tests/model.test.cjs`: 6 tests passed, 0 failed.
- `node --check app/app.js`: syntax valid.
- `node --check app/model.js`: syntax valid.
- `python3 tools/build-deliverables.py`: both editable diagrams, SVG previews and the self-contained manual generated successfully.

## Not verified in this environment

- Browser visual layout, keyboard operation, submission/lookup/persistence UI and responsive behavior: the browser preview could not connect to the local HTTP server. Follow the manual checklist in the SRS before assessment.
- Google Apps Script execution and the actual Google Form: requires running in the student's Google account. The script is supplied as preparation, not a live Form link.
- Opening the native XML files in draw.io: perform using the included instructions.
- Remote repository upload: terminal access failed to resolve github.com; no push was performed.
- Questionnaire distribution, respondent results, lecturer email, acknowledgment and physical submission: not performed.

## Upload manually

1. Extract `CSC426-IRO-Submission.zip`.
2. Open https://github.com/temidayo-falomo/CSC-Weekly-Dev in your browser.
3. Use **Add file > Upload files**, or the empty repository's **uploading an existing file** link.
4. Upload the contents of the extracted `CSC-Weekly-Dev` folder. Keep the `weekend-3-iro` folder structure. Review any existing README before replacing it.
5. Commit the upload, then open the app and documentation paths in GitHub to verify every file arrived. GitHub source storage alone does not run the app; use the local server instructions to demonstrate it.

No upload, publication, survey response or acknowledgment is implied by the existence of these local files.
