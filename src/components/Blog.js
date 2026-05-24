import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header"; // Importar o componente Header
import Contact from "./Contact";
import Footer from "./Footer";

const apiBase = process.env.REACT_APP_API_URL || "/blog";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [filterTag, setFilterTag] = useState(null);
  const [search, setSearch] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const navigate = useNavigate();
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
        const response = await axios.get(`${apiBase}/api/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Definir o carregamento como falso após a tentativa de buscar os posts
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get(`${apiBase}/api/tags`);
        setTagsList(response.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchPosts();
    fetchTags();
  }, []);

  // derive list of tags from backend and fallback to tags in posts
  const allTags = tagsList.length
    ? tagsList
    : Array.from(new Map(posts.flatMap(p => (p.tags||[])).map(t => [t._id || t.name, t])).values());

  const latestPost = posts && posts.length > 0 ? posts[0] : null;

  const handleOpenPost = (post) => {
    if (post && post._id) {
      navigate(`/posts/${post._id}`);
    }
  };

  const handleTagClick = (tag) => {
    setFilterTag(tag);
    setSearch(tag.name || "");
    setCurrentPage(1);
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
      <div className={`bg-[#F7F9F8] min-h-screen font-poppins transition-all duration-500 ease-in-out ${!latestPost ? 'pt-20 md:pt-24' : ''}`}>
        {/* Adicionar background color e padding condicional */}
        {latestPost && (
          <section className="relative overflow-hidden mb-2 w-full">
            <div className="relative h-[420px] sm:h-[460px] md:h-[520px] bg-slate-900 w-full">
              {latestPost.imageUrl ? (
                <img
                  src={latestPost.imageUrl}
                  alt={latestPost.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-slate-400"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 sm:px-10">
                <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/80 drop-shadow-lg">Último post</p>
                <h2 className="max-w-3xl text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]">
                  {latestPost.title}
                </h2>
                <p className="mt-5 max-w-2xl text-sm sm:text-base leading-7 text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
                  {getExcerpt(latestPost.content, 180)}
                </p>
                <button
                  onClick={() => handleOpenPost(latestPost)}
                  className="mt-8 rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                >
                  Ler mais
                </button>
              </div>
            </div>
          </section>
        )}
        <div className="max-w-screen-xl p-5 mx-auto bg-[#F7F9F8] text-slate-900">
          <h1 className="text-4xl font-bold text-center mb-2 mt-10">
            BLOG ZOLV
          </h1>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex-0 overflow-x-auto whitespace-nowrap py-1 px-1 lg:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="inline-flex items-center gap-2">
                <button
                  onClick={() => { setFilterTag(null); setSearch(""); setCurrentPage(1); }}
                  className={`inline-flex items-center px-4 py-2 rounded-full uppercase text-[11px] tracking-[0.15em] font-semibold transition ${!filterTag ? 'bg-slate-900 text-white' : 'bg-slate-700 text-slate-200'}`}
                >
                  todas
                </button>
                {allTags.map(t => {
                  const isSelected = filterTag && (filterTag._id||filterTag.name) === (t._id||t.name);
                  return (
                    <button
                      key={t._id || t.name}
                      onClick={() => handleTagClick(t)}
                      className={`inline-flex items-center px-4 py-2 rounded-full uppercase text-[11px] tracking-[0.15em] font-semibold transition ${isSelected ? 'ring-2 ring-slate-200 text-white' : 'text-white/90 hover:scale-105'}`}
                      style={{
                        background: t.color || '#4B5563',
                      }}
                    >
                      {String(t.name).toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="relative flex-1 min-w-[260px] max-w-full">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔍</span>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setFilterTag(null); setCurrentPage(1); }}
                placeholder="Pesquisar"
                className="w-full min-w-[260px] pl-11 pr-4 py-3 rounded-full border border-slate-200 bg-white text-sm text-slate-800 shadow-sm focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Últimos posts</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 justify-items-center">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[32px] bg-white shadow-none animate-pulse max-w-[380px] w-full"
                >
                  <div className="h-80 bg-slate-200"></div>
                  <div className="p-6">
                    <div className="mb-4 h-5 w-24 rounded-full bg-slate-200"></div>
                    <div className="mb-3 h-5 w-full rounded bg-slate-200"></div>
                    <div className="mb-3 h-5 w-full rounded bg-slate-200"></div>
                    <div className="mt-6 h-10 w-28 rounded-full bg-slate-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 justify-items-center">
              {currentPosts.length > 0 ? (
                currentPosts.filter(post => {
                  const searchLower = (search || "").trim().toLowerCase();
                  const matchesTag = !filterTag || (post.tags || []).some(t => (t._id || t.name) === (filterTag._id || filterTag.name));
                  const matchesSearch = !searchLower ||
                    (post.title||"").toLowerCase().includes(searchLower) ||
                    (stripHtml(post.content)||"").toLowerCase().includes(searchLower) ||
                    (post.tags || []).some(t => (t.name || "").toLowerCase().includes(searchLower));
                  return matchesTag && matchesSearch;
                }).map((post) => {
                  const tags = post.tags || [];
                  return (
                    <article
                      key={post._id}
                      onClick={() => handleOpenPost(post)}
                      className="group cursor-pointer transition duration-300 hover:-translate-y-1 max-w-[380px] w-full bg-white overflow-hidden rounded-[32px] shadow-lg shadow-slate-200"
                    >
                      <div className="relative h-80 overflow-hidden bg-emerald-300">
                        {post.imageUrl ? (
                          <>
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/70"></div>
                            <div className="absolute left-4 right-4 bottom-4 flex flex-wrap gap-2">
                              {tags.map((tagItem) => (
                                <span
                                  key={tagItem._id || tagItem.name}
                                  className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
                                  style={{
                                    backgroundColor: tagItem.color || '#E2E8F0',
                                    color: tagItem.color ? '#ffffff' : '#334155',
                                  }}
                                >
                                  {String(tagItem.name).toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="h-full w-full bg-emerald-400"></div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="mb-4 text-slate-400 text-[11px] uppercase tracking-[0.22em] font-semibold">
                          {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <h3 className="mb-4 text-2xl font-semibold text-slate-900 leading-tight">
                          {post.title}
                        </h3>
                        <p className="mb-6 text-sm leading-6 text-slate-600 max-h-[6rem] overflow-hidden">
                          {getExcerpt(post.content, 140)}
                        </p>
                        <p className="text-sm font-semibold text-violet-600">
                          Leia mais
                        </p>
                      </div>
                    </article>
                  );
                })
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
      <Contact />
      <Footer />
    </>
  );
};

export default Blog;

