import React from "react";
import Lottie from "lottie-react";
import phoneChatAnimation from "../../assets/phone-chat-animation.json";
import "./Hero.css";

const Hero = () => {
  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6 order-lg-1 order-2 hero__text">
          <h2>
            Self-destructing chats in seconds. <br /> No sign-ups. <br />
          </h2>
          <p>Set a timer, generate a unique link, share and start chatting.</p>
        </div>
        <div className="col-lg-6 order-lg-2 order-1 hero__img">
          <Lottie animationData={phoneChatAnimation} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
