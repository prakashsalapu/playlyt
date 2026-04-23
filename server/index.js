import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import playlistRoutes from "./routes/playlist.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/playlist", playlistRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});