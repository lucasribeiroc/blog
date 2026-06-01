import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const apiBase = process.env.REACT_APP_API_URL || "/blog";

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
  const [editorFocused, setEditorFocused] = useState(false);
  const [editEditorFocused, setEditEditorFocused] = useState(false);
  const quillRef = useRef(null);
  const editQuillRef = useRef(null);
  const [editorFormats, setEditorFormats] = useState({});
  const [editEditorFormats, setEditEditorFormats] = useState({});
  const [tagsList, setTagsList] = useState([]); // available tags from backend
  const [selectedTags, setSelectedTags] = useState([]); // for create
  const [editSelectedTags, setEditSelectedTags] = useState([]); // for edit
  const [tagInput, setTagInput] = useState("");
  const [editTagInput, setEditTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showEditTagSuggestions, setShowEditTagSuggestions] = useState(false);
  const contentImageInputRef = useRef(null);
  const editContentImageInputRef = useRef(null);
  const imageUploadRef = useRef(null);
  const editImageUploadRef = useRef(null);
  const navigate = useNavigate(); // Hook para navegação

  // Inject small CSS to ensure Quill editor fills the container
  useEffect(() => {
    const styleId = "admin-quill-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .custom-quill .ql-editor { min-height: 280px; padding: 1rem; }
      .custom-quill .ql-container { height: 100% !important; }
    `;
    document.head.appendChild(style);
  }, []);

  // Attach listeners to update active formats for toolbar buttons
  useEffect(() => {
    const attach = (ref, setFormats) => {
      const tryAttach = () => {
        const q = ref.current;
        if (!q) return false;
        const editor = q.getEditor();
        if (!editor) return false;

        const update = () => {
          const range = editor.getSelection();
          if (range) {
            setFormats(editor.getFormat(range));
          } else {
            setFormats({});
          }
        };

        editor.on("selection-change", update);
        editor.on("text-change", update);
        update();
        return true;
      };

      if (!tryAttach()) {
        const id = setInterval(() => {
          if (tryAttach()) clearInterval(id);
        }, 100);
      }
    };

    attach(quillRef, setEditorFormats);
    attach(editQuillRef, setEditEditorFormats);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  // load token from sessionStorage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem("admin_token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // clear token when leaving the admin page (component unmount)
  useEffect(() => {
    const cleanup = () => {
      try {
        sessionStorage.removeItem("admin_token");
      } catch (e) {
        // ignore
      }
    };

    // remove token if the page is unloaded (tab closed or refreshed)
    window.addEventListener("beforeunload", cleanup);

    return () => {
      cleanup();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchPosts();
    fetchTags();
  }, [isAuthenticated]);

  // always fetch tags on mount so suggestions show even before admin login
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${apiBase}/api/posts?t=${Date.now()}`);
      setPosts(response.data || []);
    } catch (error) {
      console.error("Erro carregando posts:", error.response || error.message);
    }
  };

  const fetchTags = async () => {
    const url = `${apiBase}/api/tags?t=${Date.now()}`;
    try {
      const res = await axios.get(url);
      setTagsList(res.data || []);
    } catch (err) {
      console.error("Erro carregando tags", err, {
        configUrl: err?.config?.url,
        responseUrl: err?.response?.request?.responseURL,
        status: err?.response?.status,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiBase}/api/auth/login`,
        {
          username,
          password,
        }
      );
      setToken(response.data.token);
      localStorage.setItem("admin_token", response.data.token);
      setIsAuthenticated(true);
      navigate("/admin"); // Redirecionar para a página de administração
    } catch (error) {
      console.error("Login error:", error?.response?.status, error?.response?.data || error?.message);
      alert(error?.response?.data?.message || "Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken("");
    localStorage.removeItem("admin_token");
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
    // include tags as array of names
    if (selectedTags && selectedTags.length > 0) {
      const names = selectedTags.map((t) => t.name || String(t));
      formData.append("tags", JSON.stringify(names));
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post(`${apiBase}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post adicionado com sucesso");
      setTitle("");
      setContent("");
      setImage(null);
      setSelectedTags([]);
      setTagInput("");
      setShowTagSuggestions(false);
      if (quillRef.current) {
        const ed = quillRef.current.getEditor();
        ed.setContents([]);
      }
      if (imageUploadRef.current) imageUploadRef.current.value = null;
      fetchPosts();
      // refresh tags so suggestions include newly created tags
      try { await fetchTags(); } catch (e) { /* ignore */ }
    } catch (error) {
      console.error("Erro adicionando post:", error.response || error.message);
      alert("Erro adicionando post");
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setSelectedTags([]);
    setTagInput("");
    setShowTagSuggestions(false);
    if (quillRef.current) {
      const ed = quillRef.current.getEditor();
      ed.setContents([]);
    }
    if (imageUploadRef.current) imageUploadRef.current.value = null;
  };

  const handleSelectPost = (postId) => {
    setSelectedPostId(postId);
    const post = posts.find((item) => item._id === postId) || null;
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.content);
      setEditImage(null);
      setEditSelectedTags(post.tags || []);
      if (editQuillRef.current) {
        const ed = editQuillRef.current.getEditor();
        ed.clipboard.dangerouslyPasteHTML(post.content || "");
      }
    } else {
      setEditTitle("");
      setEditContent("");
      setEditImage(null);
      setEditSelectedTags([]);
      if (editQuillRef.current) {
        const ed = editQuillRef.current.getEditor();
        ed.setContents([]);
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
    if (editSelectedTags && editSelectedTags.length > 0) {
      const names = editSelectedTags.map((t) => t.name || String(t));
      formData.append("tags", JSON.stringify(names));
    }
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      await axios.put(`${apiBase}/api/posts/${selectedPostId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post atualizado com sucesso");
      fetchPosts();
      try { await fetchTags(); } catch (e) { /* ignore */ }
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
      await axios.delete(`${apiBase}/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post excluído com sucesso");
      // remove post from local state immediately so UI updates without reload
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      if (postId === selectedPostId) {
        setSelectedPostId("");
        setEditTitle("");
        setEditContent("");
        setEditImage(null);
      }
      // signal other tabs/pages to refresh their posts lists
      try {
        localStorage.setItem("posts_updated", String(Date.now()));
      } catch (e) { /* ignore */ }
      try {
        // also dispatch an event in the same window so SPA routes update immediately
        window.dispatchEvent(new Event("posts_updated"));
      } catch (e) { /* ignore */ }
      // signal the deleted post ID to other tabs so they can remove it locally
      try {
        localStorage.setItem("post_deleted", postId);
      } catch (e) { /* ignore */ }
      // refresh local state from server to guarantee deletion is reflected
      await fetchPosts();
    } catch (error) {
      console.error("Erro excluindo post:", error.response || error.message);
      alert("Erro excluindo post");
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tag?")) {
      return;
    }

    try {
      await axios.delete(`${apiBase}/api/tags/${tagId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Tag excluída com sucesso");
      // update local state immediately so the tag disappears from the UI
      setTagsList((prev) => prev.filter((t) => t._id !== tagId));
      // also remove tag references from local posts state so delete view updates
      setPosts((prevPosts) => prevPosts.map((p) => ({
        ...p,
        tags: (p.tags || []).filter((tg) => tg._id !== tagId),
      })));
      // signal other tabs/pages to refresh their posts/tags lists
      try {
        localStorage.setItem("posts_updated", String(Date.now()));
      } catch (e) { /* ignore */ }
      try {
        // also dispatch an event in the same window so SPA routes update immediately
        window.dispatchEvent(new Event("posts_updated"));
      } catch (e) { /* ignore */ }
      // signal the deleted tag ID to other tabs so they can remove it locally
      try {
        localStorage.setItem("tag_deleted", tagId);
      } catch (e) { /* ignore */ }
      // refresh local state from server to guarantee deletion is reflected
      await fetchTags();
      await fetchPosts();
    } catch (error) {
      console.error("Erro excluindo tag:", error.response || error.message);
      alert("Erro excluindo tag");
    }
  };

  const applyFormat = (command, value = null, targetQuillRef = quillRef, setter = setContent, toggle = true) => {
    if (!targetQuillRef?.current) return;
    const editor = targetQuillRef.current.getEditor();
    if (!editor) return;

    editor.focus();
    const selection = editor.getSelection(true);
    const range = selection || { index: 0, length: 0 };
    const current = editor.getFormat(range) || editor.getFormat();

    // Inline formats (toggle)
    if (command === "bold" || command === "italic" || command === "underline") {
      const fmt = command;
      editor.format(fmt, !current[fmt]);
      setter(editor.root.innerHTML);
      return;
    }

    // Block quote toggle
    if (command === "formatBlock" && value === "blockquote") {
      const active = !!current.blockquote;
      editor.format("blockquote", !active);
      setter(editor.root.innerHTML);
      return;
    }

    // Unordered list toggle
    if (command === "insertUnorderedList") {
      const isList = current.list === "bullet";
      editor.format("list", isList ? false : "bullet");
      setter(editor.root.innerHTML);
      return;
    }

    // Header toggle for H1 / H2 / H3
    if (command === "header") {
      if (toggle) {
        const isActiveHeader = current.header === value;
        editor.format("header", isActiveHeader ? false : value);
      } else {
        editor.format("header", value);
      }
      setter(editor.root.innerHTML);
      return;
    }

    // Align toggle
    if (command === "align") {
      const isActiveAlign = current.align === value;
      editor.format("align", isActiveAlign ? false : value);
      setter(editor.root.innerHTML);
      return;
    }

    // Fallback: try to apply as format
    try {
      editor.format(command, value);
      setter(editor.root.innerHTML);
    } catch (e) {
      // ignore
    }
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
      if (dataUrl && quillRef.current) {
        const ed = quillRef.current.getEditor();
        const range = ed.getSelection(true) || { index: ed.getLength(), length: 0 };
        ed.insertEmbed(range.index, "image", dataUrl);
        ed.setSelection(range.index + 1);
        setContent(ed.root.innerHTML);
      }
      e.target.value = null;
    };
    reader.readAsDataURL(file);
  };

  // Tag helpers
  const createTagOnServer = async (name) => {
    const url = `${apiBase}/api/tags`;
    try {
      const res = await axios.post(url, { name }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const created = res.data;
      // add to tagsList if not present
      setTagsList((s) => {
        if (s.find((t) => t._id === created._id || t.name === created.name)) return s;
        return [...s, created].sort((a, b) => a.name.localeCompare(b.name));
      });
      return created;
    } catch (err) {
      console.error("Erro criando tag no servidor", err.response || err.message, { configUrl: err?.config?.url, responseUrl: err?.response?.request?.responseURL });
      // fallback to local object
      return { name: name.trim(), color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}` };
    }
  };

  const addTagByName = async (name, forEdit = false) => {
    const trimmed = String(name || "").trim();
    if (!trimmed) return;
    let existing = tagsList.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
    let tagObj = existing;
    if (!existing) {
      if (!token) {
        alert("Você precisa estar logado para criar novas tags. Faça login e tente novamente.");
        return;
      }
      tagObj = await createTagOnServer(trimmed);
    }
    if (forEdit) {
      if (!editSelectedTags.find((t) => (t._id && tagObj._id && t._id === tagObj._id) || t.name === tagObj.name)) {
        setEditSelectedTags((s) => [...s, tagObj]);
      }
      setEditTagInput("");
      setShowEditTagSuggestions(false);
    } else {
      if (!selectedTags.find((t) => (t._id && tagObj._id && t._id === tagObj._id) || t.name === tagObj.name)) {
        setSelectedTags((s) => [...s, tagObj]);
      }
      setTagInput("");
      setShowTagSuggestions(false);
    }
  };

  const removeTagAt = (index, forEdit = false) => {
    if (forEdit) {
      setEditSelectedTags((s) => s.filter((_, i) => i !== index));
    } else {
      setSelectedTags((s) => s.filter((_, i) => i !== index));
    }
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
      if (dataUrl && editQuillRef.current) {
        const ed = editQuillRef.current.getEditor();
        const range = ed.getSelection(true) || { index: ed.getLength(), length: 0 };
        ed.insertEmbed(range.index, "image", dataUrl);
        ed.setSelection(range.index + 1);
        setEditContent(ed.root.innerHTML);
      }
      e.target.value = null;
    };
    reader.readAsDataURL(file);
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
              <button
                type="button"
                onClick={() => setActiveTab("deleteTag")}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  activeTab === "deleteTag"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-slate-700 hover:bg-gray-300"
                }`}
              >
                Excluir tag
              </button>
              <button
                type="button"
                onClick={() => window.open("https://www.usezolv.com/blog", "_blank")}
                className="px-4 py-2 rounded-full font-semibold transition bg-blue-600 text-white hover:bg-blue-700"
              >
                Ver blog
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
                  <label className="mb-1 font-semibold text-left w-full">Tags (opcional):</label>
                  <div className="mb-2 w-full rounded-2xl border border-gray-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedTags.map((t, idx) => (
                        <div key={t._id || t.name + idx} style={{ background: t.color || "#9CA3AF" }} className="text-white px-3 py-1 rounded-xl text-xs font-semibold uppercase flex items-center gap-2">
                          <span>{t.name}</span>
                          <button type="button" onClick={() => removeTagAt(idx)} className="ml-1">×</button>
                        </div>
                      ))}
                      <div className="relative flex-1 min-w-[240px]">
                        <input
                          value={tagInput}
                          onChange={(e) => { setTagInput(e.target.value); setShowTagSuggestions(true); }}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter" || e.key === ",") {
                              e.preventDefault();
                              await addTagByName(tagInput, false);
                            }
                          }}
                          onFocus={() => setShowTagSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowTagSuggestions(false), 150)}
                          placeholder="Adicionar tag..."
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        {(showTagSuggestions) && (
                          <div className="absolute z-10 bg-white border mt-1 rounded-lg shadow max-h-40 overflow-auto w-full">
                            {tagsList
                              .filter((t) => t.name.toLowerCase().includes((tagInput || "").toLowerCase()) && !selectedTags.find(st => st.name === t.name))
                              .map((t) => (
                                <div key={t._id}
                                     onMouseDown={async (e) => { e.preventDefault(); await addTagByName(t.name, false); }}
                                     className="p-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2 rounded-lg">
                                  <span style={{ width: 12, height: 12, background: t.color }} className="rounded-full inline-block" />
                                  <span className="uppercase">{t.name}</span>
                                </div>
                              ))}
                            {/* allow creating new if nothing matches */}
                            {!tagsList.some(t => t.name.toLowerCase() === (tagInput || "").toLowerCase()) && (tagInput || "").trim() !== "" && (
                              <div onMouseDown={async (e) => { e.preventDefault(); await addTagByName(tagInput, false); }} className="p-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2 rounded-lg">
                                <span className="text-sm text-slate-600 uppercase">Criar "{tagInput}"</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full rounded-3xl border border-gray-200 bg-slate-50 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-white rounded-t-3xl">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormat("bold", null, quillRef, setContent)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editorFormats.bold ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                        title="Negrito"
                      >
                        <FaBold />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormat("italic", null, quillRef, setContent)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editorFormats.italic ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                        title="Itálico"
                      >
                        <FaItalic />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormat("underline", null, quillRef, setContent)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editorFormats.underline ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                        title="Sublinhado"
                      >
                        <FaUnderline />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormat("align", "left", quillRef, setContent)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${(editorFormats.align === 'left' || !editorFormats.align) ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                        title="Alinhar à esquerda"
                      >
                        <FaAlignLeft />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormat("align", "center", quillRef, setContent)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editorFormats.align === 'center' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                        title="Centralizar"
                      >
                        <FaAlignCenter />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormat("align", "right", quillRef, setContent)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editorFormats.align === 'right' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                        title="Alinhar à direita"
                      >
                        <FaAlignRight />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormat("align", "justify", quillRef, setContent)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editorFormats.align === 'justify' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                        title="Justificar"
                      >
                        <FaAlignJustify />
                      </button>
                      <select
                        value={editorFormats.header || ""}
                        onChange={(e) => applyFormat("header", e.target.value ? parseInt(e.target.value, 10) : false, quillRef, setContent, false)}
                        className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-slate-600"
                        title="Título"
                      >
                        <option value="">Normal</option>
                        <option value="1">H1</option>
                        <option value="2">H2</option>
                        <option value="3">H3</option>
                        <option value="4">H4</option>
                        <option value="5">H5</option>
                        <option value="6">H6</option>
                      </select>
                      <select
                        value={editorFormats.font || ""}
                        onChange={(e) => applyFormat("font", e.target.value || false, quillRef, setContent)}
                        className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-slate-600"
                        title="Fonte"
                      >
                        <option value="">Padrão</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                      </select>
                      <select
                        value={editorFormats.size || ""}
                        onChange={(e) => applyFormat("size", e.target.value || false, quillRef, setContent)}
                        className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-slate-600"
                        title="Tamanho"
                      >
                        <option value="">Normal</option>
                        <option value="small">Pequena</option>
                        <option value="large">Grande</option>
                        <option value="huge">Maior</option>
                      </select>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormat("formatBlock", "blockquote", quillRef, setContent)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editorFormats.blockquote ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                        title="Citação"
                      >
                        <FaQuoteRight />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormat("insertUnorderedList", null, quillRef, setContent)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${(editorFormats.list === 'bullet') ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                        title="Lista"
                      >
                        <FaListUl />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handleInsertImage}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
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
                      <div className="relative">
                        {!content && !editorFocused && (
                          <div className="pointer-events-none absolute inset-0 flex items-start p-4 text-gray-400">
                            Digite o conteúdo do post aqui...
                          </div>
                        )}
                        <ReactQuill
                          ref={quillRef}
                          value={content}
                          onChange={(val) => setContent(val)}
                          onFocus={() => setEditorFocused(true)}
                          onBlur={() => setEditorFocused(false)}
                          modules={{ toolbar: false }}
                          formats={["bold", "italic", "underline", "blockquote", "list", "image", "header", "font", "size", "align", "align"]}
                          theme="snow"
                          className="custom-quill min-h-[360px] w-full rounded-b-3xl bg-white p-4 text-left text-slate-800"
                          style={{ height: '360px' }}
                        />
                      </div>
                  </div>
                </div>
                <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
                  <label className="mb-1">Imagem de capa:</label>
                  <input
                    ref={imageUploadRef}
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
                    <div className="mb-2 w-full max-w-2xl">
                      <label className="mb-1 block text-sm font-medium text-slate-700">Tags (opcional):</label>
                      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 bg-slate-50 p-4">
                        {editSelectedTags.map((t, idx) => (
                          <div key={t._id || t.name + idx} style={{ background: t.color || "#9CA3AF" }} className="text-white px-3 py-1 rounded-xl text-xs font-semibold uppercase flex items-center gap-2">
                            <span>{t.name}</span>
                            <button type="button" onClick={() => removeTagAt(idx, true)} className="ml-1">×</button>
                          </div>
                        ))}
                        <div className="relative flex-1 min-w-[240px]">
                          <input
                            value={editTagInput}
                            onChange={(e) => { setEditTagInput(e.target.value); setShowEditTagSuggestions(true); }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                await addTagByName(editTagInput, true);
                              }
                            }}
                            onFocus={() => setShowEditTagSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowEditTagSuggestions(false), 150)}
                            placeholder="Adicionar tag..."
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                          {(showEditTagSuggestions) && (
                            <div className="absolute z-10 bg-white border mt-1 rounded-lg shadow max-h-40 overflow-auto w-full">
                              {tagsList
                                .filter((t) => t.name.toLowerCase().includes((editTagInput || "").toLowerCase()) && !editSelectedTags.find(st => st.name === t.name))
                                .map((t) => (
                                  <div key={t._id} onMouseDown={async (e) => { e.preventDefault(); await addTagByName(t.name, true); }} className="p-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2 rounded-lg">
                                    <span style={{ width: 12, height: 12, background: t.color }} className="rounded-full inline-block" />
                                    <span className="uppercase">{t.name}</span>
                                  </div>
                                ))}
                              {!tagsList.some(t => t.name.toLowerCase() === (editTagInput || "").toLowerCase()) && (editTagInput || "").trim() !== "" && (
                                <div onMouseDown={async (e) => { e.preventDefault(); await addTagByName(editTagInput, true); }} className="p-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2 rounded-lg">
                                  <span className="text-sm text-slate-600 uppercase">Criar "{editTagInput}"</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
                      <label className="mb-1 font-semibold text-left w-full">Conteúdo:</label>
                      <div className="w-full rounded-3xl border border-gray-200 bg-slate-50 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-white rounded-t-3xl">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyFormat("bold", null, editQuillRef, setEditContent)}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editEditorFormats.bold ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                            title="Negrito"
                          >
                            <FaBold />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyFormat("italic", null, editQuillRef, setEditContent)}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editEditorFormats.italic ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                            title="Itálico"
                          >
                            <FaItalic />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyFormat("underline", null, editQuillRef, setEditContent)}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editEditorFormats.underline ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                            title="Sublinhado"
                          >
                            <FaUnderline />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyFormat("align", "left", editQuillRef, setEditContent)}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${(editEditorFormats.align === 'left' || !editEditorFormats.align) ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                            title="Alinhar à esquerda"
                          >
                            <FaAlignLeft />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyFormat("align", "center", editQuillRef, setEditContent)}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editEditorFormats.align === 'center' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                            title="Centralizar"
                          >
                            <FaAlignCenter />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyFormat("align", "right", editQuillRef, setEditContent)}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editEditorFormats.align === 'right' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                            title="Alinhar à direita"
                          >
                            <FaAlignRight />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyFormat("align", "justify", editQuillRef, setEditContent)}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editEditorFormats.align === 'justify' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                            title="Justificar"
                          >
                            <FaAlignJustify />
                          </button>
                          <select
                            value={editEditorFormats.header || ""}
                            onChange={(e) => applyFormat("header", e.target.value ? parseInt(e.target.value, 10) : false, editQuillRef, setEditContent, false)}
                            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-slate-600"
                            title="Título"
                          >
                            <option value="">Normal</option>
                            <option value="1">H1</option>
                            <option value="2">H2</option>
                            <option value="3">H3</option>
                            <option value="4">H4</option>
                            <option value="5">H5</option>
                            <option value="6">H6</option>
                          </select>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyFormat("formatBlock", "blockquote", editQuillRef, setEditContent)}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${editEditorFormats.blockquote ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                            title="Citação"
                          >
                            <FaQuoteRight />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyFormat("insertUnorderedList", null, editQuillRef, setEditContent)}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${(editEditorFormats.list === 'bullet') ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
                            title="Lista"
                          >
                            <FaListUl />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleInsertImageEdit}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition ${'border-gray-200 bg-white text-slate-600'} hover:border-green-400 hover:text-green-600`}
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
                        <div className="relative">
                          {!editContent && !editEditorFocused && (
                            <div className="pointer-events-none absolute inset-0 flex items-start p-4 text-gray-400">
                              Digite o conteúdo do post aqui...
                            </div>
                          )}
                          <ReactQuill
                            ref={editQuillRef}
                            value={editContent}
                            onChange={(val) => setEditContent(val)}
                            onFocus={() => setEditEditorFocused(true)}
                            onBlur={() => setEditEditorFocused(false)}
                            modules={{ toolbar: false }}
                            formats={["bold", "italic", "underline", "blockquote", "list", "image", "header", "font", "size", "align"]}
                            theme="snow"
                            className="custom-quill min-h-[360px] w-full rounded-b-3xl bg-white p-4 text-left text-slate-800"
                            style={{ height: '360px' }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 flex flex-col items-start w-full max-w-2xl">
                      <label className="mb-1">Imagem de capa (opcional):</label>
                      <input
                        ref={editImageUploadRef}
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

            {activeTab === "deleteTag" && (
              <div className="flex flex-col items-center gap-4 w-full">
                {tagsList.length === 0 ? (
                  <p className="text-slate-600">Nenhuma tag disponível para excluir.</p>
                ) : (
                  tagsList.map((tag) => (
                    <div
                      key={tag._id}
                      className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span style={{ background: tag.color || "#9CA3AF" }} className="w-4 h-4 rounded-full inline-block" />
                          <div>
                            <p className="font-semibold text-slate-800">{tag.name}</p>
                            <p className="text-slate-500 text-sm">{tag.color || "#9CA3AF"}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTag(tag._id)}
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
