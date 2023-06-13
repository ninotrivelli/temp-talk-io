import React, { useEffect } from "react";
import { CreateChat, Features, Footer, Hero, NavBar } from "../../components";
import { toast } from "react-toastify";

const LandingPage = () => {
  useEffect(() => {
    toast.dismiss();

    return () => {};
  }, []);

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
