import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navigator from "./components/nav/Navigator";
const Main = () => {
  return (
    <>
      <Navigator />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default Main;
