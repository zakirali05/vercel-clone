const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// THIS PATH WILL COME AFTER SETTING UP AWS ACCOUNT

app.get("/:anything", (req, res) => {
  const hostname = req.hostname.toString();
  console.log(hostname);
  const subdomain = hostname?.split(".")[0];

  // // // Custom Domain - DB Query

  return res.sendFile(
    path.join(__dirname, "uploads", `${subdomain}`, "index.html")
  );
});

app.post("/upload", upload.single("fileData"), (req, res) => {
  const folderName = req.body.folderName;
  const filename = req.file.originalname;
  const fileData = Buffer.from(req.body.fileData, "base64");

  fs.writeFile(`uploads/${folderName}/${filename}`, fileData, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.json({ status: 500, message: err?.message });
    } else {
      console.log("File saved successfully:", filename);
      return res.json({ status: 200, message: "File saved succesfully" });
    }
  });
});

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Reverce proxy Server started at port: ${port}`);
});
