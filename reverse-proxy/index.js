const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extends: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(path.join(__dirname, "uploads", req.body.folderName), {
      recursive: true,
    });
    cb(null, path.join(__dirname, "uploads", req.body.folderName)); // Specify the directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// THIS PATH WILL COME AFTER SETTING UP AWS ACCOUNT

app.get("/", (req, res) => {
  const hostname = req.hostname.toString();
  console.log(hostname);
  const subdomain = hostname?.split(".")[0];

  // // // Custom Domain - DB Query

  return res.sendFile(
    path.join(__dirname, "uploads", `${subdomain}`, "index.html")
  );
});

app.post("/upload", upload.single("fileData"), async (req, res) => {
  return res.json({
    status: 200,
    message: "Deployed sucessfully",
    url: `http://${req.body.folderName}.localhost:9001`,
  });
});

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Reverce proxy Server started at port: ${port}`);
});
