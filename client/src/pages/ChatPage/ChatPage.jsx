import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ChatPage.css";
import {
  ChatCountDown,
  ChatHeader,
  ChatInput,
  ChatMessages,
} from "../../components";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import { io } from "socket.io-client";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const ChatPage = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const timeout = location.state?.timer || 5 * 60000;
  const url = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
  const navigate = useNavigate();
  const isHost = location.state?.isHost || false;

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
    socketRef.current.emit("join-room", { chatId, isHost, timeout });

    socketRef.current.on("redirectNotFound", () => {
      console.log("por redigirir al 404");
      navigate("/not-found");
    });

    socketRef.current.on("chat-message", (message) => {
      console.log("mensaje recibido: ", message);
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      // This is run when the component unmounts. We disconnect the socket to prevent memory leaks
      // socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (event) => {
    if (inputValue === "") return;

    event.preventDefault();
    socketRef.current.emit("chat-message", chatId, { msgContent: inputValue });
    setInputValue("");
  };

  return (
    <div className="container h-100">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-6">
          <ChatHeader url={url} />
          <ChatCountDown timer={timeout} />
          <ChatMessages messages={messages} />
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
