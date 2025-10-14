// src/server.ts
import fs from 'fs';
import http from 'http';
import https from 'https';
import { Server } from "socket.io";
import dotenv from 'dotenv';
import app from './app';
import connectDB from './db/connection';
import { initSocket } from './socket';
// import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 3000;
const USE_HTTPS = process.env.USE_HTTPS === 'true'; // set to 'true' in production if you want HTTPS

// Function to start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Database connected successfully');

    let server: http.Server | https.Server;

    if (USE_HTTPS) {
      // HTTPS setup (production)
      const httpsOptions = {
        key: fs.readFileSync(process.env.HTTPS_KEY_PATH!),
        cert: fs.readFileSync(process.env.HTTPS_CERT_PATH!),
      };
      server = https.createServer(httpsOptions, app);
      console.log('Starting HTTPS server...');
    } else {
      // HTTP setup (development)
      server = http.createServer(app);
      console.log('Starting HTTP server...');

    }

    const io = new Server(server, {
      cors: {
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", 'PUT', 'PATCH', 'DELETE'],
      },
    });

    // Init socket
    initSocket(io);

    // Socket.io placeholder
    // const io = new SocketIOServer(server, { cors: { origin: process.env.FRONTEND_URL, credentials: true } });

    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err: Error) => {
      console.error(`Uncaught Exception: ${err.message}`);
      process.exit(1);
    });
  } catch (err) {
    console.error(`Server startup failed: ${(err as Error).message}`);
    process.exit(1);
  }
};

startServer();
