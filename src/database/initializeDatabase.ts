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
            category_id INTEGER NOT NULL,
            rp TEXT NOT NULL,
            name TEXT NOT NULL,
            state TEXT NOT NULL,
            observation TEXT,
            photoUri TEXT,
            photoRpUri TEXT,
            FOREIGN KEY(category_id) REFERENCES categories(id)
        );        
    `);
}