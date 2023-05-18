const fs = require("fs");
const file = require("../../utils/file");
var path = require("path");

const handleUpload = async (req, res) => {
  try {
    const data = await file.onUploading(req);

    res.json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

const httpHandlePDF = async (req, res) => {
  const { file } = req.query;

  const fileName = path.basename(file);

  fs.exists(file, function (exists) {
    if (exists) {
      // Content-type is very interesting part that guarantee that
      // Web browser will handle response in an appropriate manner.
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=" + fileName,
      });
      fs.createReadStream(file).pipe(res);
      return;
    }
    res.writeHead(400, { "Content-Type": "text/pdf" });
    res.end("ERROR File does not exist");
  });
};

const httpHandleCSV = async (req, res) => {
  const { file } = req.query;

  if (!file) return res.status(400).json({ error: "File path not exist" });

  const fileName = path.basename(file);

  fs.exists(file, function (exists) {
    if (exists) {
      // Content-type is very interesting part that guarantee that
      // Web browser will handle response in an appropriate manner.
      res.writeHead(200, {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=" + fileName,
      });
      fs.createReadStream(file).pipe(res);

      // After sending the response, remove the file
      // fs.unlink(file, (err) => {
      //   if (err) {
      //     console.error("Error removing file:", err);
      //     return;
      //   }
      //   console.log("File removed successfully.");
      // });
      return;
    }
    res.writeHead(400, { "Content-Type": "text/csv" });
    res.end("ERROR File does not exist");
  });
};

module.exports = {
  handleUpload,
  httpHandlePDF,
  httpHandleCSV,
};
