import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(errorHandler)

app.get('/', (req, res) => res.send('Hello World'));

io.use((socket, next) => {
  const usernameFrom = socket.handshake.auth.usernameFrom;
  console.log(usernameFrom)
  if (!usernameFrom) {
    return next(new Error("invalid username"));
  }
  socket.usernameFrom = usernameFrom;
  next();
});

io.on('connection',  socket => {



  console.log('User connected');
  console.log('Id', socket.id);

  socket.on('getUserId', async userName=> {
    const sockets = await io.fetchSockets();
    if (sockets.length > 0) {
      const toData =  sockets.filter(item =>{  
        return item.usernameFrom === userName} )
      console.log(toData[0]?.id, '***')
      socket.emit('receiveUserId', toData[0]?.id || null )
    }
  })
  
  socket.on('c2s-message', ({ content, to }) => {
    console.log(content, to);
    if(to){
      socket.to(to).emit('s2c-message', content);
    }
    
  });
});



server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
