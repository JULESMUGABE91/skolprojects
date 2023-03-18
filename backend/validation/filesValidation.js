const multer = require("multer");
const { uploader } = require("../services/cloudinary/cloudinaryConfig");

const validateImageFile = (file, callback) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    callback(null, true);
  } else {
    return callback(new Error("Only jpg, jpeg, png, format allowed!"));
  }
};

const validatePdf = (file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"
  ) {
    callback(null, true);
  } else {
    return callback(new Error("Only pdf, jpg or jpeg format allowed!"));
  }
};

const handleUploadToCloudinary = (req, res) => {
  // uploadMulterFunc(req, res, (err) => {
  //   if (err instanceof multer.MulterError) {
  //     return res.json({ message: "Max file size 1MB allowed!" });
  //   } else if (err)
  //     return res.status(400).send({
  //       message: err.message,
  //     });
  //   return res.status(200).json({ file: req.file.path });
  // });
  const file = req.file;
  console.log("file", file);
  // if (req.file) {
  return uploader
    .upload(file)
    .then((result) => {
      const image = result.url;
      console.log(result);
      return res.status(200).json({
        messge: "Your image has been uploded successfully to cloudinary",
        data: {
          image,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        messge: "someting went wrong while processing your request",
        data: {
          err,
        },
      });
    });
  // }
};

module.exports = {
  validateImageFile,
  validatePdf,
  handleUploadToCloudinary,
};
