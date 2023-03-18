const file = require("../../utils/file");
const handleUpload = async (req, res) => {
  try {
    const data = await file.onUploading(req);

    res.json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  handleUpload,
};
