import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            access_level TEXT NOT NULL,
            syncStatus TEXT NOT NULL DEFAULT 'pending' -- pending | synced | error
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT NOT NULL,
            syncStatus TEXT NOT NULL DEFAULT 'pending' -- pending | synced | error
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            observation TEXT,
            syncStatus TEXT NOT NULL DEFAULT 'pending', -- pending | synced | error
            FOREIGN KEY(category_id) REFERENCES categories(id)
        );
        

        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            rp TEXT NOT NULL,
            name TEXT NOT NULL,
            state TEXT NOT NULL,
            observation TEXT,
            photoUri TEXT,
            photoRpUri TEXT,
            syncStatus TEXT NOT NULL DEFAULT 'pending', -- pending | synced | error
            FOREIGN KEY(category_id) REFERENCES categories(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        );

        CREATE TABLE IF NOT EXISTS sync_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL, -- connect | disconnect | sync | sync-failed
            datetime TEXT NOT NULL,
            user TEXT NOT NULL,
            status TEXT NOT NULL, -- success | error | pending
            message TEXT
        );


        INSERT INTO users (username, password, access_level, syncStatus) VALUES ('FERNANDO', 'MrBaam', 'admin', 'pending');
        INSERT INTO users (username, password, access_level, syncStatus) VALUES ('USER', '123', 'user', 'pending')
    `);
}