import { CategoryDataBase } from "@/database/useCategoriesDatabase";
import { ProductDataBase } from "@/database/useProductsDatabase";
import { ItemDataBase } from "@/database/useItemsDatabase";
import { SyncLog } from "@/database/useSyncLogDatabase";
import { uriToBase64 } from "@/utils/uriToBase64";

// URL do Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzmWYCWW4oQlnFP28cD_FsvL1ACqSKHvTbSmQtWvNJai1RDQnph5-Nj1rjjcjCqw4ws/exec";


// Serviço de sincronização com o backend
export const SyncService = {

    /**
     * Altera o estado de conexão global (admin)
     */
    async setBackendConnection(open: boolean, admin = false): Promise<boolean> {
        try {
            const url = admin
                ? `${SCRIPT_URL}?setConnection=${open ? "true" : "false"}&admin=true`
                : `${SCRIPT_URL}?setConnection=${open ? "true" : "false"}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.status === "success" && data.isConnectionOpen === open;
        } catch (error) {
            console.error("Erro ao alterar estado da conexão:", error);
            return false;
        }
    },

    /**
     * Altera o estado de conexão individual do usuário
     */
    async setUserConnection(open: boolean, userId: string): Promise<boolean> {
        try {
            const url = `${SCRIPT_URL}?setUserConnection=${open ? "true" : "false"}&userId=${encodeURIComponent(userId)}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.status === "success" && data.isConnectionOpen === open;
        } catch (error) {
            console.error("Erro ao alterar estado da conexão do usuário:", error);
            return false;
        }
    },

    /**
     * Verifica conexão global e individual (requer userId)
     */
    async checkConnection(userId?: string, admin = false): Promise<boolean> {
        try {
            if (!userId && !admin) {
                console.warn("userId obrigatório para operações de usuário.");
                return false;
            }
            const url = userId
                ? `${SCRIPT_URL}?ping=true&userId=${encodeURIComponent(userId)}`
                : `${SCRIPT_URL}?ping=true&admin=true`;

            const response = await fetch(url);

            if (!response.ok) return false;

            const data = await response.json();

            console.log("Dados da verificação de conexão:", data.status + " | " + JSON.stringify(data));
            
            if (data.status === 'error') {
                console.warn("Conexão recusada pelo backend:", data.message);
                return false;
            }
            return true;

        } catch (error) {
            console.error("Erro ao verificar conexão:", error);
            return false;
        }
    },

    // Envia categorias, produtos, itens e logs de sincronização
    async sendCategories(categories: CategoryDataBase, userId: string) {
        return this.post("Categories", categories, { userId });
    },

    // Envia categorias, produtos, itens e logs de sincronização
    async sendProduct(product: ProductDataBase, userId: string) {
        return this.post("Products", product, { userId });
    },

    // Envia categorias, produtos, itens e logs de sincronização
    async sendItem(item: ItemDataBase, userId: string) {
        const photoBase64 = item.photoUri ? await uriToBase64(item.photoUri) : null;  // Converte a foto para Base64, se existir
        const photoRpBase64 = item.photoRpUri ? await uriToBase64(item.photoRpUri) : null;  // Converte a foto Rp para Base64, se existir

        // Remove os campos de foto originais para evitar duplicidade
        const { photoUri, photoRpUri, ...rest } = item;

        // Envia o item com as fotos em Base64
        return this.post("Items", {
            ...rest,
            photoUri: photoBase64,
            photoRpUri: photoRpBase64,
        }, { userId });
    },

    // Envia categorias, produtos, itens e logs de sincronização
    async sendSyncLog(log: SyncLog, userId: string) {
        return this.post("SyncLogs", log, { userId });
    },


    /**
     * Envia dados para o backend via POST
     */
    /**
     * Envia dados para o backend via POST
     * @param table Nome da tabela
     * @param data Dados a serem enviados
     * @returns Resposta do backend tipada
     */
    async post<T = any, R = any>(table: string, data: T, options?: { userId?: string; admin?: boolean }): Promise<R | { status: string; message: string }> {
        try {
            // options.admin true: operação de admin
            // options.userId: operação de usuário comum
            let body: any = { table, data };
            
            // Adiciona userId ou admin conforme necessário
            if (options?.admin) {
                body.admin = "true";
            } else if (options?.userId) {
                body.userId = options.userId;
            }

            // Realiza a requisição POST
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                const text = await response.text();
                console.error(`Erro HTTP ao enviar para ${table}:`, text);
                return { status: "error", message: `HTTP ${response.status}: ${text}` };
            }

            return await response.json();  // Retorna a resposta JSON tipada
        } catch (err) {
            console.error(`Erro ao enviar para ${table}:`, err);
            return { status: "error", message: (err as Error).message };
        }
    },

    async get<T = any>(
        table: string,
        queryParams: Record<string, string> = {},
        options?: { userId?: string; admin?: boolean }
        ): Promise<T | { status: string; message: string }> 
    {
        try {
            let params: Record<string, string> = { table, ...queryParams };  // Adiciona os parâmetros da query
            
            // Adiciona userId ou admin conforme necessário
            if (options?.admin) {
                params.admin = "true";
            } else if (options?.userId) {
                params.userId = options.userId;
            }

            // Constrói a string de consulta e realiza a requisição GET
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${SCRIPT_URL}?${queryString}`, { method: "GET" });
            
            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                const text = await response.text();
                console.error(`Erro HTTP ao buscar de ${table}:`, text);
                return { status: "error", message: `HTTP ${response.status}: ${text}` };
            }

            return await response.json();  // Retorna a resposta JSON tipada
        } catch (err) {
            console.error(`Erro ao buscar de ${table}:`, err);
            return { status: "error", message: (err as Error).message };
        }
    },
};


/* Apps Script (Google Sheets) - Backend

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

    if (!table || !data) {
      throw new Error("Tabela ou dados não fornecidos.");
    }

    if (table === "Categories") {
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

*/