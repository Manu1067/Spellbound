import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import config from '../config/index.js';

let dbInstance = null;

export const getDatabase = () => {
  if (dbInstance) {
    return dbInstance;
  }

  // Ensure directory exists for database file
  const dbDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dbInstance = new DatabaseSync(config.dbPath);

  // Enable foreign keys and Write-Ahead Logging for concurrency & performance
  dbInstance.exec('PRAGMA foreign_keys = ON;');
  dbInstance.exec('PRAGMA journal_mode = WAL;');

  // Attach transaction helper to mirror standard transaction lifecycle
  if (!dbInstance.transaction) {
    dbInstance.transaction = (fn) => {
      return (...args) => {
        dbInstance.exec('BEGIN IMMEDIATE;');
        try {
          const result = fn(...args);
          dbInstance.exec('COMMIT;');
          return result;
        } catch (err) {
          try {
            dbInstance.exec('ROLLBACK;');
          } catch (_) {}
          throw err;
        }
      };
    };
  }

  return dbInstance;
};

export const closeDatabase = () => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};

export default getDatabase;
