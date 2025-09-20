




## App script (Google Sheets)

```javascript

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { table, data } = payload;

    if (!table || !data) {
      throw new Error("Tabela ou dados não fornecidos.");
    }

    if (table === "Products") {
      return handleProducts(data);
    } else if (table === "Items") {
      return handleItems(data);
    } else if (table === "SyncLogs") {
      return handleSyncLogs(data);
    } else {
      throw new Error("Tabela desconhecida: " + table);
    }
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const table = e.parameter.table;
    if (!table) throw new Error("Tabela não especificada.");

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table);
    const rows = sheet.getDataRange().getValues();

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", table, rows })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleProducts(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
  sheet.appendRow([data.category_id, data.name, data.quantity, data.observation, data.syncStatus]);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
}

function handleItems(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Items");
  const folder = getOrCreateFolder("Uploads_Items");

  let photoUrl = "";
  let photoRpUrl = "";

  if (data.photoUri) {
    photoUrl = saveImage(folder, data.photoUri, `item_${data.product_id}_${Date.now()}_photo.png`);
  }
  if (data.photoRpUri) {
    photoRpUrl = saveImage(folder, data.photoRpUri, `item_${data.product_id}_${Date.now()}_rp.png`);
  }

  sheet.appendRow([
    data.category_id,
    data.product_id,
    data.rp,
    data.name,
    data.state,
    data.observation,
    photoUrl,
    photoRpUrl,
    data.syncStatus,
  ]);

  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
}

function handleSyncLogs(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SyncLogs");
  sheet.appendRow([data.datetime, data.user, data.status, data.message]);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

function saveImage(folder, base64, fileName) {
  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, "image/png", fileName);
  const file = folder.createFile(blob);
  return file.getUrl();
}


```