import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Contact from "./Contact";
import Footer from "./Footer";

const apiBase = process.env.REACT_APP_API_URL || "/blog";

export default function PostPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createSlugFromText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Tenta buscar por slug primeiro
        let response;
        if (slug && slug.match(/^[a-z0-9-]+$/)) {
          // É um slug válido
          try {
            response = await axios.get(`${apiBase}/api/posts/slug/${slug}`);
          } catch (err) {
            // Se slug não funcionar, tenta como ID (compatibilidade com posts antigos)
            if (err.response?.status === 404) {
              response = await axios.get(`${apiBase}/api/posts/${slug}`);
            } else {
              throw err;
            }
          }
        } else {
          // Trata como ID direto
          response = await axios.get(`${apiBase}/api/posts/${slug}`);
        }
        
        setPost(response.data);
        
        // Atualizar metadados da página
        document.title = response.data.metaTitle || response.data.title || 'Blog';
        
        // Remover meta description anterior se existir
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = response.data.metaDescription || response.data.title || '';

        // Atualizar tag canonical no <head>
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
          canonicalLink = document.createElement('link');
          canonicalLink.rel = 'canonical';
          document.head.appendChild(canonicalLink);
        }
        const canonicalSlug = response.data.slug || createSlugFromText(response.data.title || '');
        const publicUrl = process.env.PUBLIC_URL || '';
        canonicalLink.href = canonicalSlug
          ? `${window.location.origin}${publicUrl}/#/posts/${canonicalSlug}`
          : window.location.href;
        
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Erro ao carregar o post.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
      // Scroll to top when post is loaded
      window.scrollTo(0, 0);
    }
  }, [slug]);

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
                    alt={post.imageAlt || post.title}
                    title={post.imageAlt || post.title}
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
