const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
  },
  metaTitle: {
    type: String,
    maxlength: 60,
  },
  metaDescription: {
    type: String,
    maxlength: 155,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Gerar slug automaticamente a partir do título
postSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
