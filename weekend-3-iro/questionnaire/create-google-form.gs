/** Run in Google Apps Script. Creates a Form and linked Sheet; does not distribute. */
function createIroQuestionnaire() {
  const properties = PropertiesService.getScriptProperties();
  const existingId = properties.getProperty('IRO_FORM_ID');
  if (existingId) {
    const existing = FormApp.openById(existingId);
    console.log('Existing edit URL: ' + existing.getEditUrl());
    console.log('Respondent URL: ' + existing.getPublishedUrl());
    console.log('Linked spreadsheet ID: ' + existing.getDestinationId());
    return;
  }
  const form = FormApp.create('IRO: AAUA Students and Host-Community Reporting Needs');
  // Store early to avoid duplicate forms if a later call fails. Inspect incomplete
  // forms before clearing this property and retrying a failed first run.
  properties.setProperty('IRO_FORM_ID', form.getId());
  form.setDescription('Temidayo Ayomide Falomo | 220404260 | CSC426. Voluntary academic survey (3-5 minutes). Do not provide names, matric numbers, phone numbers, private addresses, accusations or sensitive incident details. You may exit without submitting. Responses are stored in the researcher\'s Google account for academic review. Agree and disclose a retention period before distributing. This is not a complaints or emergency service.');
  form.setCollectEmail(false);
  form.setConfirmationMessage('Thank you. This survey records preferences, not an official issue report.');
  const consent = form.addMultipleChoiceItem().setTitle('Do you voluntarily agree to participate?').setRequired(true);
  const questions = form.addPageBreakItem().setTitle('Your community and reporting needs');
  consent.setChoices([
    consent.createChoice('Yes, continue', questions),
    consent.createChoice('No, end questionnaire', FormApp.PageNavigationType.SUBMIT)
  ]);
  function mc(title, values) { form.addMultipleChoiceItem().setTitle(title).setChoiceValues(values).setRequired(true); }
  function checks(title, values, required) { form.addCheckboxItem().setTitle(title).setChoiceValues(values).setRequired(required); }
  mc('Which best describes your relationship to the community?', ['AAUA student', 'Indigene', 'Both AAUA student and indigene', 'Neither']);
  mc('Which community do your answers mainly relate to?', ['Akungba', 'Iwaro', 'Etioro', 'Ayegunle', 'Other neighbouring community']);
  mc('In the past 6 months, how often have you noticed an issue needing attention?', ['Never', 'Once', 'A few times', 'Frequently', 'Prefer not to say']);
  checks('Which kinds of issues most need a reporting channel?', ['Safety/security', 'Housing', 'Water/electricity', 'Sanitation/environment', 'Transport/roads', 'Student-community relations', 'Other', 'None or unsure (choose alone)'], true);
  mc('Where would you currently report a non-emergency community issue first?', ['University office', 'Student representative', 'Community leader', 'Social media or messaging group', 'Friends or family', 'I do not know', 'Other']);
  mc('How satisfied are you with current reporting arrangements?', ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied', 'Never used them']);
  checks('What could stop you from reporting?', ['Unclear contact', 'Fear of exposure or retaliation', 'No feedback', 'Difficult process', 'Data or internet cost', 'Language or literacy', 'Nothing (choose alone)', 'Other'], false);
  mc('What device would you usually use?', ['Smartphone', 'Computer', 'Shared or borrowed device', 'No regular access']);
  mc('How reliable is your internet access?', ['Reliable', 'Sometimes unreliable', 'Mostly unavailable']);
  checks('Which features would help you most?', ['Simple form', 'Reference tracking', 'Clear issue categories', 'Status updates', 'Local-language guidance', 'Privacy explanation', 'Other'], true);
  mc('What reporting identity option would you prefer for a future live system?', ['Anonymous', 'Name visible only to authorized officers', 'Named reporting', 'Unsure']);
  mc('What response time would you expect for acknowledgment of a non-emergency report?', ['Same day', 'Within 2 days', 'Within a week', 'Unsure']);
  mc('Which interface language would you prefer?', ['English', 'Yoruba', 'Both', 'Other']);
  form.addParagraphTextItem().setTitle('What should we improve about reporting?').setHelpText('Optional. Do not identify individuals or describe sensitive incidents.').setRequired(false);
  const sheet = SpreadsheetApp.create('IRO Questionnaire Responses - 220404260');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  console.log('Edit URL: ' + form.getEditUrl());
  console.log('Respondent URL: ' + form.getPublishedUrl());
  console.log('Response spreadsheet: ' + sheet.getUrl());
  console.log('Preview and check responder access/publication settings before sharing.');
}
