const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIARY_TIME,
  });
};

module.exports = generateToken;
