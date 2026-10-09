import { createApp } from './app';
import { config } from './config';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`
┌────────────────────────────────────────────────────────────┐
│   🚀 TESTBUDDY LABS (DIAGNOVA) - ENTERPRISE BACKEND API    │
│   Status: RUNNING                                          │
│   Port: ${config.port}                                               │
│   Environment: ${config.nodeEnv}                                 │
│   Health Check: http://localhost:${config.port}/api/health           │
└────────────────────────────────────────────────────────────┘
  `);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
