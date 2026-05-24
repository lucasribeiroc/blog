const express = require("express");
const router = express.Router();
const Tag = require("../models/Tag");
const Post = require("../models/Post");
const { protect } = require("../middleware/authMiddleware");
const { getUniqueRandomColor } = require("../utils/tagColor");

// Get all tags
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: "Erro carregando tags", error });
  }
});

// Create a tag (protected)
router.post("/", protect, async (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ message: "Nome é obrigatório" });
  try {
    let tag = await Tag.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (tag) return res.json(tag);
    const existingColors = await Tag.find().distinct("color");
    const newColor = color || getUniqueRandomColor(existingColors, name);
    const newTag = new Tag({ name: name.trim(), color: newColor });
    await newTag.save();
    res.json(newTag);
  } catch (error) {
    res.status(500).json({ message: "Erro criando tag", error });
  }
});

// Delete a tag and remove references from posts
router.delete("/:id", protect, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag não encontrada" });
    }

    await Post.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });
    await tag.deleteOne();

    res.json({ message: "Tag excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro excluindo tag", error });
  }
});

module.exports = router;
