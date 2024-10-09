import React from "react";
import banner from "../assets/images/banner.png"; // Importar a imagem diretamente

const Info = () => {
  return (
    <>
      <section className="bg-[#8DD926] py-16 mt-20">
        {" "}
        {/* Reduzir padding inferior */}
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-12">
              {" "}
              {/* Aumentar margem à direita */}
              <div className="text-[#343950] font-poppins text-6xl font-medium mb-5 leading-tight">
                {" "}
                {/* Alterar para text-6xl e font-medium */}
                <p className="leading-tight">
                  {" "}
                  {/* Diminuir espaçamento entre linhas */}
                  Soluções pensadas para o{" "}
                  <span className="font-medium">
                    sucesso do seu negócio
                  </span>{" "}
                  {/* Alterar para font-medium */}
                </p>
              </div>
              <div className="text-[#343950] font-poppins text-lg mb-5">
                <p>
                  Ideal para restaurantes, bares e casas noturnas que buscam uma
                  operação mais eficiente e inovadora.
                </p>
              </div>
              <div className="flex space-x-4">
                <button className="bg-[#343950] text-white font-poppins font-medium rounded-full py-4 px-6 w-1/2 transition-colors duration-300 ease-in-out hover:bg-[#2C2F45]">
                  {" "}
                  {/* Restaurar largura para w-1/2 */}
                  QUERO CONHECER
                </button>
                <button className="bg-[#8DD926] text-[#343950] border border-[#343950] font-poppins font-medium rounded-full py-4 px-6 w-1/2 transition-colors duration-300 ease-in-out hover:bg-[#6BBF24] hover:text-white">
                  {" "}
                  {/* Restaurar largura para w-1/2 */}
                  SEJA NOSSO PARCEIRO
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <img src={banner} alt="Banner" className="h-auto" />{" "}
              {/* Remover w-full para manter o tamanho original */}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#8DD926] pt-8 pb-24">
        {" "}
        {/* Reduzir padding superior */}
        <div className="container mx-auto px-4 text-center">
          {" "}
          {/* Centralizar o texto */}
          <h2 className="text-[#343950] font-poppins font-normal text-[36px] leading-tight">
            {" "}
            {/* Título com fonte Poppins, peso 500, tamanho 36px */}
            Precisa de mais informação?
          </h2>
          <p className="text-[#343950] font-poppins text-lg leading-tight">
            {" "}
            {/* Texto menor, mesma cor, centralizado */}
            Preencha o formulário abaixo que entraremos em contato com você
          </p>
          <form className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Estabelecimento"
                  className="w-full p-4 border-none rounded-lg shadow-md"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="E-mail*"
                  className="w-full p-4 border-none rounded-lg shadow-md"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Nome*"
                  className="w-full p-4 border-none rounded-lg shadow-md"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Celular - apenas números"
                  className="w-full p-4 border-none rounded-lg shadow-md"
                  pattern="\(\d{2}\) \d{5}-\d{4}"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#343950] text-white font-poppins font-medium rounded-full py-4 px-6 w-full mt-8 transition-colors duration-300 ease-in-out hover:bg-[#2C2F45]"
            >
              QUERO CONHECER
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Info;
