import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header"; // Importar o componente Header
import {
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share"; // Importar componentes de compartilhamento

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [show, setShow] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar a página atual
  const postsPerPage = 8; // Número de posts por página

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  };

  const getExcerpt = (html, maxLength = 100) => {
    const text = stripHtml(html);
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        console.log(response.data); // Adicione este log para verificar os dados recebidos
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Definir o carregamento como falso após a tentativa de buscar os posts
      }
    };

    fetchPosts();
  }, []);

  const handleShow = (post) => {
    setSelectedPost(post);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedPost(null);
  };

  // Calcular os posts a serem exibidos na página atual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header className="mb-8 font-poppins" />{" "}
      {/* Usar o componente Header com margem inferior */}
      <div
        className={`bg-[#8DD926] min-h-screen font-poppins transition-all duration-500 ease-in-out ${
          show ? "blur-sm" : ""
        }`}
      >
        {" "}
        {/* Adicionar background color e desfocar quando o modal estiver aberto */}
        <div className="max-w-screen-xl p-5 mx-auto bg-[#8DD926] dark:text-gray-800">
          <h1 className="text-4xl font-bold text-center mb-8 mt-20">
            BLOG ZOLV
          </h1>
          {loading ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="relative flex items-end justify-start w-full text-left bg-center bg-cover h-96 cursor-pointer transition duration-300 ease-in-out transform hover:brightness-75 rounded-lg shadow-lg bg-gray-300 animate-pulse"
                >
                  <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black opacity-50 rounded-lg"></div>
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
                    <div className="w-24 h-6 bg-gray-400 rounded"></div>
                    <div className="flex flex-col justify-start text-center text-white">
                      <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="z-10 p-5">
                    <div className="w-full h-6 bg-gray-400 rounded mb-2"></div>
                    <div className="w-3/4 h-6 bg-gray-400 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 sm:grid-cols-2">
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <div
                    key={post._id}
                    className="relative flex items-end justify-start w-full text-left bg-center bg-cover h-96 cursor-pointer transition duration-300 ease-in-out transform hover:brightness-75 rounded-lg shadow-lg"
                    style={{
                      backgroundImage: post.imageUrl
                        ? `url(${post.imageUrl})`
                        : "none",
                      backgroundColor: post.imageUrl
                        ? "transparent"
                        : "#4A5568", // Dark gray background if no image
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)", // Adicionar sombra preta
                    }}
                    onClick={() => handleShow(post)}
                  >
                    <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black opacity-50 rounded-lg"></div>
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
                      <span
                        className="px-3 py-2 text-xs font-semibold tracking-wider uppercase text-white bg-violet-600 rounded max-w-[50%]"
                      >
                        {post.title}
                      </span>
                      <div className="flex flex-col justify-start text-center text-white">
                        <span
                          className="text-3xl font-semibold leading-none tracking-wide"
                          style={{ textShadow: "1px 1px 2px black" }} // Adicionar contorno preto
                        >
                          {new Date(post.createdAt).getDate()}
                        </span>
                        <span
                          className="leading-none uppercase"
                          style={{ textShadow: "1px 1px 2px black" }} // Adicionar contorno preto
                        >
                          {new Date(post.createdAt)
                            .toLocaleString("default", {
                              month: "short",
                            })
                            .replace(".", "")}
                        </span>
                        <span
                          className="leading-none uppercase"
                          style={{ textShadow: "1px 1px 2px black" }} // Adicionar contorno preto
                        >
                          {new Date(post.createdAt).getFullYear()}
                        </span>
                      </div>
                    </div>
                    <div className="z-10 p-5">
                      <p
                        className="font-medium text-md text-white"
                        style={{ textShadow: "1px 1px 2px black" }} // Adicionar contorno preto
                      >
                        {getExcerpt(post.content, 100)}
                      </p>
                      <p
                        className="text-sm text-white mt-2"
                        style={{ textShadow: "1px 1px 2px black" }} // Adicionar contorno preto
                      >
                        Postado por Zolv
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Sem posts disponíveis</p>
              )}
            </div>
          )}
          {/* Paginação */}
          <div className="flex justify-center mt-8">
            {Array.from({
              length: Math.ceil(posts.length / postsPerPage),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedPost && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            show ? "block" : "hidden"
          }`}
        >
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-10/12 md:w-3/4 lg:w-2/3 max-h-screen font-poppins">
            {/* Fundo cinza escuro */}
            <div
              className="flex justify-between items-center p-4 border-b"
              style={{ backgroundColor: "#0F172A" }} // Azul mais escuro
            >
              <h2 className="text-xl text-white text-center w-full uppercase">
                {selectedPost.title}
              </h2>
              <button
                className="text-gray-300 hover:text-gray-500 ml-auto"
                onClick={handleClose}
              >
                &times;
              </button>
            </div>
            <div className="bg-white p-8 overflow-y-auto max-h-[70vh] text-center text-black">
              <img
                src={selectedPost.imageUrl || "https://via.placeholder.com/150"}
                alt="Post"
                className="mb-4 mx-auto"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <div className="flex flex-col items-center mb-4">
                <p className="font-poppins text-sm text-gray-400 mb-2 text-center italic">
                  Compartilhar post
                </p>
                <div className="flex justify-center">
                  <FacebookShareButton
                    url={`http://localhost:3000/posts/${selectedPost._id}`}
                    quote={selectedPost.title}
                    hashtag="http://localhost:3000/blog"
                    className="ml-4 mr-4"
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <EmailShareButton
                    url={`http://localhost:3000/posts/${selectedPost._id}`}
                    subject="Confira este post no Blog Zolv"
                    className="mr-4"
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                  <WhatsappShareButton
                    url={`http://localhost:3000/posts/${selectedPost._id}`}
                    title={selectedPost.title}
                    separator=" - "
                    className="mr-4"
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
              </div>
              <div
                className="text-left text-lg font-poppins"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </div>
            <div
              className="flex justify-between items-center p-4 border-t"
              style={{ backgroundColor: "#0F172A" }} // Azul mais escuro
            >
              <p className="text-white text-sm">
                Postado por Zolv em{" "}
                {new Date(selectedPost.createdAt).toLocaleDateString("pt-BR")}{" "}
                às{" "}
                {new Date(selectedPost.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-800"
                onClick={handleClose}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;
