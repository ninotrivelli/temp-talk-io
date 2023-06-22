import React, { useEffect, useRef, useState } from "react";
import "./ChatPage.css";
import {
  ChatCountDown,
  ChatHeader,
  ChatInput,
  ChatMessages,
} from "../../components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const ChatPage = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const timeout = location.state?.timer || 5 * 60000;
  const url = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
  const isHost = location.state?.isHost || false;
  const socketRef = useRef();
  const intervalId = useRef();
  const [remainingTime, setRemainingTime] = useState(timeout);
  const [usersConnected, setUsersConnected] = useState(0);

  const startCountdown = (timeout) => {
    setRemainingTime(timeout);
    intervalId.current = setInterval(() => {
      setRemainingTime((time) => time - 1000);
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
    }, timeout);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Creamos la conexión con el socket al renderizarse el elemento.
    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect_error", () => {
      const errorMessage = "Error connecting to the server! Redirecting... ";
      toast.error(errorMessage);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    });

    socketRef.current.on("chat-created", () => {
      toast.success(
        "Chat successfully created! Closing this tab makes it inaccessible forever!",
        {
          autoClose: 1800,
          hideProgressBar: true,
        }
      );
    });

    socketRef.current.on("user-disconnected", () => {
      toast.info("The other user left the chat!", {
        autoClose: false,
      });
    });

    socketRef.current.emit("join-room", { chatId, isHost, timeout });

    socketRef.current.on("redirect-not-found", () => {
      console.log("Redirigiendo al 404");
      navigate("/not-found");
    });

    socketRef.current.on("start-countdown", (timeout) => {
      startCountdown(timeout);
    });

    socketRef.current.on("chat-info-guest-connected", (message) => {
      toast.info(message, { autoClose: false });
    });

    socketRef.current.on("chat-message", (message) => {
      setMessages((messages) => [...messages, { ...message }]);
    });

    socketRef.current.on("init-guest-timer", (remainingTime) => {
      startCountdown(remainingTime);
    });

    socketRef.current.on("users-changed", (data) => {
      setUsersConnected(data.users);
    });

    return () => {
      socketRef.current.disconnect();
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      toast.dismiss();
      toast.success("Boom! 💥 Nothing left to see!", { autoClose: 1200 });
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (inputValue === "") return;

    const messageData = {
      msgContent: inputValue.trim(),
      isHost,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    socketRef.current.emit("chat-message", chatId, messageData);
    setInputValue("");
  };

  return (
    <div className="container">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-6 d-flex flex-column chatPage__container ">
          <> {isHost && <ChatHeader url={url} />}</>

          <ChatCountDown
            timer={remainingTime}
            usersConnected={usersConnected}
          />
          <ChatMessages messages={messages} ref={messagesEndRef} />
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
