import express from 'express';
import http from 'http';
import connectToDatabase from './src/config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import followRoutes from './src/routes/followRoutes.js';
import likeRoutes from './src/routes/likeRoutes.js';

import { initSocket } from './src/socket/socket.js';

//only test
import path from "path";
import { fileURLToPath } from "url";

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT  || 3000;

const app = express();
const server = http.createServer(app); // HTTP-server for Express + Socket.IO

const __filename = fileURLToPath(import.meta.url);//only test
const __dirname = path.dirname(__filename); //only test
app.use(express.static(path.join(__dirname, "public"))); //only test

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3003', // frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (_req, res) => {
  res.send('HomePage');
});

//Routes
app.use('/api/auth', authRoutes);
app.use ('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/like', likeRoutes)

// Socket.IO
initSocket(server);

// Start server
server.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error(
      'Failed to start the server due to MongoDB connection issue',
      error
    );
  }
});
