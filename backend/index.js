require('dotenv').config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs"); // Import the fs module
const path = require("path"); // Import the path module
const app = express();
const port = 5000;
const passport = require("passport");

app.use(cors());
app.use(passport.initialize());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

app.post("/", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Process the uploaded file
  const filename = file.originalname;
  const filesize = file.size;
  const filepath = path.join(__dirname, "files", filename);
  fs.writeFile(filepath, file.buffer, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ error: "Failed to save the file" });
    }
  });
  // Perform any other processing you need to do here
  res.json({ message: "File uploaded successfully", filename, filesize });
});
require("./config/passport.config")(passport);
app.use('/',require('./routes/login.routes'));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
