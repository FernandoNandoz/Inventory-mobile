import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            access_level TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            observation TEXT,
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
            FOREIGN KEY(category_id) REFERENCES categories(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        );


        INSERT INTO users (username, password, access_level) VALUES ('ADMIN', 'admT0ry', 'admin');
        INSERT INTO users (username, password, access_level) VALUES ('USER', 'user123', 'user')
    `);
}