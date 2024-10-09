import React, { useState } from "react";
import icon1 from "../assets/images/icon-1.png"; // Importar a imagem
import icon2 from "../assets/images/icon-2.png"; // Importar a imagem
import icon3 from "../assets/images/icon-3.png"; // Importar a imagem
import icon4 from "../assets/images/icon-4.png"; // Importar a imagem
import icon5 from "../assets/images/icon-5.png"; // Importar a imagem

const Sistemas = () => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);

  const toggleAccordion1 = () => {
    setIsOpen1(!isOpen1);
  };

  const toggleAccordion2 = () => {
    setIsOpen2(!isOpen2);
  };

  const toggleAccordion3 = () => {
    setIsOpen3(!isOpen3);
  };

  const toggleAccordion4 = () => {
    setIsOpen4(!isOpen4);
  };

  const toggleAccordion5 = () => {
    setIsOpen5(!isOpen5);
  };

  return (
    <section
      id="sistema"
      className="bg-white min-h-screen flex flex-col items-center pt-20 px-16 pb-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
        <div className="flex flex-col justify-start">
          <h1 className="text-[#FF4D4F] font-poppins font-semibold text-lg mb-4 tracking-[0.25em]">
            Sistemas
          </h1>
          <p className="text-[#343950] font-poppins text-[42px] pt-4 mb-2 leading-tight">
            Conte com as melhores ferramentas para auxiliar o seu negócio
          </p>
          <p className="text-[#343950] font-poppins text-[18px]">
            Nossos sistemas são completos e personalizados para atender às
            necessidades de cada negócio.
          </p>
          <button className="bg-[#FF4D4F] text-white font-poppins text-base py-4 px-4 rounded-full mt-12 w-1/2 font-medium hover:bg-[#e04345] hover:opacity-90 transition duration-300">
            QUERO CONHECER
          </button>
        </div>
        <div className="flex flex-col justify-start">
          <div
            className="border border-gray-300 rounded-lg p-4 mb-6 min-h-[80px] shadow-lg transition-all duration-300 cursor-pointer"
            onClick={toggleAccordion1}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={icon1} alt="Icon 1" className="w-10 h-10 mr-4" />
                <p className="text-[#343950] font-poppins text-[26px]">PDV</p>
              </div>
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-end justify-center text-4xl transition-transform duration-300 transform">
                {isOpen1 ? "-" : "+"}
              </div>
            </div>
            {isOpen1 && (
              <ul className="mt-4 text-[#343950] font-poppins text-[18px] list-disc list-inside pl-8">
                <li>Gestor de Pedidos</li>
                <li>Comanda Eletrônica</li>
                <li>Terminal Tab</li>
                <li>Terminal Win</li>
                <li>Ordens de Produção</li>
                <li>Terminal de Saída</li>
                <li>Painel de Comanda por Mesa</li>
                <li>Fiscal</li>
              </ul>
            )}
          </div>
          <div
            className="border border-gray-300 rounded-lg p-4 mb-6 min-h-[80px] shadow-lg transition-all duration-300 cursor-pointer"
            onClick={toggleAccordion2}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={icon2} alt="Icon 2" className="w-10 h-10 mr-4" />
                <p className="text-[#343950] font-poppins text-[26px]">
                  Autoatendimento
                </p>
              </div>
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-end justify-center text-4xl transition-transform duration-300 transform">
                {isOpen2 ? "-" : "+"}
              </div>
            </div>
            {isOpen2 && (
              <ul className="mt-4 text-[#343950] font-poppins text-[18px] list-disc list-inside pl-8">
                <li>Cardápio Digital:</li>
                <li>Toten</li>
                <li>Pedido</li>
                <li>Ticket Pré-pago</li>
                <li>Pagamento Conta</li>
                <li>Compra Crédito</li>
              </ul>
            )}
          </div>
          <div
            className="border border-gray-300 rounded-lg p-4 mb-6 min-h-[80px] shadow-lg transition-all duration-300 cursor-pointer"
            onClick={toggleAccordion3}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={icon3} alt="Icon 3" className="w-10 h-10 mr-4" />
                <p className="text-[#343950] font-poppins text-[26px]">
                  Retaguarda
                </p>
              </div>
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-end justify-center text-4xl transition-transform duration-300 transform">
                {isOpen3 ? "-" : "+"}
              </div>
            </div>
            {isOpen3 && (
              <ul className="mt-4 text-[#343950] font-poppins text-[18px] list-disc list-inside pl-8">
                <li>Financeiro</li>
                <li>Contas a Pagar</li>
                <li>Contas a Receber</li>
                <li>Fluxo de Caixa</li>
                <li>Compras</li>
                <li>Estoque</li>
                <li>Ficha Técnica</li>
                <li>CMV</li>
              </ul>
            )}
          </div>
          <div
            className="border border-gray-300 rounded-lg p-4 mb-6 min-h-[80px] shadow-lg transition-all duration-300 cursor-pointer"
            onClick={toggleAccordion4}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={icon4} alt="Icon 4" className="w-10 h-10 mr-4" />
                <p className="text-[#343950] font-poppins text-[26px]">
                  Delivery On
                </p>
              </div>
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-end justify-center text-4xl transition-transform duration-300 transform">
                {isOpen4 ? "-" : "+"}
              </div>
            </div>
            {isOpen4 && (
              <ul className="mt-4 text-[#343950] font-poppins text-[18px] list-disc list-inside pl-8">
                <li>Gestor de Pedidos</li>
                <li>Comanda Eletrônica</li>
                <li>Terminal Tab</li>
                <li>Terminal Win</li>
                <li>Ordens de Produção</li>
                <li>Terminal de Saída</li>
                <li>Painel de Comanda por Mesa</li>
                <li>Fiscal</li>
              </ul>
            )}
          </div>
          <div
            className="border border-gray-300 rounded-lg p-4 min-h-[80px] mb-6 shadow-lg transition-all duration-300 cursor-pointer"
            onClick={toggleAccordion5}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={icon5} alt="Icon 5" className="w-10 h-10 mr-4" />
                <p className="text-[#343950] font-poppins text-[26px]">
                  Integrações
                </p>
              </div>
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-end justify-center text-4xl transition-transform duration-300 transform">
                {isOpen5 ? "-" : "+"}
              </div>
            </div>
            {isOpen5 && (
              <ul className="mt-4 text-[#343950] font-poppins text-[18px] list-disc list-inside pl-8">
                <li>TEF e POS Integrado</li>
                <li>Stone</li>
                <li>PayGo</li>
                <li>Iugu (Pix Integrado)</li>
                <li>Omie (Sistema de Retaguarda)</li>
                <li>iFood</li>
                <li>Whatsapp</li>
                <li>Balança</li>
                <li>Catraca</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sistemas;
