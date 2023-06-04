const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// BD
let chatRooms = {};

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Join room event
  socket.on("join-room", ({ chatId, isHost, timeout }) => {
    console.log(chatId, isHost);

    if (!isHost && !chatRooms[chatId]) {
      socket.emit("redirectNotFound");
      socket.disconnect();
      return;
    }

    if (!chatRooms[chatId]) {
      chatRooms[chatId] = { users: [], messages: [], sockets: [] };

      // Set timer to self-destruct room and disconnect users
      chatRooms[chatId].timeout = setTimeout(() => {
        chatRooms[chatId].sockets.forEach((socket) => {
          socket.emit("redirectNotFound");
          socket.disconnect();
        });
        delete chatRooms[chatId];
        console.log(`Room ${chatId} self-destructed`);
      }, timeout);
    }

    if (chatRooms[chatId].users.length < 2) {
      socket.join(chatId);
      chatRooms[chatId].users.push(socket.id);
      chatRooms[chatId].sockets.push(socket);
      console.log(`User ${socket.id} joined room ${chatId}`);
    } else {
      console.log(`Room ${chatId} is full`);
    }

    console.log(chatRooms);
  });

  // Chat message event
  socket.on("chat-message", (chatId, message) => {
    if (chatRooms[chatId] && chatRooms[chatId].users.includes(socket.id)) {
      chatRooms[chatId].messages.push(message);
      io.to(chatId).emit("chat-message", message);
      console.log(`Message sent in room ${chatId}`);
    } else {
      console.log(`Cannot send message in room ${chatId}`);
    }
  });

  // Disconnect event
  socket.on("disconnect", () => {
    for (let chatId in chatRooms) {
      let room = chatRooms[chatId];
      let index = room.users.indexOf(socket.id);
      if (index !== -1) {
        room.users.splice(index, 1);
        socket.leave(chatId);
        console.log(`User ${socket.id} left room ${chatId}`);
      }
    }
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
