import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Load environment variables */
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cyclecare",
  port: Number(process.env.DB_PORT || 3306),
  connectionLimit: 10,
  multipleStatements: true
});

export async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    let schema = await fs.readFile(schemaPath, "utf-8");

    /* Fix reserved keyword issue automatically */
    schema = schema.replace(/\busage\b/g, "usage_description");

    /* Run schema */
    await pool.query(schema);

    /* Ensure users table primary key is email */
    const [primaryKeyRows] = await pool.query(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'users' 
       AND CONSTRAINT_NAME = 'PRIMARY'
       LIMIT 1`,
      [process.env.DB_NAME || "cyclecare"]
    );

    const primaryKey = primaryKeyRows[0]?.COLUMN_NAME;

    if (primaryKey && primaryKey !== "email") {

      const [idIndexRows] = await pool.query(
        `SELECT INDEX_NAME 
         FROM INFORMATION_SCHEMA.STATISTICS
         WHERE TABLE_SCHEMA = ? 
         AND TABLE_NAME = 'users' 
         AND INDEX_NAME = 'uniq_users_id'
         LIMIT 1`,
        [process.env.DB_NAME || "cyclecare"]
      );

      if (!idIndexRows.length) {
        await pool.query(
          "ALTER TABLE users ADD UNIQUE KEY uniq_users_id (id)"
        );
      }

      await pool.query(
        "ALTER TABLE users DROP PRIMARY KEY, ADD PRIMARY KEY (email)"
      );
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error.message);
    throw error;
  }
}