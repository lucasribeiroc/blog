require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

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
db.once("open", async () => {
  console.log("Connected to MongoDB Atlas");

  try {
    const hashedPassword = await bcrypt.hash(process.env.USER_PASSWORD, 10);

    const user = new User({
      username: process.env.USER_USERNAME,
      password: hashedPassword,
    });

    await user.save();
    console.log("User created");
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    mongoose.connection.close();
  }
});
