import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('📡 Connected to MySQL server');

    // Read and execute SQL file
    const sqlFile = path.join(__dirname, '../../database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('📄 Executing database schema...');
    await connection.execute(sql);

    console.log('✅ Database setup completed successfully!');
    console.log('🎯 You can now start the server with: npm run dev:server');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();