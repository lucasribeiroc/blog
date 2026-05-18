const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const Post = require("../models/Post"); // Supondo que você tenha um modelo Post

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 250 * 1024 }, // Limite de 250KB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("A imagem deve ter a extensão .jpg ou .png"), false);
    }
  },
});

// Rota protegida para adicionar posts
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file;

  const imageUrl = image
    ? `data:${image.mimetype};base64,${image.buffer.toString("base64")}`
    : null;

  try {
    const post = new Post({
      title,
      content,
      imageUrl,
      createdAt: new Date(),
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error adding post", error });
  }
});

// Rota para buscar todos os posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Erro carregando posts", error });
  }
});

// Rota para atualizar um post
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    post.title = title || post.title;
    post.content = content || post.content;

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
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    await post.deleteOne();
    res.json({ message: "Post excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro excluindo post", error });
  }
});

module.exports = router;
