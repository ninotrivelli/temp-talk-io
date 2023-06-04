import React from "react";
import "./ChatInput.css";
const ChatInput = ({ inputValue, setInputValue, sendMessage }) => {
  return (
    <div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatInput;
