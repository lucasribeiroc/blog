import React from "react";
import logo from "../assets/images/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <a href="https://www.usezolv.com" target="_blank" rel="noopener noreferrer">
          <img
            src={logo}
            className="h-12 w-auto inline-block align-top"
            alt="Logo"
          />
        </a>
        <a
          href="#contact"
          className="inline-flex items-center rounded-full bg-[#12295F] px-4 py-2 text-sm font-semibold uppercase tracking-[0.5px] text-white transition hover:bg-[#1f243a]"
          style={{ fontSize: "14px", letterSpacing: "0.5px" }}
        >
          QUERO CONHECER
        </a>
      </div>
    </header>
  );
};

export default Header;
