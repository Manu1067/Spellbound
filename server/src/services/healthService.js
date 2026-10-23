import { getDatabase } from '../db/connection.js';

export const checkHealth = () => {
  const db = getDatabase();
  // Perform lightweight test query
  const result = db.prepare('SELECT 1 as alive').get();

  return {
    status: 'ok',
    academy: 'Spellbound Wizarding Academy',
    version: '1.0.0',
    phase: '2A',
    database: result && result.alive === 1 ? 'connected' : 'error',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  };
};
