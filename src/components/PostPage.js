import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Contact from "./Contact";
import Footer from "./Footer";

const apiBase = process.env.REACT_APP_API_URL || "/blog";

export default function PostPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${apiBase}/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Erro ao carregar o post.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
      // Scroll to top when post is loaded
      window.scrollTo(0, 0);
    }
  }, [id]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    return new Date(dateValue).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const tags = post?.tags || [];

  return (
    <>
      <Header className="mb-8 font-poppins" />
      <main className="bg-[#F7F9F8] min-h-screen font-poppins pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto p-5">
          {loading ? (
            <div className="py-20 text-center text-slate-700">Carregando post...</div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">{error}</div>
          ) : !post ? (
            <div className="py-20 text-center text-slate-700">Post não encontrado.</div>
          ) : (
            <article className="space-y-8">
              <div className="space-y-4">
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tagItem) => (
                      <span
                        key={tagItem._id || tagItem.name}
                        className="inline-flex rounded-full px-4 py-2 uppercase tracking-[0.18em] text-xs font-semibold"
                        style={{
                          backgroundColor: tagItem.color || "#E2E8F0",
                          color: tagItem.color ? "#ffffff" : "#334155",
                        }}
                      >
                        {String(tagItem.name).toUpperCase()}
                      </span>
                    ))}
                  </div>
                ) : null}
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                  {post.title}
                </h1>
                <p className="text-sm text-slate-500">{formatDate(post.createdAt)}</p>
              </div>

              {post.imageUrl ? (
                <div className="overflow-hidden rounded-[32px] bg-slate-900">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full object-cover"
                    style={{ maxHeight: 580 }}
                  />
                </div>
              ) : null}

              <div className="blog-post-content max-w-none text-slate-700 space-y-6">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
              <div className="mt-8 flex justify-start">
                <button
                  type="button"
                  onClick={() => { 
                    window.scrollTo(0, 0); 
                    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                    if (isLocalhost) {
                      navigate("/");
                    } else {
                      window.location.href = "https://www.usezolv.com/blog";
                    }
                  }}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  ← Voltar ao blog
                </button>
              </div>
            </article>
          )}
        </div>
      </main>
      <Contact />
      <Footer />
    </>
  );
}
