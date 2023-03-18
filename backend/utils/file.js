const FileCloudnary = require("./cloudnary");
const fs = require("fs");

//remove file
const remove_file = (path) => {
  fs.unlink(path, (err) => {
    console.log("============ File removed");
  });
};

const handleFile = async (req, count = 1, fileName) => {
  //upload profile image
  let res_promises = null;
  let files = [];
  for (let i = 0; i < count; i++) {
    let name = fileName + i;

    res_promises = await new Promise((resolve, reject) => {
      FileCloudnary.upload(req.files[name], null, (error, result) => {
        if (error) {
          reject(error);

          if (req.files[name] && req.files[name].path) {
            remove_file(req.files[name].path);
          }
        } else {
          files.push(result);
          resolve(files);
        }
      });
    });

    //file upload remove it after saving to the db
    remove_file(req.files[name].path);
  }
  return res_promises;
};

const onUploading = async (req) => {
  let files = [],
    file_public_ids = [];

  return await handleFile(req, req.body.count || 1, "file")
    .then((result) => {
      for (var i = 0; i < result.length; i++) {
        files.push(result[i].url);
        file_public_ids.push(result[i].public_id);
      }

      return {
        file_url: files,
        public_id: file_public_ids,
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        error,
      };
    });
};

module.exports.onUploading = onUploading;
