import React from "react";
import "./styles/global.css";
import "./styles/grid-system-bootstrap.css";
import { Router, Route, Routes } from "react-router-dom";
import { ChatPage, LandingPage, NotFoundPage } from "./pages";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat/:chatId" element={<ChatPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
