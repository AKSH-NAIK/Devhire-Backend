const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "devhire_resumes",
    resource_type: "raw"
  }
});

const upload = multer({ storage });

module.exports = upload;