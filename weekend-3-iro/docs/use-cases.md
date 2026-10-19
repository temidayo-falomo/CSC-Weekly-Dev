# Use cases

**System boundary:** IRO browser prototype.  
**Actors:** Reporter (student, indigene, or both); staff-demo user (unrestricted local demonstration).

| ID | Actor | Goal | Main result |
| --- | --- | --- | --- |
| UC-01 | Reporter | Submit a fictional issue | Stored report and reference |
| UC-02 | Reporter | Track a report | Details, current status and history |
| UC-03 | Staff-demo user | View/filter local reports | Matching report queue and counts |
| UC-04 | Staff-demo user | Update report status with a note | Valid transition and appended history |
| UC-05 | Staff-demo user | Add fictional sample records | Two demo issues, without duplicates |

UC-01 includes validation and reference generation. UC-04 includes transition validation and history recording. Both invoke persistence only after validation; failed writes do not update in-memory state. The included actions are mandatory substeps, not separate actors.

Preconditions: page loaded, JavaScript available, browser storage available for mutation, fictional data only. UC-02 requires a report saved in the same browser/origin. UC-04 requires a report in a nonterminal status.

The editable UML-style use-case diagram is `../diagrams/use-case.drawio`. No login use case is depicted because authentication is outside the implemented prototype.
