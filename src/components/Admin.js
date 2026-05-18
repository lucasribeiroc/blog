import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBold,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaItalic,
  FaListUl,
  FaQuoteRight,
  FaUnderline,
} from "react-icons/fa";
import logo from "../assets/images/logo.png"; // Importar a imagem diretamente

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para visibilidade da senha
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const editorRef = useRef(null);
  const editEditorRef = useRef(null);
  const contentImageInputRef = useRef(null);
  const editContentImageInputRef = useRef(null);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts");
      setPosts(response.data || []);
    } catch (error) {
      console.error("Erro carregando posts:", error.response || error.message);
    }
  };

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
        },
      });
      alert("Post adicionado com sucesso");
      setTitle("");
      setContent("");
      setImage(null);
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      document.getElementById("image-upload").value = null;
      fetchPosts();
    } catch (error) {
      console.error("Erro adicionando post:", error.response || error.message);
      alert("Erro adicionando post");
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
    setImage(null);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    document.getElementById("image-upload").value = null;
  };

  const handleSelectPost = (postId) => {
    setSelectedPostId(postId);
    const post = posts.find((item) => item._id === postId) || null;
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.content);
      setEditImage(null);
      if (editEditorRef.current) {
        editEditorRef.current.innerHTML = post.content || "";
      }
    } else {
      setEditTitle("");
      setEditContent("");
      setEditImage(null);
      if (editEditorRef.current) {
        editEditorRef.current.innerHTML = "";
      }
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!selectedPostId) {
      alert("Selecione um post para editar");
      return;
    }
    if (editImage && editImage.size > 250 * 1024) {
      alert("A imagem deve ter menos de 250KB");
      return;
    }
    if (editImage && !["image/jpeg", "image/png"].includes(editImage.type)) {
      alert("Somente imagens JPEG ou PNG são permitidas");
      return;
    }

    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("content", editContent);
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      await axios.put(`http://localhost:5000/api/posts/${selectedPostId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post atualizado com sucesso");
      fetchPosts();
    } catch (error) {
      console.error("Erro atualizando post:", error.response || error.message);
      alert("Erro atualizando post");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Tem certeza que deseja excluir este post?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post excluído com sucesso");
      if (postId === selectedPostId) {
        setSelectedPostId("");
        setEditTitle("");
        setEditContent("");
        setEditImage(null);
      }
      fetchPosts();
    } catch (error) {
      console.error("Erro excluindo post:", error.response || error.message);
      alert("Erro excluindo post");
    }
  };

  const applyFormat = (command, value = null, targetRef = editorRef, setter = setContent) => {
    if (!targetRef.current) return;
    document.execCommand(command, false, value);
    setter(targetRef.current.innerHTML);
    targetRef.current.focus();
  };

  const handleInsertImage = () => {
    contentImageInputRef.current?.click();
  };

  const handleInsertImageEdit = () => {
    editContentImageInputRef.current?.click();
  };

  const handleContentImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("A imagem de conteúdo deve ter menos de 500KB");
      e.target.value = null;
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Somente imagens JPEG ou PNG são permitidas para o conteúdo");
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (dataUrl) {
        applyFormat("insertImage", dataUrl, editorRef, setContent);
      }
      e.target.value = null;
    };
    reader.readAsDataURL(file);
  };

  const handleEditContentImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("A imagem de conteúdo deve ter menos de 500KB");
      e.target.value = null;
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Somente imagens JPEG ou PNG são permitidas para o conteúdo");
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (dataUrl) {
        applyFormat("insertImage", dataUrl, editEditorRef, setEditContent);
      }
      e.target.value = null;
    };
    reader.readAsDataURL(file);
  };

  const handleEditorInput = () => {
    setContent(editorRef.current ? editorRef.current.innerHTML : "");
  };

  const handleEditEditorInput = () => {
    setEditContent(editEditorRef.current ? editEditorRef.current.innerHTML : "");
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
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <button
                type="button"
                onClick={() => setActiveTab("create")}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  activeTab === "create"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-slate-700 hover:bg-gray-300"
                }`}
              >
                Novo post
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  activeTab === "edit"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-slate-700 hover:bg-gray-300"
                }`}
              >
                Editar post
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("delete")}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  activeTab === "delete"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-slate-700 hover:bg-gray-300"
                }`}
              >
                Excluir post
              </button>
            </div>

            {activeTab === "create" && (
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
                  <label className="mb-1 font-semibold text-left w-full">Conteúdo:</label>
                  <div className="w-full rounded-3xl border border-gray-200 bg-slate-50 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-white rounded-t-3xl">
                      <button
                        type="button"
                        onClick={() => applyFormat("bold", null, editorRef, setContent)}
                        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                        title="Negrito"
                      >
                        <FaBold />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormat("italic", null, editorRef, setContent)}
                        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                        title="Itálico"
                      >
                        <FaItalic />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormat("underline", null, editorRef, setContent)}
                        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                        title="Sublinhado"
                      >
                        <FaUnderline />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormat("formatBlock", "blockquote", editorRef, setContent)}
                        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                        title="Citação"
                      >
                        <FaQuoteRight />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormat("insertUnorderedList", null, editorRef, setContent)}
                        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                        title="Lista"
                      >
                        <FaListUl />
                      </button>
                      <button
                        type="button"
                        onClick={handleInsertImage}
                        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                        title="Inserir imagem"
                      >
                        <FaImage />
                      </button>
                    </div>
                    <input
                      ref={contentImageInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={handleContentImageChange}
                    />
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleEditorInput}
                      className="min-h-[280px] w-full rounded-b-3xl bg-white p-4 text-left text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-300"
                      style={{ whiteSpace: "pre-wrap", overflowY: "auto" }}
                    >
                      {content ? null : (
                        <div className="text-gray-400">Digite o conteúdo do post aqui...</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
                  <label className="mb-1">Imagem de capa:</label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="flex w-full max-w-2xl justify-between mb-8">
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
            )}

            {activeTab === "edit" && (
              <div className="text-center flex flex-col items-center">
                <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
                  <label className="mb-1">Selecione um post para editar:</label>
                  <select
                    value={selectedPostId}
                    onChange={(e) => handleSelectPost(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  >
                    <option value="">-- Selecione --</option>
                    {posts.map((post) => (
                      <option key={post._id} value={post._id}>
                        {post.title}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedPostId ? (
                  <form
                    onSubmit={handleUpdatePost}
                    className="w-full flex flex-col items-center"
                  >
                    <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
                      <label className="mb-1">Título:</label>
                      <input
                        type="text"
                        placeholder="Título"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
                      <label className="mb-1 font-semibold text-left w-full">Conteúdo:</label>
                      <div className="w-full rounded-3xl border border-gray-200 bg-slate-50 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-white rounded-t-3xl">
                          <button
                            type="button"
                            onClick={() => applyFormat("bold", null, editEditorRef, setEditContent)}
                            className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                            title="Negrito"
                          >
                            <FaBold />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyFormat("italic", null, editEditorRef, setEditContent)}
                            className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                            title="Itálico"
                          >
                            <FaItalic />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyFormat("underline", null, editEditorRef, setEditContent)}
                            className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                            title="Sublinhado"
                          >
                            <FaUnderline />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyFormat("formatBlock", "blockquote", editEditorRef, setEditContent)}
                            className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                            title="Citação"
                          >
                            <FaQuoteRight />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyFormat("insertUnorderedList", null, editEditorRef, setEditContent)}
                            className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                            title="Lista"
                          >
                            <FaListUl />
                          </button>
                          <button
                            type="button"
                            onClick={handleInsertImageEdit}
                            className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:border-green-400 hover:text-green-600"
                            title="Inserir imagem"
                          >
                            <FaImage />
                          </button>
                        </div>
                        <input
                          ref={editContentImageInputRef}
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          onChange={handleEditContentImageChange}
                        />
                        <div
                          ref={editEditorRef}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={handleEditEditorInput}
                          className="min-h-[280px] w-full rounded-b-3xl bg-white p-4 text-left text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-300"
                          style={{ whiteSpace: "pre-wrap", overflowY: "auto" }}
                        >
                          {editContent ? null : (
                            <div className="text-gray-400">Digite o conteúdo do post aqui...</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
                      <label className="mb-1">Imagem de capa (opcional):</label>
                      <input
                        id="edit-image-upload"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => setEditImage(e.target.files[0])}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div className="flex w-full max-w-2xl justify-between mb-8">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 w-2/5"
                      >
                        Atualizar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPost(selectedPostId)}
                        className="bg-gray-300 text-slate-700 font-semibold py-2 px-4 rounded hover:bg-gray-400 w-2/5"
                      >
                        Redefinir
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-slate-600">Selecione um post para carregar os dados de edição.</p>
                )}
              </div>
            )}

            {activeTab === "delete" && (
              <div className="flex flex-col items-center gap-4 w-full">
                {posts.length === 0 ? (
                  <p className="text-slate-600">Nenhum post disponível para excluir.</p>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post._id}
                      className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">{post.title}</p>
                          <p className="text-slate-500 text-sm">
                            {new Date(post.createdAt).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post._id)}
                          className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-700"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
