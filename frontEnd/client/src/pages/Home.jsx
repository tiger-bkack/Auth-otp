import React from "react";
import Navber from "../components/Navber";
import Header from "../components/Header";

const Home = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen 
    bg-gradient-to-r from-indigo-50 to-indigo-100 
     "
    >
      <Navber />
      <Header />
    </div>
  );
};

export default Home;
