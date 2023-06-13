import React from "react";
import "./ChatCountDown.css";
import { FaUser } from "react-icons/fa";

const ChatCountDown = ({ timer, usersConnected }) => {
  const minutes = Math.floor(timer / 60000);
  const seconds = ((timer % 60000) / 1000).toFixed(0);
  const timeFormatted = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

  return (
    <div className="timer__container">
      <p className="timer">Time remaining: {timeFormatted} 💣 </p>

      <p className="people__connected">
        Connected:{" "}
        {[...Array(usersConnected)].map((_, index) => (
          <FaUser key={index} />
        ))}
      </p>
    </div>
  );
};

export default ChatCountDown;
