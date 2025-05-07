const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

module.exports = generateToken; 