const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3030;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

function generateCID(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

const cidToFileMap = {};
const cidToMetadataMap = {};

app.post("/upload/image", upload.single("image"), (req, res) => {
  const image = req.file;
  if (!image) {
    return res.status(400).json({ error: "Image is required" });
  }
  const imageCID = generateCID(image.filename);
  cidToFileMap[imageCID] = image.filename;

  res.status(200).json({
    message: "Image uploaded successfully",
    cid: imageCID,
    url: `http://localhost:${port}/image/${imageCID}`,
  });
});

app.post("/upload/metadata", (req, res) => {
  const metadata = req.body;
  if (!metadata) {
    return res.status(400).json({ error: "Metadata is required" });
  }
  const metadataCID = generateCID(JSON.stringify(metadata));
  cidToMetadataMap[metadataCID] = metadata;

  res.status(200).json({
    message: "Metadata uploaded successfully",
    cid: metadataCID,
    url: `http://localhost:${port}/metadata/${metadataCID}`,
  });
});

app.get("/image/:cid", (req, res) => {
  const cid = req.params.cid;
  const filename = cidToFileMap[cid];
  if (!filename) {
    return res.status(404).json({ error: "Image not found" });
  }
  res.sendFile(path.join(__dirname, "uploads", filename));
});

app.get("/metadata/:cid", (req, res) => {
  const cid = req.params.cid;
  const metadata = cidToMetadataMap[cid];
  if (!metadata) {
    return res.status(404).json({ error: "Metadata not found" });
  }
  res.json(metadata);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
