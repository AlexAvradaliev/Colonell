const bcrypt = require('bcrypt');

exports.hash = async (password) => {
  return await bcrypt.hash(password, 12);
};

exports.compare = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
