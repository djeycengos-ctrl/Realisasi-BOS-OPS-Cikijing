/**
 * BOS OPS Cikijing Reporting System
 * Google Apps Script Backend
 */

const SHEET_NAME_DATA = "DataTransaksi";
const SHEET_NAME_PROFIL = "ProfilSekolah";

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('BOS OPS Cikijing Reporting System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Helper: Normalize Header Name
 */
function normalizeKey(header) {
  return String(header || '').toLowerCase().replace(/[\s\.]+/g, '');
}

/**
 * Database Initialization
 */
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Data Transaksi Sheet
  let dataSheet = ss.getSheetByName(SHEET_NAME_DATA);
  if (!dataSheet) {
    dataSheet = ss.insertSheet(SHEET_NAME_DATA);
    dataSheet.appendRow(['ID', 'Tanggal', 'Kegiatan', 'Rekening', 'NoBukti', 'Uraian', 'Terima', 'Keluar', 'Transaksi']);
    dataSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#f3f3f3');
  }
  
  // Profil Sheet
  let profilSheet = ss.getSheetByName(SHEET_NAME_PROFIL);
  if (!profilSheet) {
    profilSheet = ss.insertSheet(SHEET_NAME_PROFIL);
    profilSheet.appendRow(['Nama Sekolah', 'NPSN', 'Kepala Sekolah', 'NIP Kepsek', 'Bendahara', 'NIP Bendahara', 'Password']);
    profilSheet.appendRow(['SDN Cikijing', '12345678', 'Nama Kepsek', '1980...', 'Nama Bendahara', '1985...', '123456']);
    profilSheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#f3f3f3');
  } else {
    // Ensure Password column exists if sheet was created previously
    const lastCol = profilSheet.getLastColumn();
    const headers = profilSheet.getRange(1, 1, 1, lastCol).getValues()[0];
    if (headers.indexOf('Password') === -1) {
      profilSheet.getRange(1, 7).setValue('Password').setFontWeight('bold').setBackground('#f3f3f3');
      if (profilSheet.getLastRow() >= 2) {
        profilSheet.getRange(2, 7).setValue('123456');
      }
    }
  }
}

/**
 * API: Get All Data
 */
function getAllData() {
  try {
    initDatabase();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME_DATA);
    if (!sheet) {
      console.log("Sheet tidak ditemukan: " + SHEET_NAME_DATA);
      return [];
    }
    
    const values = sheet.getDataRange().getValues();
    if (values.length < 1) return [];

    // Cari baris header (baris pertama yang tidak kosong)
    let headerRowIdx = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i].join('').trim() !== '') {
        headerRowIdx = i;
        break;
      }
    }

    const rawHeaders = values[headerRowIdx];
    const headers = rawHeaders.map(normalizeKey);
    const data = [];
    
    for (let i = headerRowIdx + 1; i < values.length; i++) {
      const row = values[i];
      if (row.join('').trim() === '') continue; // Skip empty rows
      
      const obj = {};
      headers.forEach((key, index) => {
        if (!key) return;
        let val = row[index];
        if (key === 'tanggal' && val instanceof Date) {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
        }
        obj[key] = val;
      });
      data.push(obj);
    }
    
    return data.sort((a, b) => {
      const dateA = a.tanggal ? new Date(a.tanggal).getTime() : 0;
      const dateB = b.tanggal ? new Date(b.tanggal).getTime() : 0;
      return dateB - dateA;
    });
  } catch (e) {
    console.error("Error in getAllData: " + e.toString());
    return [];
  }
}

/**
 * API: Save/Update Data (Batch)
 */
function saveDataBatch(items) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME_DATA);
    const values = sheet.getDataRange().getValues();
    
    // Cari baris header
    let headerRowIdx = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i].join('').trim() !== '') {
        headerRowIdx = i;
        break;
      }
    }
    
    const headers = values[headerRowIdx].map(normalizeKey);
    const idIdx = headers.indexOf('id');
    
    const newRows = [];
    items.forEach(item => {
      const id = item.id || Utilities.getUuid();
      const rowData = new Array(headers.length);
      
      headers.forEach((key, idx) => {
        if (key === 'id') rowData[idx] = id;
        else if (key === 'terima' || key === 'keluar') rowData[idx] = Number(item[key]) || 0;
        else rowData[idx] = item[key] || '';
      });
      newRows.push(rowData);
    });
    
    if (newRows.length > 0) {
      console.log("Appending " + newRows.length + " rows to " + SHEET_NAME_DATA);
      sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
    }
    
    return { success: true, count: newRows.length };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * API: Save/Update Data
 */
