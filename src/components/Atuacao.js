import React from "react";
import areaAtuacao from "../assets/images/area_atuacao.png";
import icon1 from "../assets/images/icon-1.png";
import icon2 from "../assets/images/icon-2.png";
import icon3 from "../assets/images/icon-3.png";
import icon4 from "../assets/images/icon-4.png";
import icon5 from "../assets/images/icon-5.png";
import icon6 from "../assets/images/icon-6.png";

const Atuacao = () => {
  return (
    <section
      id="area-de-atuacao"
      className="bg-[#f9f9f9] min-h-screen w-full flex flex-col pt-10 px-16 pb-24"
    >
      <div className="mt-8 flex flex-col md:flex-row items-start w-full">
        <div className="text-[#343950] font-poppins mt-8 md:mt-0 md:mr-12 text-[19px] md:w-1/2 flex flex-col items-start">
          <h1 className="text-[#01ecff] text-xl tracking-[0.3em] font-medium font-poppins text-center md:text-left mb-2">
            Área de atuação
          </h1>
          <p className="text-[#343950] text-[42px] font-poppins text-center md:text-left leading-tight">
            Ajudando a alcançar os resultados esperados
          </p>
          <p className="mt-1 text-[18px] font-poppins">
            Atendemos a diversos segmentos do mercado de alimentação, otimizando
            os processos e garantindo mais produtividade.
          </p>
          <img
            src={areaAtuacao}
            alt="Área de Atuação"
            className="mt-8 w-[600px] h-[600px]"
          />
          <button className="bg-[#01ecff] text-[#343950] font-poppins text-base py-4 px-4 rounded-full mt-12 w-1/2 font-semibold hover:bg-[#01c4d9] hover:opacity-90 transition duration-300">
            QUERO CONHECER
          </button>
        </div>
        <div className="md:w-1/2 text-center flex flex-col justify-start gap-6">
          <div className="w-full bg-white pl-10 p-4 rounded-2xl shadow-lg h-[95px] flex items-center">
            <img src={icon1} alt="Icon 1" className="h-[65%] mr-4" />
            <span className="text-[#343950] text-[26px] font-poppins font-medium">
              Restaurantes
            </span>
          </div>
          <div className="w-full bg-white pl-10 p-4 rounded-2xl shadow-lg h-[95px] flex items-center">
            <img src={icon2} alt="Icon 2" className="h-[65%] mr-4" />
            <span className="text-[#343950] text-[26px] font-poppins font-medium">
              Bares
            </span>
          </div>
          <div className="w-full bg-white pl-10 p-4 rounded-2xl shadow-lg h-[95px] flex items-center">
            <img src={icon3} alt="Icon 3" className="h-[65%] mr-4" />
            <span className="text-[#343950] text-[26px] font-poppins font-medium">
              Casas de show
            </span>
          </div>
          <div className="w-full bg-white pl-10 p-4 rounded-2xl shadow-lg h-[95px] flex items-center">
            <img src={icon4} alt="Icon 4" className="h-[65%] mr-4" />
            <span className="text-[#343950] text-[26px] font-poppins font-medium">
              Rodízio japonês
            </span>
          </div>
          <div className="w-full bg-white pl-10 p-4 rounded-2xl shadow-lg h-[95px] flex items-center">
            <img src={icon5} alt="Icon 5" className="h-[65%] mr-4" />
            <span className="text-[#343950] text-[26px] font-poppins font-medium">
              Cafeterias
            </span>
          </div>
          <div className="w-full bg-white pl-10 p-4 rounded-2xl shadow-lg h-[95px] flex items-center">
            <img src={icon6} alt="Icon 6" className="h-[65%] mr-4" />
            <span className="text-[#343950] text-[26px] font-poppins font-medium">
              Hamburgueria
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Atuacao;
