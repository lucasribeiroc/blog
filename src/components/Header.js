import React from "react";
import logo from "../assets/images/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex items-center px-4 py-4">
        <a href="/">
          <img
            src={logo}
            className="h-12 w-auto inline-block align-top"
            alt="Logo"
          />
        </a>
      </div>
    </header>
  );
};

export default Header;
