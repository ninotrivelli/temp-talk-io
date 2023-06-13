import React, { forwardRef } from "react";
import "./ChatMessages.css";

const ChatMessages = forwardRef(({ messages }, ref) => {
  return (
    <div className="chat__body">
      <div className="chat__container">
        {messages.map((message, index) => (
          <p
            className={
              message.isHost
                ? "host__message message"
                : "guest__message message"
            }
            key={index}
          >
            {"> " + message.msgContent}

            <small className="message__dateTime">{message.time}</small>
          </p>
        ))}
        <div ref={ref}></div>
      </div>
    </div>
  );
});

export default ChatMessages;
