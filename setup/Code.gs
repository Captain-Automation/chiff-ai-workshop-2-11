/**
 * שיף AI · טופס נרשמים לסדנה → Google Sheet
 * מדביקים את כל הקובץ הזה ב-Apps Script של הגיליון (Extensions → Apps Script),
 * ופורסים כ-Web app (Execute as: Me, Who has access: Anyone).
 * הוראות מלאות בעברית: setup/SETUP-HE.md
 */

var SHEET_NAME = 'נרשמים';
var TZ = 'Asia/Jerusalem';
var HEADERS = ['תאריך ושעה', 'שם מלא', 'טלפון', 'אימייל', 'אישור דיוור', 'דף מקור', 'דפדפן', 'מזהה', 'שולם'];
// עמודות (1-based)
var COL = { TIME: 1, NAME: 2, PHONE: 3, EMAIL: 4, CONSENT: 5, SOURCE: 6, UA: 7, ID: 8, PAID: 9 };

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var d = parseBody_(e);
    var name = clean_(d.name, 80);
    var phone = normPhone_(d.phone);
    var email = clean_(d.email, 120).toLowerCase();
    if (!name || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return json_({ ok: false, error: 'invalid' });
    }
    var consent = (String(d.consent).toLowerCase() === 'yes' || d.consent === true) ? 'כן' : 'לא';
    var id = clean_(d.id, 64);
    var source = clean_(d.source, 300);
    var ua = clean_(d.userAgent, 300);
    var now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');

    var sh = getSheet_();
    var row = findRow_(sh, id, phone, email);
    var values = [now, name, phone, email, consent, source, ua, id];
    if (row) {
      // אותו אדם נרשם שוב (או רענן ושלח שוב): מעדכנים את השורה הקיימת, לא מכפילים.
      // עמודת "שולם" לא נוגעים בה.
      sh.getRange(row, 1, 1, values.length).setValues([values]);
      return json_({ ok: true, updated: true, row: row });
    }
    sh.appendRow(values);
    return json_({ ok: true, created: true, row: sh.getLastRow() });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

// פתיחת הכתובת בדפדפן מראה שהכול עובד
function doGet() {
  return json_({ ok: true, service: 'chiff-ai-registrations' });
}

// ---------- helpers ----------
function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (x) {}
  }
  return (e && e.parameter) || {};
}

function clean_(v, max) {
  v = String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim();
  // מונע הזרקת נוסחאות לגיליון
  if (/^[=+\-@]/.test(v)) v = "'" + v;
  return v.slice(0, max || 200);
}

function normPhone_(v) {
  var d = String(v || '').replace(/\D/g, '');
  if (d.indexOf('00972') === 0) d = d.slice(5);
  else if (d.indexOf('972') === 0) d = d.slice(3);
  if (d.length === 9 && d.charAt(0) === '5') d = '0' + d;
  return /^05\d{8}$/.test(d) ? d : '';
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0 || sh.getRange(1, 1).getValue() !== HEADERS[0]) {
    if (sh.getLastRow() > 0) sh.insertRowBefore(1);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setRightToLeft(true);
  }
  // טלפון כטקסט, כדי שה-0 בהתחלה לא ייעלם
  sh.getRange(1, COL.PHONE, sh.getMaxRows(), 1).setNumberFormat('@');
  return sh;
}

function findRow_(sh, id, phone, email) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var data = sh.getRange(2, 1, last - 1, COL.ID).getValues();
  for (var i = 0; i < data.length; i++) {
    if (id && String(data[i][COL.ID - 1]) === id) return i + 2;
  }
  for (var j = 0; j < data.length; j++) {
    if (String(data[j][COL.PHONE - 1]).replace(/\D/g, '') === phone ||
        String(data[j][COL.EMAIL - 1]).toLowerCase() === email) return j + 2;
  }
  return 0;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// =====================================================================
// לשימוש מאוחר יותר (כבוי כרגע).
// כדי להפעיל: מוחקים את השורה "START" שמתחת, ואת השורה "END" בסוף הקובץ, ושומרים.
// מריצים מתוך עורך Apps Script: בוחרים פונקציה למעלה ולוחצים Run.
// כדי להעביר קישור זום, הכי פשוט ליצור פונקציה קטנה, למשל:
//   function runZoom() { sendZoomLinkToAll('https://zoom.us/j/...'); }
//
// חשוב:
// - הגיליון מכיל את כל מי שמילא פרטים, גם מי שעוד לא שילם.
//   מסמנים "כן" בעמודת "שולם" לפי רשימת התשלומים ב-Invoice4U.
//   כברירת מחדל שולחים רק למי שמסומן "כן".
// - קישור זום ותזכורת לסדנה הם הודעות שירות, ולכן נשלחים גם למי שלא אישר דיוור.
//   הצעות שיווקיות שולחים רק למי שבעמודת "אישור דיוור" כתוב "כן".
// - מגבלת MailApp בחשבון Gmail רגיל: בערך 100 נמענים ביום.
// =====================================================================
/* ----- START: מחקו את השורה הזו כדי להפעיל -----

function sendZoomLinkToAll(zoomUrl, onlyPaid) {
  if (!zoomUrl) throw new Error('חסר קישור זום');
  if (onlyPaid === undefined) onlyPaid = true;
  var people = registrants_(onlyPaid);
  var subject = 'הקישור לסדנת עוזרי AI אישיים · יום שני 2.11';
  people.forEach(function (p) {
    var body = 'שלום ' + p.name + ',\n\n' +
      'שמחים שנרשמתם לסדנה!\n' +
      'יום שני 2.11, בערב, בזום.\n\n' +
      'הקישור לזום:\n' + zoomUrl + '\n\n' +
      'מומלץ להיכנס כמה דקות לפני.\n\n' +
      'אשר שיף וחיים אבלס\nשיף AI: פיתוח תוכנה, בוטים ואוטומציות';
    MailApp.sendEmail({ to: p.email, subject: subject, body: body, name: 'שיף AI' });
  });
  Logger.log('נשלח ל-' + people.length + ' נרשמים');
}

function sendReminder(zoomUrl, whenText, onlyPaid) {
  if (onlyPaid === undefined) onlyPaid = true;
  whenText = whenText || 'הערב';
  var people = registrants_(onlyPaid);
  var subject = 'תזכורת: סדנת עוזרי AI אישיים ' + whenText;
  people.forEach(function (p) {
    var body = 'שלום ' + p.name + ',\n\n' +
      'תזכורת: הסדנה מתקיימת ' + whenText + ' בזום.\n' +
      (zoomUrl ? ('הקישור לזום:\n' + zoomUrl + '\n\n') : '\n') +
      'נתראה!\nאשר שיף וחיים אבלס\nשיף AI: פיתוח תוכנה, בוטים ואוטומציות';
    MailApp.sendEmail({ to: p.email, subject: subject, body: body, name: 'שיף AI' });
  });
  Logger.log('תזכורת נשלחה ל-' + people.length + ' נרשמים');
}

function registrants_(onlyPaid) {
  var sh = getSheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var data = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  var seen = {}, out = [];
  data.forEach(function (r) {
    var email = String(r[COL.EMAIL - 1]).trim().toLowerCase();
    if (!email || seen[email]) return;
    if (onlyPaid && String(r[COL.PAID - 1]).trim() !== 'כן') return;
    seen[email] = true;
    out.push({ name: String(r[COL.NAME - 1]).trim(), email: email });
  });
  return out;
}

----- END: מחקו את השורה הזו כדי להפעיל ----- */
