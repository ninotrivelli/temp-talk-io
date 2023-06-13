const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const {
  createChatRoom,
  joinChatRoom,
  sendChatMessage,
} = require("./chatRoomActions.js");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

let chatRooms = new Map();
let usedChatIds = new Set();
let maxCharLimit = 3000;

function sanitizeAndTrimMessage(message, maxLength) {
  let sanitizedMessage = DOMPurify.sanitize(message);
  return sanitizedMessage.substring(0, maxLength).trim();
}

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected!`);

  socket.on("join-room", ({ chatId, isHost, timeout }) => {
    if (timeout / 60000 > 120) {
      socket.emit("redirect-not-found");
      socket.disconnect();
      return;
    }
    if (!isHost && !usedChatIds.has(chatId)) {
      socket.emit("redirect-not-found");
      socket.disconnect();
      return;
    }

    if (!usedChatIds.has(chatId)) {
      createChatRoom(chatRooms, usedChatIds, chatId, socket, timeout);
    }

    joinChatRoom(chatRooms, usedChatIds, chatId, socket, isHost);

    if (chatRooms.get(chatId)) {
      let userCount = chatRooms.get(chatId).users.length;
      io.to(chatId).emit("users-changed", { users: userCount });
    }
  });

  socket.on("chat-message", (chatId, message) => {
    const sanitizedAndTrimmedMessage = sanitizeAndTrimMessage(
      message.msgContent,
      maxCharLimit
    );

    message.msgContent = sanitizedAndTrimmedMessage;
    sendChatMessage(chatRooms, io, chatId, socket, message);
  });

  socket.on("disconnect", () => {
    let chatRoomsToDelete = [];

    for (let [chatId, chatRoom] of chatRooms.entries()) {
      let index = chatRoom.users.indexOf(socket.id);
      if (index !== -1) {
        chatRoom.users.splice(index, 1);
        socket.leave(chatId);
        console.log(`User ${socket.id} left room ${chatId}`);
        io.to(chatId).emit("user-disconnected");

        if (chatRoom.users.length === 0) {
          clearTimeout(chatRoom.timeoutId);
          chatRoomsToDelete.push(chatId);
          console.log(`Room ${chatId} was deleted because both users left!`);
        }

        let userCount = chatRoom?.users.length;
        io.to(chatId).emit("users-changed", { users: userCount });
      }
    }

    for (let chatId of chatRoomsToDelete) {
      chatRooms.delete(chatId);
      console.log("chatRooms MAP Size: ", chatRooms.size);
    }

    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
