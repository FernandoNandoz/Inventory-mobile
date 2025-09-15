import { useSQLiteContext } from "expo-sqlite";
import { MaterialIcons } from "@expo/vector-icons";

export type CategoryDataBase = {
    id: number;
    name: string;
    icon: keyof typeof MaterialIcons.glyphMap;
};

export function useCategoriesDatabase() {

    const database = useSQLiteContext();

    async function list() {
        try {
            const query = "SELECT * FROM categories";        
            const response = await database.getAllAsync<CategoryDataBase>(query);
            return response

        } catch (error) {
            throw error;
        }
    }

    async function searchByName(name: string) {
        try {
            const query = "SELECT * FROM categories WHERE name LIKE ?;";
            
            const response = await database.getAllAsync<CategoryDataBase>(
                query, 
                `%${name}%`
            );
            
            return response

        } catch (error) {
            throw error;
        }
    }

    async function searchByID(id: number) {
        try {
            const query = "SELECT * FROM categories WHERE id = ?;";
            
            const response = await database.getAllAsync<CategoryDataBase>(
                query, 
                id
            );
            
            return { name: response[0].name, icon: response[0].icon }

        } catch (error) {
            throw error;
        }
    }

    async function create(data: Omit<CategoryDataBase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO categories (name, icon) VALUES ($name, $icon);"
        );

        try {
            const result = await statement.executeAsync({
                $name: data.name,
                $icon: data.icon,
            });

            const insertId = result.lastInsertRowId.toLocaleString();

            return { insertId };

        } catch (error) {
            throw error;
        }
        finally {
            await statement.finalizeAsync();
        }
    }

    async function update(data: CategoryDataBase) {
        const statement = await database.prepareAsync(
            "UPDATE categories SET name = $name, icon = $icon WHERE id = $id;"
        );

        try {
            await statement.executeAsync({
                $id: data.id,
                $name: data.name,
                $icon: data.icon,
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
            await database.execAsync("DELETE FROM categories WHERE id = " + id);
        } catch (error) {
            throw error;
        }
    }

    return {
        list,
        searchByID,
        searchByName,
        create,
        update,
        remove
    };
}