function saveData(item) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME_DATA);
    const values = sheet.getDataRange().getValues();
    
    // Cari baris header
    let headerRowIdx = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i].join('').trim() !== '') {
        headerRowIdx = i;
        break;
      }
    }
    
    const headers = values[headerRowIdx].map(normalizeKey);
    const id = item.id || Utilities.getUuid();
    const rowData = new Array(headers.length);
    
    headers.forEach((key, idx) => {
      if (key === 'id') rowData[idx] = id;
      else if (key === 'terima' || key === 'keluar') rowData[idx] = Number(item[key]) || 0;
      else rowData[idx] = item[key] || '';
    });
    
    if (item.id) {
      const idIdx = headers.indexOf('id');
      for (let i = headerRowIdx + 1; i < values.length; i++) {
        if (values[i][idIdx] === item.id) {
          sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
          return { success: true };
        }
      }
    }
    
    sheet.appendRow(rowData);
    return { success: true };
  } catch (e) {
    console.error("Error in saveData: " + e.toString());
    return { success: false, error: e.toString() };
  }
}

/**
 * API: Delete Data
 */
function deleteData(id) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME_DATA);
    const values = sheet.getDataRange().getValues();
    
    // Cari baris header
    let headerRowIdx = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i].join('').trim() !== '') {
        headerRowIdx = i;
        break;
      }
    }
    
    const headers = values[headerRowIdx].map(normalizeKey);
    const idIdx = headers.indexOf('id');
    
    for (let i = headerRowIdx + 1; i < values.length; i++) {
      if (values[i][idIdx] === id) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false };
  } catch (e) {
    console.error("Error in deleteData: " + e.toString());
    return { success: false, error: e.toString() };
  }
}

/**
 * API: Get Profil
 */
function getProfil() {
  try {
    initDatabase();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME_PROFIL);
    const values = sheet.getDataRange().getValues();
    
    // Cari baris header
    let headerRowIdx = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i].join('').trim() !== '') {
        headerRowIdx = i;
        break;
      }
    }
    
    const headers = values[headerRowIdx].map(normalizeKey);
    const row = values[headerRowIdx + 1] || [];
    
    const getVal = (key) => {
      const idx = headers.indexOf(normalizeKey(key));
      return idx > -1 ? row[idx] : '';
    };
    
    return {
      nama: getVal('namasekolah'),
      npsn: getVal('npsn'),
      kepsek: getVal('kepalasekolah'),
      nipKepsek: getVal('nipkepsek'),
      bendahara: getVal('bendahara'),
      nipBendahara: getVal('nipbendahara'),
      pass: getVal('password')
    };
  } catch (e) {
    console.error("Error in getProfil: " + e.toString());
    return { nama: 'Error Loading Profile' };
  }
}

/**
 * API: Update Profil
 */
function updateProfil(p) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME_PROFIL);
    const values = sheet.getDataRange().getValues();
    
    let headerRowIdx = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i].join('').trim() !== '') {
        headerRowIdx = i;
        break;
      }
    }
    
    const headers = values[headerRowIdx].map(normalizeKey);
    const rowData = new Array(headers.length);
    
    const setVal = (key, val) => {
      const idx = headers.indexOf(normalizeKey(key));
      if (idx > -1) rowData[idx] = val;
    };
    
    setVal('namasekolah', p.nama);
    setVal('npsn', p.npsn);
    setVal('kepalasekolah', p.kepsek);
    setVal('nipkepsek', p.nipKepsek);
    setVal('bendahara', p.bendahara);
    setVal('nipbendahara', p.nipBendahara);
    setVal('password', p.pass);
    
    sheet.getRange(headerRowIdx + 2, 1, 1, rowData.length).setValues([rowData]);
    return { success: true };
  } catch (e) {
    console.error("Error in updateProfil: " + e.toString());
    return { success: false, error: e.toString() };
  }
}

/**
 * API: Check Login
 */
function checkLogin(password) {
  const p = getProfil();
  // Use String conversion to handle cases where Sheets might store password as a number
  return String(p.pass || '').trim() === String(password || '').trim();
}
