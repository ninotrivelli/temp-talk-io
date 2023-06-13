import React, { useRef, useState } from "react";
import "./CreateChat.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import ReCAPTCHA from "react-google-recaptcha";

const CreateChat = () => {
  const [timer, setTimer] = useState(5);
  const navigate = useNavigate();
  // const recaptchaRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (timer <= 0) return;

    // const recaptchaValue = recaptchaRef.current.getValue();
    // if (!recaptchaValue) {
    //   toast.error("Verify you are human!");
    //   return;
    // }

    const chatId = uuidv4();
    navigate(`/chat/${chatId}`, {
      state: { timer: timer * 60000, isHost: true }, // captcha: recaptchaValue ---> Mandar
    });
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

      {/* <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="your-site-key" // key for client side, provided by google. NEEDS DOMAIN FIRST.
        onChange={(value) => console.log(value)}
      /> */}

      <div className="cta__container">
        <button className="cta" type="submit">
          Create chat
        </button>
      </div>
    </form>
  );
};

export default CreateChat;
