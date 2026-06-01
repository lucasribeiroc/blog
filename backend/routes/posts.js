const express = require("express");
const path = require("path");
const router = express.Router();
// switched from multer to express-fileupload (handled in server.js)
const { protect } = require("../middleware/authMiddleware");
const Post = require("../models/Post"); // Supondo que você tenha um modelo Post
const Tag = require("../models/Tag");
const { getUniqueRandomColor } = require("../utils/tagColor");

// Using express-fileupload: files available on `req.files` (see server.js)

// Rota protegida para adicionar posts
router.post("/", protect, async (req, res) => {
  const { title, content, metaTitle, metaDescription, slug } = req.body;
  // tags can be passed as JSON string or array of names
  let tagsInput = [];
  try {
    if (req.body.tags) {
      tagsInput = typeof req.body.tags === "string" ? JSON.parse(req.body.tags) : req.body.tags;
    }
  } catch (e) {
    tagsInput = req.body.tags ? [req.body.tags] : [];
  }
  // express-fileupload exposes files on req.files
  let imageUrl = null;
  try {
    const file = req.files && req.files.image ? req.files.image : null;
    if (file) {
      // validate type and size (250KB)
      if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
        return res.status(400).json({ message: "Somente imagens JPEG ou PNG são permitidas" });
      }
      if (file.size > 250 * 1024) {
        return res.status(400).json({ message: "A imagem deve ter menos de 250KB" });
      }
      const buffer = file.data || (file.data === undefined ? Buffer.from(file, 'binary') : file.data);
      imageUrl = `data:${file.mimetype};base64,${buffer.toString("base64")}`;
    }
  } catch (e) {
    console.error('Error processing uploaded file:', e);
    return res.status(500).json({ message: 'Erro processando arquivo', error: e.message });
  }

  try {
    const tagIds = [];
    const existingColors = await Tag.find().distinct("color");
    for (const t of tagsInput) {
      const name = String(t).trim();
      if (!name) continue;
      let tag = await Tag.findOne({ name: new RegExp(`^${name}$`, "i") });
      if (!tag) {
        const color = getUniqueRandomColor(existingColors, name);
        existingColors.push(color);
        tag = new Tag({ name, color });
        await tag.save();
      }
      tagIds.push(tag._id);
    }

    const post = new Post({
      title,
      content,
      imageUrl,
      slug,
      metaTitle: metaTitle || title.substring(0, 60),
      metaDescription: metaDescription || content.replace(/<[^>]*>/g, '').substring(0, 155),
      tags: tagIds,
      createdAt: new Date(),
    });

    await post.save();
    await post.populate("tags");
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error adding post", error });
  }
});

// Rota para buscar todos os posts
router.get("/", async (req, res) => {
  try {
      const posts = await Post.find().sort({ createdAt: -1 }).populate("tags");
      res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Erro carregando posts", error });
  }
});

// Rota para buscar um post por slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("tags");
    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Erro carregando post", error });
  }
});

// Rota para buscar um post por ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("tags");
    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Erro carregando post", error });
  }
});

// Rota para atualizar um post
router.put("/:id", protect, async (req, res) => {
  const { title, content, metaTitle, metaDescription, slug } = req.body;
  // handle tags similar to post
  let tagsInput = [];
  try {
    if (req.body.tags) {
      tagsInput = typeof req.body.tags === "string" ? JSON.parse(req.body.tags) : req.body.tags;
    }
  } catch (e) {
    tagsInput = req.body.tags ? [req.body.tags] : [];
  }
  let image = null;
  try {
    const file = req.files && req.files.image ? req.files.image : null;
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
        return res.status(400).json({ message: "Somente imagens JPEG ou PNG são permitidas" });
      }
      if (file.size > 250 * 1024) {
        return res.status(400).json({ message: "A imagem deve ter menos de 250KB" });
      }
      const buffer = file.data || (file.data === undefined ? Buffer.from(file, 'binary') : file.data);
      image = { mimetype: file.mimetype, buffer };
    }
  } catch (e) {
    console.error('Error processing uploaded file on update:', e);
    return res.status(500).json({ message: 'Erro processando arquivo', error: e.message });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.metaTitle = metaTitle || post.metaTitle || post.title.substring(0, 60);
    post.metaDescription = metaDescription || post.metaDescription || content.replace(/<[^>]*>/g, '').substring(0, 155);
    if (slug) post.slug = slug;

    if (tagsInput && tagsInput.length > 0) {
      const tagIds = [];
      const existingColors = await Tag.find().distinct("color");
      for (const t of tagsInput) {
        const name = String(t).trim();
        if (!name) continue;
        let tag = await Tag.findOne({ name: new RegExp(`^${name}$`, "i") });
        if (!tag) {
          const color = getUniqueRandomColor(existingColors);
          existingColors.push(color);
          tag = new Tag({ name, color });
          await tag.save();
        }
        tagIds.push(tag._id);
      }
      post.tags = tagIds;
    }

    if (image) {
      post.imageUrl = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Erro atualizando post", error });
  }
});

// Rota para excluir um post
router.delete("/:id", protect, async (req, res) => {
  try {
    const postId = req.params.id;
    console.log(`Deleting post ${postId}`);
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post não encontrado" });
    }
    console.log(`Deleted post ${postId}`);
    res.json({ message: "Post excluído com sucesso" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Erro excluindo post", error: error.message || error });
  }
});

module.exports = router;
