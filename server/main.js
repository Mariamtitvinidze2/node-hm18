require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectToDb = require("./config/connectToDb");
const Chat = require("./models/Chat");
const PublicMessage = require("./models/PublicMessage");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: "*",
});

connectToDb();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("joinRoom", async ({ roomId, userEmail }) => {
    socket.join(roomId);
    console.log(`${userEmail} joined ${roomId}`);
    const messages = await Chat.find({ roomId }).sort({ timeStamp: 1 });
    socket.emit("previousMessages", messages);
  });

  socket.on("privateMessage", async ({ roomId, userEmail, msg }) => {
    const newMsg = new Chat({ roomId, userEmail, msg });
    await newMsg.save();
    io.to(roomId).emit("privateMessage", { roomId, userEmail, msg });
  });

  socket.on("groupChat", async ({ userEmail, msg }) => {
    const newPublic = new PublicMessage({ userEmail, msg });
    await newPublic.save();
    io.emit("groupChat", { userEmail, msg });
  });
  socket.on("getPublicMessages", async () => {
    const messages = await PublicMessage.find().sort({ timeStamp: 1 });
    socket.emit("publicMessages", messages);
  });
});

server.listen(4000, () => {
  console.log("http://localhost:4000");
});
