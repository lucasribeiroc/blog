import React from "react";
import equipamentosUteis from "../assets/images/equipamentos_uteis.png";

const Suporte = () => {
  return (
    <section
      id="suporte"
      className="bg-[#343950] min-h-screen w-full flex flex-col pt-20 px-16 pb-24"
    >
      <h1 className="text-[#FFD700] text-xl tracking-[0.3em] font-medium font-poppins text-center">
        Suporte
      </h1>
      <p className="text-white text-[42px] mt-4 font-poppins text-center">
        O que há de melhor para o seu negócio
      </p>
      <div className="mt-8 flex flex-col md:flex-row items-center w-full">
        <img
          src={equipamentosUteis}
          alt="Equipamentos Úteis"
          className="w-[592px] h-[478px] object-contain"
        />
        <div className="text-white font-poppins mt-8 md:mt-0 md:ml-8 text-[19px]">
          <p>
            <strong className="text-[#FFD700]">
              Nosso suporte é o mais completo do mercado.
            </strong>{" "}
            Nosso objetivo é garantir o funcionamento ininterrupto do seu
            negócio
          </p>
          <ul className="list-disc list-inside mt-8 text-[19px] pl-8">
            <li>
              <span className="text-[#FFD700] font-medium">Suporte total:</span>{" "}
              Sistemas, Equipamentos e Rede
            </li>
            <li>
              <span className="text-[#FFD700] font-medium">
                Suporte imediato:
              </span>{" "}
              Disponibilidade 365 dias por ano, das 8h à meia-noite, por
              Telefone e Whatsapp
            </li>
            <li>
              <span className="text-[#FFD700] font-medium">
                Suporte presencial:
              </span>{" "}
              Manutenção Corretiva e Preventiva
            </li>
            <li>
              <span className="text-[#FFD700] font-medium">
                Suporte emergencial:
              </span>{" "}
              Resolução Rápida de Emergências e Empréstimo de Equipamentos
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Suporte;
