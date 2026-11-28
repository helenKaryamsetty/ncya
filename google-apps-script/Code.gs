const SHEET_ID = '17uLvazyNzxyVW9_LW_ttm0LHOBHW9g1tK_viWHb3GTk';
const SHEET_NAME = 'Registrations';
const GENDERS = ['Female', 'Male', 'Non-binary', 'Other', 'Prefer not to say'];

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse(event.postData.contents);
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const rawAge = data.age;
    const hasAge = rawAge !== undefined && rawAge !== null && String(rawAge).trim() !== '';
    const age = hasAge ? Number(rawAge) : '';
    const gender = String(data.gender || '').trim();
    const email = String(data.email || '').trim();

    if (!name || name.length > 100) {
      return jsonResponse({ success: false, message: 'Please enter your name.' });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return jsonResponse({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }
    if (hasAge && (!Number.isInteger(age) || age < 1 || age > 120)) {
      return jsonResponse({ success: false, message: 'Please enter a valid age.' });
    }
    if (gender && !GENDERS.includes(gender)) {
      return jsonResponse({ success: false, message: 'Please select a valid gender.' });
    }
    if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return jsonResponse({ success: false, message: 'Please enter a valid email address.' });
    }

    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Age', 'Phone', 'Gender', 'Email']);
    }

    const row = sheet.getLastRow() + 1;
    sheet.getRange(row, 4).setNumberFormat('@');
    sheet.getRange(row, 1, 1, 6).setValues([[
      new Date(), safeCell(name), age, safeCell(phone), safeCell(gender), safeCell(email)
    ]]);
    SpreadsheetApp.flush();
    return jsonResponse({ success: true, message: 'Registration successful!' });
  } catch (error) {
    return jsonResponse({ success: false, message: error.message || 'Something went wrong.' });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function safeCell(value) {
  const text = String(value || '').trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}