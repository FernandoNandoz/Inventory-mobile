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
