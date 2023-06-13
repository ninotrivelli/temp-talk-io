import "./styles/global.css";
import "./styles/grid-system-bootstrap.css";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatPage, LandingPage, NotFoundPage } from "./pages";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
