import React from "react";
import sistemas from "../assets/images/sistemas.png"; // Importar a imagem
import consultoria from "../assets/images/consultoria.png"; // Importar a imagem
import pagamentos from "../assets/images/pagamentos.png"; // Importar a imagem
import redes from "../assets/images/redes.png"; // Importar a imagem
import equipamentos from "../assets/images/equipamentos.png"; // Importar a imagem
import suporte from "../assets/images/suporte.png"; // Importar a imagem

const Solucoes = () => {
  return (
    <section
      id="solucoes"
      className="bg-[#343950] min-h-screen flex flex-col items-center pt-20 px-16 pb-24"
    >
      <h1 className="text-[#00ECFF] font-poppins font-semibold text-lg tracking-[.25em] mb-16">
        Solução
      </h1>
      <h2 className="text-white font-poppins text-[42px] text-center mb-2">
        Solução full service
      </h2>
      <p className="text-white font-poppins text-[18px] text-center mb-16">
        A PDVSeven entende que a implantação de sistemas é uma transformação
        completa do negócio. Para apoiar esse processo, oferecemos a Solução
        Completa.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-[#00ECFF] p-4 rounded-lg flex flex-col items-center justify-center min-h-[200px]"
          >
            {index === 0 && (
              <>
                <img src={sistemas} alt="Sistemas" className="mb-2" />
                <p className="text-[#343950] font-poppins text-center">
                  Sistemas
                </p>
              </>
            )}
            {index === 1 && (
              <>
                <img src={consultoria} alt="Consultoria" className="mb-2" />
                <p className="text-[#343950] font-poppins text-center">
                  Consultoria Implantação “Hands-on”
                </p>
              </>
            )}
            {index === 2 && (
              <>
                <img src={pagamentos} alt="Pagamentos" className="mb-2" />
                <p className="text-[#343950] font-poppins text-center">
                  Pagamentos Integrados
                </p>
              </>
            )}
            {index === 3 && (
              <>
                <img src={redes} alt="Redes" className="mb-2" />
                <p className="text-[#343950] font-poppins text-center">Rede</p>
              </>
            )}
            {index === 4 && (
              <>
                <img src={equipamentos} alt="Equipamentos" className="mb-2" />
                <p className="text-[#343950] font-poppins text-center">
                  Equipamentos e Componentes
                </p>
              </>
            )}
            {index === 5 && (
              <>
                <img src={suporte} alt="Suporte" className="mb-2" />
                <p className="text-[#343950] font-poppins text-center">
                  Suporte Total
                </p>
              </>
            )}
            {index !== 0 &&
              index !== 1 &&
              index !== 2 &&
              index !== 3 &&
              index !== 4 &&
              index !== 5 && (
                <p className="text-[#343950] font-poppins text-center">
                  Card {index + 1}
                </p>
              )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Solucoes;
