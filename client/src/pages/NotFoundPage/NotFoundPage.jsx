import React from "react";
import "./NotFoundPage.css";
import NotFound404Animation from "../../assets/404-animation.json";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="container h-70 d-flex justify-content-center align-items-center">
      <div className="not__found__container">
        <Lottie
          className="not__found__animation"
          animationData={NotFound404Animation}
        />
        <p>¡Nothing to see here!</p>
        <button className="cta" onClick={handleClick}>
          Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
