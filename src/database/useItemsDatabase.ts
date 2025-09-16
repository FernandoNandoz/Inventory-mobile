import { useSQLiteContext } from "expo-sqlite";

export type ItemDataBase = {
    id: number;
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

    async function searchByCategoryId(id: number) {
        let query = "";

        if (id === 0) {
            query = "SELECT * FROM items ORDER BY id DESC;";
        } else {
            query = "SELECT * FROM items WHERE category_id = ? ORDER BY id DESC;";
        }
        
        try {    
            const response = await database.getAllAsync<ItemDataBase>(
                query, 
                id
            );
            
            return response

        } catch (error) {
            throw error;
        }
    }

    async function create(data: Omit<ItemDataBase, "id">) {
        const statement = await database.prepareAsync(
                "INSERT INTO items (rp, name, state, observation, photoUri, photoRpUri, category_id) VALUES ($rp, $name, $state, $observation, $photoUri, $photoRpUri, $category_id);"
            );

        console.log(data);

        try {
            
            const result = await statement.executeAsync({
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

    async function update() {}

    async function remove() {}


    return {
        searchByCategoryId,
        create,
        update,
        remove
    }
}