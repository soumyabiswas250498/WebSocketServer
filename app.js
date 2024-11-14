import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { handleSocketConnection } from "./src/socket/test.js";
import constants from "./src/utils/config/constants.js";
import { connectDB } from "./src/utils/config/db.js";
import authRouter from "./src/routes/authRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const port = constants.port;
const origin = constants.origin;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: origin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: origin,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/v1/auth", authRouter);

// Routes
app.get("/", (req, res) => res.send("Hello World"));

// Error Handling Middleware (should be last in the chain)
app.use(errorHandler);

// Set up Socket.IO connection handling
handleSocketConnection(io);

// Database Connection and Server Start
(async () => {
  const dbStatus = await connectDB(); // Await DB connection result

  if (dbStatus) {
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } else {
    console.error("Failed to connect to the database.");
    process.exit(1); // Exit process with failure if DB connection fails
  }
})();
