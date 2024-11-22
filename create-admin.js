const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const db = new Database(path.join(process.cwd(), 'data.db'));

async function createAdminUser() {
  try {
    const password = "admin"; // 请将此处替换为你想要的管理员密码
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = stmt.run('admin', hashedPassword);

    console.log(`Admin user created with id: ${result.lastInsertRowid}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();

