import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { setupChat } from './services/chat/chatService.js';
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import userRouter from './routes/user.routes.js';

const app = express();



const server = createServer(app);

const io = new Server(server, {
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

app.use('/api/v1/users', userRouter);



// setupChat()


export { app, io }




