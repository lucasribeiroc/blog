import React from "react";
import computador from "../assets/images/computador.png"; // Importar a imagem diretamente

const QuemSomos = () => {
  return (
    <section id="quem-somos" className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <img src={computador} alt="Computador" className="w-full h-auto" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-[#8DD926] font-poppins font-medium text-[20px] mb-12 tracking-[.25em]">
              Quem somos
            </h2>
            <p className="text-[#343950] font-poppins text-[40px] mb-6">
              A alternativa para otimizar seus processos
            </p>
            <p className="text-[#343950] font-poppins text-[18px] mb-8">
              A PDVSeven é sua parceira ideal para Restaurantes, Bares e Casas
              de Show, otimizando processos, padronizando operações e elevando a
              satisfação dos clientes.
            </p>
            <p className="text-[#343950] font-poppins text-[18px] mb-3">
              Oferecemos controle total de pedidos, caixa, produção e estoque.
              Somos uma empresa full service que garante o funcionamento ideal
              da sua operação, impulsionando seus resultados e melhorando a
              rentabilidade do seu negócio.
            </p>
            <button className="bg-[#8DD926] text-[#343950] font-poppins font-semibold rounded-full py-4 px-6 mt-6 w-1/2 transition-colors duration-300 ease-in-out hover:bg-[#6BBF24]">
              QUERO CONHECER
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuemSomos;
