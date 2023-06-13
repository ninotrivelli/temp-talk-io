// ****** Creating a new chatroom ******
function createChatRoom(chatRooms, usedChatIds, chatId, socket, timeout) {
  chatRooms.set(chatId, {
    users: [],
    sockets: [],
    isLocked: false,
    messages: [],
    chatStart: Date.now(), // When the chat started
    chatEnd: Date.now() + timeout, // When the chat is supposed to end
  });

  usedChatIds.add(chatId);

  socket.emit("chat-created");
  socket.emit("start-countdown", timeout);

  console.log(
    `Setting TimeOut to self-destruct in: ${timeout / 60000} minutes`
  );

  let timeoutId = setTimeout(() => {
    let chatRoom = chatRooms.get(chatId);
    if (chatRoom) {
      chatRoom.sockets.forEach((s) => {
        s.emit("redirect-not-found");
        s.disconnect();
      });

      chatRooms.delete(chatId);
      console.log(`Room ${chatId} self-destructed by the TIMER`);
    }
  }, timeout);

  let chatRoom = chatRooms.get(chatId);
  chatRooms.set(chatId, { ...chatRoom, timeoutId: timeoutId });
}

// ****** Joining a chatroom ******
function joinChatRoom(chatRooms, usedChatIds, chatId, socket, isHost) {
  let chatRoom = chatRooms.get(chatId);
  if (chatRoom && chatRoom.users.length < 2 && !chatRoom.isLocked) {
    socket.join(chatId);
    chatRoom.users.push(socket.id);
    chatRoom.sockets.push(socket);
    console.log(`User ${socket.id}, joined room ${chatId}, is Host: ${isHost}`);

    if (!isHost) {
      chatRoom.messages.forEach((message) => {
        socket.emit("chat-message", message);
      });
    }

    if (chatRoom.users.length === 2) {
      console.log(
        `Chatroom ${chatId} is now locked, if you go back or close it, you won't be able to enter again.`
      );

      chatRoom.isLocked = true;

      // Le avisamos al host cuando se une la otra persona
      chatRoom.sockets[0].emit(
        "chat-info-guest-connected",
        "The other participant has joined the chat! Chat locked 🔒 Closing this tab prevents re-entry."
      );

      let remainingTime = chatRoom.chatEnd - Date.now(); // Calculate remaining time
      chatRoom.sockets[1].emit("init-guest-timer", remainingTime);

      // Le avisamos al guest que esta conectado
      chatRoom.sockets[1].emit(
        "chat-info-guest-connected",
        "Connected! Now you can chat freely. Chat is locked with two participants 🔒 Closing this tab prevents re-entry."
      );
    }
  } else {
    console.log(`Can't join room ${chatId} because it's full or locked`);
    socket.emit("redirect-not-found");
    socket.disconnect();
  }
}

// ****** Sending a message ******
function sendChatMessage(chatRooms, io, chatId, socket, message) {
  let chatRoom = chatRooms.get(chatId);
  if (chatRoom && chatRoom.users.includes(socket.id)) {
    io.to(chatId).emit("chat-message", message);
    console.log(`Message sent in room ${chatId}`);
    chatRoom.messages.push(message);
  } else {
    console.log(`Cannot send message in room ${chatId}`);
  }
}

module.exports = {
  createChatRoom,
  joinChatRoom,
  sendChatMessage,
};
