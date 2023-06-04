import React from "react";
import { CreateChat, Features, Footer, Hero, NavBar } from "../../components";

const LandingPage = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <CreateChat />
      <Features />
      <Footer />
    </>
  );
};

export default LandingPage;
