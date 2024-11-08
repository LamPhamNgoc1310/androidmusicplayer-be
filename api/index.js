const express = require("express");
const path = require("path")
const app = express();

app.use('/audio', express.static(path.join(__dirname, 'songs')));

app.get('/play', (req, res) => {
    res.sendFile(path.join(__dirname, 'songs', 'song1.mp3'));
  
  });
  

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "car.jpg"));
  });

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
