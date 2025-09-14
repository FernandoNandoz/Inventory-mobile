import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            categories_id INTEGER NOT NULL,
            rp TEXT NOT NULL,
            name TEXT NOT NULL,
            observation TEXT,
            state TEXT NOT NULL,
            photoUri TEXT,
            photoRpUri TEXT,
            FOREIGN KEY(categories_id) REFERENCES categories(id)
        );
        
    `);
}