import React from "react";
import "./ChatInput.css";
import { AiOutlineSend } from "react-icons/ai";

const ChatInput = ({ inputValue, setInputValue, sendMessage }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage(event);
    }
  };

  return (
    <div className="chatInput__container">
      <form onSubmit={sendMessage}>
        <input
          className="chatInput"
          maxLength={3000}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="send__button" type="submit">
          <AiOutlineSend className="send__icon" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
