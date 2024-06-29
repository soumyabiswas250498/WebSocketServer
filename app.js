import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { setupChat } from './services/chat/chatService.js';
import cookieParser from 'cookie-parser';

const port = 3000;

const app = express();
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: "/chat"
});



app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());



setupChat()



server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
