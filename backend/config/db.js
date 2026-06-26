const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Create Admins table
        db.run(`CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);

        // Create Certificates table
        db.run(`CREATE TABLE IF NOT EXISTS certificates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cert_number TEXT UNIQUE NOT NULL,
            owner_name TEXT NOT NULL,
            event_name TEXT NOT NULL,
            issue_date TEXT NOT NULL,
            admin_id INTEGER,
            FOREIGN KEY(admin_id) REFERENCES admins(id)
        )`);

        // Insert dummy admin if not exists (password: admin123)
        // In a real app, passwords should be hashed (e.g., with bcrypt). We use plain text here for simplicity.
        const insertAdmin = `INSERT OR IGNORE INTO admins (id, username, password) VALUES (1, 'admin', 'admin123')`;
        db.run(insertAdmin);
    });
}

module.exports = db;
