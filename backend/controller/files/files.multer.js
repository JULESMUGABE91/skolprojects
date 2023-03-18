const multer = require("multer");

const {
  userStorage,
  organizationStorage,
  giftStorage,
} = require("../../services/cloudinary/multerStorage");
const { validateImageFile } = require("../../validation/filesValidation");

const FILE_SIZE = 1000000;

const uploadProfileImage = multer({
  storage: userStorage,
  limits: {
    fileSize: FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    validateImageFile(file, cb);
  },
});

const uploadOrganizationImage = multer({
  storage: organizationStorage,
  limits: {
    fileSize: FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    validateImageFile(file, cb);
  },
});

const uploadGiftImage = multer({
  storage: giftStorage,
  limits: {
    fileSize: FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    validateImageFile(file, cb);
  },
});

const multerServices = {
  uploadProfileImage,
  uploadOrganizationImage,
  uploadGiftImage,
};

module.exports = {
  multerServices,
};
