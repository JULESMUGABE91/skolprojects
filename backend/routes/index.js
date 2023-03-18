// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const subRouters = [];
const getAllSubRoutes = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      getAllSubRoutes(fullPath);
    } else {
      if (fullPath !== __filename) {
        subRouters.push(require(fullPath));
      }
    }
    return subRouters;
  });
};

getAllSubRoutes(__dirname);

app.use(subRouters);

module.exports = app;
