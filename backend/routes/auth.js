const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(`Auth login attempt for: ${username}`);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`Auth failed: user not found: ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Auth failed: wrong password for: ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
