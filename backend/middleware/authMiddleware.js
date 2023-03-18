const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Assign user id and accessLevel to req
      req.user = {
        id: decodedToken.id,
      };

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized!");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized!");
  }
});

module.exports = {
  protect,
};
