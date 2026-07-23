require("dotenv").config();

console.log("=================================");
console.log("TMDB KEY:", process.env.TMDB_API_KEY);
console.log("MONGO URI EXISTS:", !!process.env.MONGO_URI);
console.log("=================================");

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User routes
app.use("/api/users", userRoutes);

// Movie routes
app.use("/api/movies", movieRoutes);

app.use("/api/gemini", geminiRoutes);

app.use("/api/chat", chatRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("BeatFlix Backend is Running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`BeatFlix Server Running on Port ${PORT}`);
});