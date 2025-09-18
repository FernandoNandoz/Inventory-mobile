import { useSQLiteContext } from "expo-sqlite";

export type ItemDataBase = {
    id: number;
    product_id: number;
    rp: string;
    name: string;
    state: string;
    observation: string;
    photoUri: string;
    photoRpUri: string;
    category_id: number;
};


export function useItemsDatabase() {

    const database = useSQLiteContext();

    async function loadItem(id: number) {
        try {
            const query = "SELECT id, rp, name, state, observation, photoUri, photoRpUri, category_id FROM items WHERE product_id = ?;";
            
            const response = await database.getAllAsync<ItemDataBase>(
                query, 
                id
            );
            
            return response[0]

        } catch (error) {
            throw error;
        }
    }

    async function searchByProductId(id: number, search: string) {

        const query = "SELECT * FROM items WHERE product_id = ? AND rp LIKE ? ORDER BY id DESC;";
        
        try {    
            const response = await database.getAllAsync<ItemDataBase>(
                query, 
                id,
                `%${search}%`
            );
            
            return response

        } catch (error) {
            throw error;
        }
    }

    async function create(data: Omit<ItemDataBase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO items (product_id, rp, name, state, observation, photoUri, photoRpUri, category_id) VALUES ($product_id, $rp, $name, $state, $observation, $photoUri, $photoRpUri, $category_id);"
        );

        try {
            
            await statement.executeAsync({
                $product_id: data.product_id,
                $rp: data.rp,
                $name: data.name,
                $state: data.state,
                $observation: data.observation,
                $photoUri: data.photoUri,
                $photoRpUri: data.photoRpUri,
                $category_id: data.category_id
            });
            
        } catch (error) {
            throw error
        }
        finally {
            await statement.finalizeAsync();
        }
    }

    async function update(data: Omit<ItemDataBase, "product_id">) {
        const statement = await database.prepareAsync(
            "UPDATE items SET rp = $rp, name = $name, state = $state, observation = $observation, photoUri = $photoUri, photoRpUri = $photoRpUri, category_id = $category_id WHERE id = $id;"
        );

        try {
            await statement.executeAsync({
                $rp: data.rp,
                $name: data.name,
                $state: data.state,
                $observation: data.observation,
                $photoUri: data.photoUri,
                $photoRpUri: data.photoRpUri,
                $category_id: data.category_id,
                $id: data.id
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
            await database.execAsync("DELETE FROM items WHERE id = " + id);
        } catch (error) {
            throw error;
        }
    }


    return {
        loadItem,
        searchByProductId,
        create,
        update,
        remove
    }
}