import React from "react";
import { useLocation } from "react-router-dom";

function NavBar() {
  let path = useLocation();
  if (
    path.pathname === "/" ||
    path.pathname === "/login" ||
    path.pathname === "/login/error"
  ) {
    console.log("main page");
    return <div className=""></div>;
  } else {
    return <div className="navigation-bar">Navbar</div>;
  }
}

export default NavBar;
