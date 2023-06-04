import React, { useState } from "react";
import "./CreateChat.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const CreateChat = () => {
  const [timer, setTimer] = useState(5);
  const navigate = useNavigate();

  //!TODO: Agregar Captcha de Google antes de redirigir
  const handleSubmit = (e) => {
    e.preventDefault();

    if (timer < 0) return;
    const chatId = uuidv4(); // Generamos un id único
    navigate(`/chat/${chatId}`, {
      state: { timer: timer * 60000, isHost: true },
    }); // Redirigimos al usuario al chatroom
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="input__container">
        <span id="createChat" className="range__valueText">
          Self destruct in <strong>{timer}</strong> minutes
        </span>
        <input
          type="range"
          value={timer}
          onChange={(e) => setTimer(e.target.value)}
          placeholder="Enter "
          className="timer__input"
          min="1"
          max="120"
        />
      </div>

      <div className="cta__container">
        <button className="cta" type="submit">
          Create chat
        </button>
      </div>
    </form>
  );
};

export default CreateChat;
