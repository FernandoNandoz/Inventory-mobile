import { useSQLiteContext } from "expo-sqlite";

// Define o tipo UserDataBase para representar a estrutura dos dados do usuário no banco de dados
export type UserDataBase = {
    id: number;
    username: string;
    password: string;
    access_level: string;
    syncStatus?: 'synced' | 'pending' | 'error' | 'conflict';
};

export function useUsersDatabase() {

    const database = useSQLiteContext(); // Instancia o contexto do SQLite

    async function getAllSync() {
        try {
            const query = "SELECT * FROM users WHERE syncStatus = 'pending' OR 'error';";
            
            const response = await database.getAllAsync<UserDataBase>(query);
            
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Função para obter um usuário pelo nome de usuário
    async function getUser(username: string) {
        try {
            const query = "SELECT id, username, password, access_level FROM users WHERE username = ?;";
            const response = await database.getAllAsync<UserDataBase>(
                query,
                username
            );
            return response[0]

        } catch (error) {
            throw error;
        } 
    }

    // Função para carregar um usuário pelo ID
    async function loadUsers(id: number) {
        try {
            const query = "SELECT id, username, password, access_level FROM users WHERE id = ?;";

            const response = await database.getAllAsync<UserDataBase>(
                query,
                id
            );
            
            return response[0]

        } catch (error) {
            throw error;
        }
    }

    // Função para buscar usuários pelo ID ou todos se o ID for 0
    async function searchByUserId(id: number) {
        let query = "";

        if (id === 0) {
            query = "SELECT * FROM users ORDER BY id DESC;";
        } else {
            query = "SELECT * FROM users WHERE id = ? ORDER BY id DESC;";
        }
        
        try {    
            const response = await database.getAllAsync<UserDataBase>(
                query, 
                id
            );
            
            return response

        } catch (error) {
            throw error;
        }
    }

    // Função para criar um novo usuário
    async function create(data: Omit<UserDataBase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO users (username, password, access_level) VALUES ($username, $password, $access_level);"
        );

        console.log(data);

        try {
            
            const response = await statement.executeAsync({
                $username: data.username,
                $password: data.password,
                $access_level: data.access_level
            });

            return response.lastInsertRowId;
            
        } catch (error) {
            throw error
        }
        finally {
            await statement.finalizeAsync();
        }
    }

    // Função para atualizar um usuário existente
    async function update(data: UserDataBase) {
        const statement = await database.prepareAsync(
            "UPDATE users SET username = $username, password = $password, access_level = $access_level WHERE id = $id;"
        );

        try {
            await statement.executeAsync({
                $username: data.username,
                $password: data.password,
                $access_level: data.access_level,
                $id: data.id
            });

        } catch (error) {
            throw error;
        }
        finally {
            await statement.finalizeAsync();
        }
    }

    // Função para remover um usuário pelo ID
    async function remove(id: number) {
        try {
            await database.execAsync("DELETE FROM users WHERE id = " + id);
        } catch (error) {
            throw error;
        }
    }


    return {
        getAllSync,
        getUser,
        loadUsers,
        searchByUserId,
        create,
        update,
        remove
    }

}