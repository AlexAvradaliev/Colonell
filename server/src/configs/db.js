const mongoose = require('mongoose');
require('dotenv').config();

if (process.env.NODE_ENV.trim() == 'production') {
  const DB = process.env.DB_URI.replace('<password>', process.env.DB_PASSWORD);
  mongoose.set('strictQuery', true);
  console.log('DB => prod');
  exports.initializeDatabase = () => mongoose.connect(DB);
} else {
  const DB = process.env.DB_URI_DEV;
  mongoose.set('strictQuery', true);
  console.log('DB => dev');
  exports.initializeDatabase = () => mongoose.connect(DB);
}
