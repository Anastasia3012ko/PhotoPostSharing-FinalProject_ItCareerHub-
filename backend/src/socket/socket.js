import { Server } from 'socket.io';
import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import jwt from 'jsonwebtoken';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3003',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // auth connect with jwt
  io.use((socket, next) => {
    try {
      // token from cookie
      const token = socket.handshake.headers.cookie?.split('token=')[1];
      if (!token) return next(new Error('Not authorized'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Token invalid'));
    }
  });

  //connect with room (chat Id)
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}, userId: ${socket.userId}`);

    socket.on('joinRoom', async ({ chatId }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(socket.userId)) {
          return socket.emit('error', {
            message: 'Not authorized to join this room',
          });
        }

        socket.join(chatId);

        // send message history
        const messages = await Message.find({ room: chatId }).sort({ createdAt: 1 });
        socket.emit("roomHistory", messages);
      } catch (error) {
        console.error("Error joining room:", error. message);
        socket.emit("roomHistory", []);
      }
    });

    // send new message
    socket.on('message', async ({ chatId, text }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(socket.userId)) {
          return socket.emit("error", { message: "Not authorized to send message in this room" });
        }
        const msg = new Message({ room: chatId, sender: socket.userId, text });
        await msg.save();

        chat.lastMessageAt = new Date();
        await chat.save();

        io.to(chatId).emit("message", msg);
      } catch (error) {
        console.error('Error saving message:', error.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}, socketId: ${socket.id}`);
    });
  });
};
