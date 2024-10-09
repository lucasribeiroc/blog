import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import logo2 from "../assets/images/logo2.png"; // Importar a imagem logo2

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <a href="./">
          <img
            src={isOpen ? logo2 : logo}
            className="h-12 w-auto inline-block align-top mr-8 md:h-12 md:w-auto" // Aumentar margem à direita
            alt="Logo"
          />
        </a>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-800 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        <nav
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:space-x-4 absolute md:relative top-16 left-0 w-full md:w-auto bg-white md:bg-transparent md:top-0 md:left-0`}
        >
          {[
            { href: "#quem-somos", text: "QUEM SOMOS" },
            { href: "#solucoes", text: "SOLUÇÕES" },
            { href: "#sistema", text: "SISTEMA" },
            { href: "#suporte", text: "SUPORTE" },
            { href: "#consultoria", text: "CONSULTORIA" },
            { href: "#area-de-atuacao", text: "ÁREA DE ATUAÇÃO" },
            { href: "blog", text: "BLOG" },
          ].map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="block md:inline-block font-poppins text-base text-gray-800 font-semibold relative pb-1 hover:text-green-500 group" // Alterar para font-semibold
            >
              {link.text}
              <span className="absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </a>
          ))}
        </nav>
        <a
          href="#quero-conhecer"
          className="hidden md:inline-block ml-auto bg-gray-800 text-white font-poppins font-bold text-base rounded-full py-2 px-4 transition-colors duration-300 ease hover:bg-gray-700"
        >
          QUERO CONHECER
        </a>
      </div>
    </header>
  );
};

export default Header;
