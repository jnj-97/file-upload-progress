require('dotenv').config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs"); // Import the fs module
const path = require("path"); // Import the path module
const app = express();
const port = 5000;
const passport = require("passport");
const IPFS = require('./services/ipfs.service');

app.use(cors());
app.use(passport.initialize());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

app.post("/", upload.single("file"),async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Process the uploaded file
  const filename = file.originalname;
  const filesize = file.size;
  if(!(fs.existsSync("./files")))
  {
    fs.mkdir('./files',(err)=>
    {
      if(err)
      {
        console.log(err);
      }
    });
  }
  const filepath = path.join(__dirname, "files", filename);
  fs.writeFileSync(filepath, file.buffer);

  try {
    let cid = await IPFS.prototype.uploadImage(filepath);
    console.log(cid);

    // Unlink the file after a successful IPFS upload
    //fs.unlinkSync(filepath);

    // Perform any other processing you need to do here
    res.json({ message: "File uploaded successfully", filename, filesize });
  } catch (err) {
    console.error("Error uploading to IPFS:", err);

    // Unlink the file in case of an error during IPFS upload
    // fs.unlinkSync(filepath);

    return res.status(500).json({ error: "Failed to upload the file to IPFS" });
  }
});


require("./config/passport.config")(passport);
app.use('/',require('./routes/login.routes'));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
