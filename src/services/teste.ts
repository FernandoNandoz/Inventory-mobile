// Exemplos de payloads para cada tabela:
// Users
// {
//   "id": 1,
//   "username": "admin",
//   "password": "123456",
//   "access_level": "admin",
//   "syncStatus": "synced"
// }

// Categories
// {
//   "id": 10,
//   "name": "Informática",
//   "icon": "computer"
// }

// Products
// {
//   "id": 100,
//   "category_id": 10,
//   "name": "Notebook Dell",
//   "quantity": 5,
//   "observation": "Novo",
//   "syncStatus": "synced"
// }

// Items (com imagens)
// {
//   "category_id": 10,
//   "product_id": 100,
//   "rp": "RP-001",
//   "name": "Notebook Dell Inspiron",
//   "state": "novo",
//   "observation": "Sem uso",
//   "photoUri": "BASE64_DA_IMAGEM",      // string base64 ou null
//   "photoRpUri": "BASE64_DA_IMAGEM_RP", // string base64 ou null
//   "syncStatus": "synced"
// }

// SyncLogs
// {
//   "action": "sync",
//   "datetime": "2025-09-23 10:00:00",
//   "user": "admin",
//   "status": "success",
//   "message": "Sincronização realizada com sucesso!"
// }

import { UserDataBase } from "@/database/useUsersDatabase";
import { CategoryDataBase } from "@/database/useCategoriesDatabase";
import { ProductDataBase } from "@/database/useProductsDatabase";
import { ItemDataBase } from "@/database/useItemsDatabase";
import { SyncLog } from "@/database/useSyncLogDatabase";
import { uriToBase64 } from "@/utils/uriToBase64";

// URL do Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7My8msK7RqSWrhDMpEq6rk9sJCJes0akd1sS7wgFIYxs7ugoTMEaV_yaklnefpQ/exec";


// Função utilitária para fetch com timeout
async function fetchWithTimeout(resource: string, options: any = {}, timeout = 100000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (err) {
        clearTimeout(id);
        throw err;
    }
}

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
            const response = await fetchWithTimeout(url);
            const data = await response.json();
            if (data.status === "error") {
                console.warn("Erro do backend:", data.message);
                return false;
            }
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
            const response = await fetchWithTimeout(url);
            const data = await response.json();
            if (data.status === "error") {
                console.warn("Erro do backend:", data.message);
                return false;
            }
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

            const response = await fetchWithTimeout(url);

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

    /**
     * Busca todos os usuários cadastrados no backend (Google Sheets)
     * Retorna um array de objetos usuário, já mapeados pelo cabeçalho
     */
    async getAllUsers() {
        const result = await this.get("Users");
        
        if (typeof result !== "object" || !('rows' in result)) {
            return [];
        }
        
        const [header, ...rows] = (result as any).rows;

        return rows.map((row: any[]) => header.reduce((acc: any, key: string, idx: number) => { acc[key] = row[idx]; return acc; }, {}));
    },

    // Envia categorias, produtos, itens e logs de sincronização
    async sendUsers(user: UserDataBase, userId: string) {
        return await this.post("Users", user, { userId });
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

            let body: any = { table, data };

            if (options?.admin) {
                body.admin = "true";
            } else if (options?.userId) {
                body.userId = options.userId;
            }

            const response = await fetchWithTimeout(SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`Erro HTTP ao enviar para ${table}:`, text);
                return { status: "error", message: `HTTP ${response.status}: ${text}` };
            }

            const dataResponse = await response.json();
            
            if (dataResponse.status === "error") {
                console.warn(`Erro do backend ao enviar para ${table}:`, dataResponse.message);
            }

            return dataResponse;

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
            let params: Record<string, string> = { table, ...queryParams };
            if (options?.admin) {
                params.admin = "true";
            } else if (options?.userId) {
                params.userId = options.userId;
            }
            const queryString = new URLSearchParams(params).toString();
            const response = await fetchWithTimeout(`${SCRIPT_URL}?${queryString}`, { method: "GET" });
            if (!response.ok) {
                const text = await response.text();
                console.error(`Erro HTTP ao buscar de ${table}:`, text);
                return { status: "error", message: `HTTP ${response.status}: ${text}` };
            }
            const dataResponse = await response.json();
            if (dataResponse.status === "error") {
                console.warn(`Erro do backend ao buscar de ${table}:`, dataResponse.message);
            }
            return dataResponse;
        } catch (err) {
            console.error(`Erro ao buscar de ${table}:`, err);
            return { status: "error", message: (err as Error).message };
        }
    },
};
