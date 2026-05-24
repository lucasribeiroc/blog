const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Module = require("module");

process.chdir(__dirname);
const nodeModulesPath = path.join(__dirname, "node_modules");
process.env.NODE_PATH = process.env.NODE_PATH
  ? `${process.env.NODE_PATH}${path.delimiter}${nodeModulesPath}`
  : nodeModulesPath;
module.paths.unshift(nodeModulesPath);
Module._initPaths();

const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const tagRoutes = require("./routes/tags");

const envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });
console.log("Loading env from:", envPath);

const app = express();

// Middleware para analisar o corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// file upload middleware (replaces multer usage)
const fileUpload = require('express-fileupload');
app.use(fileUpload({ createParentPath: true }));

// Request logging for debugging (will appear in PM2 logs)
app.use((req, res, next) => {
  try {
    console.log(`[REQ] ${req.method} ${req.originalUrl}`);
    console.log('Headers:', JSON.stringify(req.headers));
    if (req.method !== 'GET') {
      console.log('Body keys:', Object.keys(req.body || {}));
    }
    if (req.files) {
      console.log('Files:', Object.keys(req.files));
    }
  } catch (e) {
    console.error('Error logging request:', e);
  }
  next();
});

// Middleware CORS
const corsOrigin = process.env.CORS_ORIGIN || true;
app.use(
  cors({
    origin: corsOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Conexão com o MongoDB
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbURI = `mongodb+srv://${dbUser}:${dbPassword}@pdvsevenblog.bqcsm.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=pdvsevenblog`;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

// Uso das rotas
const apiPrefix = "/blog";
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tags", tagRoutes);

app.use(`${apiPrefix}/api/posts`, postRoutes);
app.use(`${apiPrefix}/api/auth`, authRoutes);
app.use(`${apiPrefix}/api/tags`, tagRoutes);

const PORT = process.env.PORT_SERVER || process.env.PORT || 5000;
const buildCandidates = [
  process.env.BUILD_PATH && path.resolve(process.env.BUILD_PATH),
  path.join(__dirname, "build"),
  path.join(__dirname, "..", "build"),
  path.join(__dirname, "..", "www", "blog"),
  path.join(__dirname, "..", "..", "www", "blog"),
].filter(Boolean);

const finalBuildPath = buildCandidates.find((candidate) => fs.existsSync(candidate));

if (!finalBuildPath) {
  console.error("Build folder not found. Checked:", buildCandidates);
} else {
  console.log("Using build path:", finalBuildPath);
}

if (finalBuildPath) {
  app.use(apiPrefix, express.static(finalBuildPath));

  app.get(apiPrefix, (req, res) => {
    res.sendFile(path.join(finalBuildPath, "index.html"));
  });

  app.get(`${apiPrefix}/*`, (req, res) => {
    res.sendFile(path.join(finalBuildPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handler to surface stacktraces to PM2 logs
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: 'Internal Server Error', error: err && err.message ? err.message : 'unknown' });
});
