const cloudinary = require("../services/cloudinary/cloudinaryConfig");

//upload file
const upload = (file, public_id, callback) => {
  return cloudinary.uploader.upload_large(
    file.path,
    { folder: "skol", public_id, resource_type: "auto" },
    (error, result) => {
      callback(error, result);
    }
  );
};

const update_file = (public_ids) => {
  for (let i = 0; i < public_ids.length; i++) {
    cloudinary.uploader.explicit(
      public_ids[i],
      { type: "fetch", invalidate: true, folder: app_name },
      function (result) {}
    );
  }
};

const delete_file = (public_ids) => {
  for (let i = 0; i < public_ids.length; i++) {
    cloudinary.uploader.destroy(public_ids[i], function (error, result) {});
  }
};

module.exports.upload = upload;
module.exports.update_file = update_file;
module.exports.delete_file = delete_file;
