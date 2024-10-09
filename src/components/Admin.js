import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importar ícones de olho
import logo from "../assets/images/logo.png"; // Importar a imagem diretamente

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para visibilidade da senha
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        }
      );
      setToken(response.data.token);
      setIsAuthenticated(true);
      navigate("/admin"); // Redirecionar para a página de administração
    } catch (error) {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken("");
    navigate("/admin"); // Redirecionar para a página de login
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (image && image.size > 250 * 1024) {
      alert("A imagem deve ter menos de 250KB");
      return;
    }
    if (image && !["image/jpeg", "image/png"].includes(image.type)) {
      alert("Somente imagens JPEG ou PNG são permitidas");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Post adicionado com sucesso");
      setTitle("");
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("Erro adicionando post:", error.response || error.message);
      alert("Erro adicionando post");
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
    setImage(null);
    document.getElementById("image-upload").value = null;
  };

  return (
    <div>
      <header className="bg-gray-100 p-4 mb-4 flex justify-between items-center">
        <div className="container mx-auto flex justify-center items-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Sair
          </button>
        )}
      </header>
      <div className="container mx-auto text-center mb-4">
        <h1 className="text-3xl">
          {isAuthenticated ? "Blog - Postar" : "Login Blog"}
        </h1>
      </div>
      {!isAuthenticated ? (
        <div className="container mx-auto">
          <form
            onSubmit={handleLogin}
            className="text-center flex flex-col items-center"
          >
            <div className="mb-4 flex flex-col items-start">
              <label className="mb-1">Usuário:</label>
              <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 border border-gray-300 rounded w-64"
              />
            </div>
            <div className="mb-4 flex flex-col items-start relative">
              <label className="mb-1">Senha:</label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border border-gray-300 rounded w-64 pr-10"
              />
              <span
                className="absolute right-2 top-10 cursor-pointer"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 w-64"
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="container mx-auto">
          <form
            onSubmit={handleAddPost}
            className="text-center flex flex-col items-center"
          >
            <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
              <label className="mb-1">Título:</label>
              <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
              <label className="mb-1">Conteúdo:</label>
              <textarea
                placeholder="Conteúdo"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
                rows={10} // Aumentar em 5 linhas do padrão (5 linhas)
                style={{ resize: "none" }} // Desabilitar redimensionamento
              />
            </div>
            <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
              <label className="mb-1">Imagem:</label>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => setImage(e.target.files[0])}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="flex w-full max-w-2xl justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 w-2/5"
              >
                Postar
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 w-2/5"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
