import React from "react";
import logoWhite from "../assets/images/logo_white.png";
import facebookIcon from "../assets/images/facebook.png";
import instagramIcon from "../assets/images/instagram.png";
import youtubeIcon from "../assets/images/youtube.png";

const Footer = () => {
  return (
    <section className="bg-[#393450] text-white py-8 pb-4 font-poppins">
      <div className="container mx-auto w-[85%] grid grid-cols-1 md:grid-cols-12 gap-4 text-center md:text-left">
        {/* Coluna 1 */}
        <div className="pt-5 md:col-span-3">
          <img
            src={logoWhite}
            alt="Logo"
            className="mx-auto md:mx-0 mb-4 w-48 h-auto"
          />
          <div className="flex justify-center md:justify-start space-x-2">
            <a
              href="https://www.facebook.com/pdvseven"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <img src={facebookIcon} alt="Facebook" className="h-6" />
              <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </a>
            <a
              href="https://www.instagram.com/pdvsevensistemas"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <img src={instagramIcon} alt="Instagram" className="h-6" />
              <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </a>
            <a
              href="https://www.youtube.com/@PdvsevenBr"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <img src={youtubeIcon} alt="YouTube" className="h-6" />
              <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </a>
          </div>
        </div>
        {/* Coluna 2 */}
        <div className="pt-5 md:col-span-2">
          <h2 className="text-lg font-semibold mb-10 text-[#59da00]">
            Empresa
          </h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="group relative inline-block text-[18px]">
                Quem somos
                <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </a>
            </li>
            <li>
              <a href="#" className="group relative inline-block text-[18px]">
                Solução
                <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </a>
            </li>
            <li>
              <a href="#" className="group relative inline-block text-[18px]">
                Sistema
                <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </a>
            </li>
            <li>
              <a href="#" className="group relative inline-block text-[18px]">
                Suporte
                <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </a>
            </li>
            <li>
              <a href="#" className="group relative inline-block text-[18px]">
                Consultoria
                <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </a>
            </li>
            <li>
              <a href="#" className="group relative inline-block text-[18px]">
                Área de atuação
                <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </a>
            </li>
          </ul>
        </div>
        {/* Coluna 3 */}
        <div className="pt-5 md:col-span-3">
          <h2 className="text-lg font-semibold mb-10 text-[#59da00]">
            Fale conosco
          </h2>
          <p className="mb-4">
            <a
              href="tel:+551142100122"
              className="group relative inline-block text-[18px]"
            >
              +55 (11) 4210-0122
              <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </a>
          </p>
          <p className="text-[18px]">
            <a
              href="https://maps.app.goo.gl/fLDJtYDB62TKYhv29"
              className="group relative inline-block text-[18px]"
            >
              Av. Doutor Rudge Ramos, 1201
              <br />
              São Bernardo do Campo - SP
              <span className="block absolute w-full h-0.5 bg-green-500 bottom-0 left-0 transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </a>
          </p>
        </div>
        {/* Coluna 4 */}
        <div className="pt-5 md:col-span-4 md:ml-4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.948396866769!2d-46.56671968447414!3d-23.5882136846694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce423d5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sAv.%20Doutor%20Rudge%20Ramos%2C%201201%20-%20Rudge%20Ramos%2C%20S%C3%A3o%20Bernardo%20do%20Campo%20-%20SP%2C%2009602-000%2C%20Brazil!5e0!3m2!1sen!2sus!4v1616161616161!5m2!1sen!2sus"
            width="100%"
            height="150"
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
      <hr className="w-[90%] mx-auto mt-12 mb-5 border-gray-500" />
      <p className="text-center text-gray-500 text-[14px]">
        © 2024 | Todos os direitos reservados
      </p>
    </section>
  );
};

export default Footer;
