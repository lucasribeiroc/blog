const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
    default: "#9CA3AF", // gray-400
  },
});

module.exports = mongoose.model("Tag", tagSchema);
