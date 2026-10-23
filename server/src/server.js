import app from './app.js';
import config from './config/index.js';
import { initializeDatabase } from './db/init.js';
import { closeDatabase } from './db/connection.js';

// Ensure database tables and initial seed data are initialized
try {
  initializeDatabase({ reset: false });
} catch (err) {
  console.error('[Server] Failed to initialize database:', err);
  process.exit(1);
}

// Start HTTP Server
const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🏰 SPELLBOUND ACADEMY BACKEND API`);
  console.log(`⚡ Environment : ${config.nodeEnv}`);
  console.log(`🔮 Listening on: http://localhost:${config.port}`);
  console.log(`📡 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`=======================================================`);
});

// Graceful termination handling
const shutdown = (signal) => {
  console.log(`\n[Server] Received ${signal}. Whispering closing charms...`);
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    closeDatabase();
    console.log('[Database] Database connection closed safely.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default server;
