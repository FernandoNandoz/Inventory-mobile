import { useSQLiteContext } from "expo-sqlite";

export type ProductDataBase = {
    id: number;
    category_id: number;
    name: string;
    quantity: number;
    observation: string;
    syncStatus?: 'synced' | 'pending' | 'error' | 'conflict';
};


export function useProductsDatabase() {

    const database = useSQLiteContext();  // Pega o banco de dados do contexto

    
    async function getAllProductsSync() {
        try {
            const query = "SELECT * FROM products WHERE syncStatus = 'pending' OR 'error';";
            
            const response = await database.getAllAsync<ProductDataBase>(query);
            
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    async function loadProduct(id: number) {
        try {
            const query = "SELECT id, category_id, name, quantity, observation FROM products WHERE id = ?;";

            const response = await database.getAllAsync<ProductDataBase>(
                query,
                id
            );
            
            return response[0]

        } catch (error) {
            throw error;
        }
    }

    async function searchByCategoryId(id: number) {
        let query = "";

        if (id === 0) {
            query = "SELECT * FROM products ORDER BY id DESC;";
        } else {
            query = "SELECT * FROM products WHERE category_id = ? ORDER BY id DESC;";
        }
        
        try {    
            const response = await database.getAllAsync<ProductDataBase>(
                query, 
                id
            );
            
            return response

        } catch (error) {
            throw error;
        }
    }

    async function create(data: Omit<ProductDataBase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO products (category_id, name, quantity, observation) VALUES ($category_id, $name, $quantity, $observation);"
        );

        console.log(data);

        try {
            
            const response = await statement.executeAsync({
                $category_id: data.category_id,
                $name: data.name,
                $quantity: data.quantity,
                $observation: data.observation
            });

            return response.lastInsertRowId;
            
        } catch (error) {
            throw error
        }
        finally {
            await statement.finalizeAsync();
        }
    }

    async function update(data: ProductDataBase) {
        const statement = await database.prepareAsync(
            "UPDATE products SET category_id = $category_id, name = $name, quantity = $quantity, observation = $observation WHERE id = $id;"
        );

        try {
            await statement.executeAsync({
                $category_id: data.category_id,
                $name: data.name,
                $quantity: data.quantity,
                $observation: data.observation,
                $id: data.id
            });

        } catch (error) {
            throw error;
        }
        finally {
            await statement.finalizeAsync();
        }
    }

    // 
    async function updateSyncStatus(status: string, id: number) {
        const statement = await database.prepareAsync(
            "UPDATE products SET syncStatus = $syncStatus WHERE id = $id;"
        );

        try {
            await statement.executeAsync({
                $syncStatus: status,
                $id: id
            });

        } catch (error) {
            throw error;
        }
        finally {
            await statement.finalizeAsync();
        }
    }

    async function remove(id: number) {
        try {
            await database.execAsync("DELETE FROM products WHERE id = " + id);
        } catch (error) {
            throw error;
        }
    }


    return {
        updateSyncStatus,
        getAllProductsSync,
        loadProduct,
        searchByCategoryId,
        create,
        update,
        remove
    }
}