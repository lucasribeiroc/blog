import React from "react";
import objetivos from "../assets/images/objetivos.png";

const Consultoria = () => {
  return (
    <section
      id="consultoria"
      className="bg-[#ffffff] min-h-screen w-full flex flex-col pt-10 px-16 pb-24"
    >
      <div className="mt-8 flex flex-col md:flex-row items-start w-full">
        <div className="text-[#343950] font-poppins mt-8 md:mt-0 md:mr-8 text-[19px] md:w-1/2">
          <h1 className="text-[#59da00] text-xl tracking-[0.3em] font-medium font-poppins text-center md:text-left mb-2">
            Consultoria
          </h1>
          <p className="text-[#343950] text-[42px] font-poppins text-center md:text-left leading-tight">
            Consultoria Implantação Hands-on
          </p>
          <p className="mt-1 text-[18px]">
            A PDVSeven desenvolveu uma Jornada para a implantação completa das
            nossas soluções, e ao fim dessa jornada estará implementado e
            validado os{" "}
            <span className="text-[#59da00] font-medium">
              4 Controles essenciais para o sucesso do seu negócio.
            </span>
          </p>
          <p className="mt-10 text-[18px]">
            Com uma forma de trabalho diferenciada, estaremos lado a lado, com a
            “mão na massa”, durante todo o processo de implantação e sempre que
            você precisar.
          </p>
          <button className="bg-[#6be000] text-[#343950] font-poppins text-base py-4 px-4 rounded-full mt-12 w-1/2 font-semibold hover:bg-[#59da00] hover:opacity-90 transition duration-300">
            QUERO CONHECER
          </button>
        </div>
        <div className="md:w-1/2 text-center flex flex-col justify-start">
          <p className="text-[#a9a9a9] text-[32px] font-poppins uppercase mb-4">
            Objetivos alcançados na Jornada do Cliente
          </p>
          <img
            src={objetivos}
            alt="Lista de Objetivos"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Consultoria;
