import React from "react";
import "./NavBar.css";

const NavBar = () => {
  return (
    <header className="main-header">
      <nav className="container">
        <h1 className="logo">TempTalk.io</h1>
        <ul>
          <li>
            <a className="nav-links nav-cta" href="#createChat">
              Create Chat
            </a>
          </li>
          <li>
            <a className="nav-links" href="#features">
              Features
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
