const crypto = require('crypto');

exports.generateHash = () => {
  const buffer = crypto.randomBytes(32);
  const hash = buffer.toString('hex');
  return hash;
};
