const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files in the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware to parse JSON requests
app.use(express.json());

// Create a storage directory
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Store song data in memory (or you could use a database)
const songs = [];

// Route to upload song data
app.post("/upload", upload.fields([{ name: "mp3" }, { name: "image" }]), (req, res) => {
    try {
      const { name, duration } = req.body;
      const mp3 = req.files["mp3"] ? req.files["mp3"][0].path : null;
      const image = req.files["image"] ? req.files["image"][0].path : null;
  
      if (!name || !duration || !mp3) {
        return res.status(400).json({ error: "Name, duration, and mp3 file are required." });
      }
  
      const song = {
        id: Date.now(),
        name,
        duration,
        mp3,
        image,
      };
  
      songs.push(song);
      res.status(201).json(song);
    } catch (error) {
      console.error("Upload error:", error);  // This will appear in Vercel logs
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// Route to get all songs
app.get("/songs", (req, res) => {
  res.json(songs);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
