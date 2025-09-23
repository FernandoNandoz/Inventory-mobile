




## App script (Google Sheets)

```javascript

// --- Controle de conexão global (admin) ---
function setConnectionState(open) {
  PropertiesService.getScriptProperties().setProperty('isConnectionOpen', open ? 'true' : 'false');
}
function getConnectionState() {
  const value = PropertiesService.getScriptProperties().getProperty('isConnectionOpen');
  return value === null ? true : value === 'true';
}

// --- Controle de conexão individual (por userId) ---
function setUserConnectionState(userId, open) {
  PropertiesService.getScriptProperties().setProperty('isConnectionOpen_' + userId, open ? 'true' : 'false');
}
function getUserConnectionState(userId) {
  const value = PropertiesService.getScriptProperties().getProperty('isConnectionOpen_' + userId);
  return value === null ? true : value === 'true';
}

function doGet(e) {
  // Bloqueia requisições sem userId e sem admin
  if (!e.parameter.userId && !e.parameter.admin) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "userId obrigatório para operações de usuário." })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Admin: abrir/fechar conexão global
  if (e.parameter.setConnection !== undefined && e.parameter.admin === "true") {
    setConnectionState(e.parameter.setConnection === "true");
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", isConnectionOpen: getConnectionState() })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Usuário: abrir/fechar conexão individual (só se global estiver aberta)
  if (e.parameter.setUserConnection !== undefined && e.parameter.userId) {
    if (!getConnectionState()) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Conexão global fechada pelo administrador. Usuário não pode alterar seu estado." })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    setUserConnectionState(e.parameter.userId, e.parameter.setUserConnection === "true");
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", isConnectionOpen: getUserConnectionState(e.parameter.userId) })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Ping: verifica conexão global e individual
  if (e.parameter.ping !== undefined && e.parameter.userId) {
    if (!getConnectionState()) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Conexão global fechada pelo administrador." })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    if (!getUserConnectionState(e.parameter.userId)) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Conexão fechada para este usuário." })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Conexão aberta." })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Ping: verifica conexão global (admin)
  if (e.parameter.ping !== undefined && e.parameter.admin === "true") {
    if (!getConnectionState()) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Conexão global fechada pelo administrador." })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Conexão global aberta." })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Verifica conexão para demais operações
  if (e.parameter.userId) {
    if (!getConnectionState()) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Conexão global fechada pelo administrador." })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    if (!getUserConnectionState(e.parameter.userId)) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Conexão fechada para este usuário." })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ...restante do seu código doGet (exemplo de busca de tabela)...
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

function doPost(e) {
  // Bloqueia requisições sem userId e sem admin
  if (!e.parameter.userId && !e.parameter.admin) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "userId obrigatório para operações de usuário." })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Exige userId para controle individual
  var userId = "";
  try {
    const payload = JSON.parse(e.postData.contents);
    userId = payload.userId || "";
  } catch (err) {}

  // Só permite qualquer operação se a global estiver aberta
  if (!getConnectionState()) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Conexão global fechada pelo administrador." })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  if (userId && !getUserConnectionState(userId)) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Conexão fechada para este usuário." })
    ).setMimeType(ContentService.MimeType.JSON);
  }


  // ...restante do seu código doPost (exemplo de manipulação de tabelas)...
  try {
    const payload = JSON.parse(e.postData.contents);
    const { table, data } = payload;

    console.lo("Nome da tabela: " + table)
    console.log("Dados: " + data);

    if (!table || !data) {
      throw new Error("Tabela ou dados não fornecidos.");
    }

    if (table === "Users") {
      return handleUsers(data)
    } else if (table === "Categories") {
      return handleCategories(data);
    } else if (table === "Products") {
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

function handleUsers(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
  sheet.appendRow([data.id, data.username, data.password, data.access_level, data.syncStatus]);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
}

function handleCategories(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Categories");
  sheet.appendRow([data.name, data.icon]);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
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
  sheet.appendRow([data.action, data.datetime, data.user, data.status, data.message]);
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