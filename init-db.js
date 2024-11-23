const path = require('path')
const Database = require('better-sqlite3')
const dbPath = path.join(process.cwd(), 'data/data.db')
const db = new Database(dbPath)

// 创建必要的表和默认管理员用户
db.exec(`
  CREATE TABLE IF NOT EXISTS tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    url TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    siteTitle TEXT,
    siteIcon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 检查是否已存在管理员用户，如果不存在则创建
  INSERT OR IGNORE INTO users (username, password)
  SELECT 'admin', '$2a$10$2bZFRQSxWW1uml2ZFfGcS.eVOInvKorFN6NYi6jxaQkAHE3JKRY16'  -- 默认密码：admin
  WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
`)