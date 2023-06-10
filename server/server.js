const http = require('http');
const app = require('./src/configs/app');
const { initializeDatabase } = require('./src/configs/db');

const server = http.createServer(app);

initializeDatabase()
  .then(() => {
    console.log('Connect to DB');
    const port = process.env.PORT || 8000;

    server.listen(port, () => {
      console.log(`App running on port ${port} ...`);
    });
  })
  .catch((err) => {
    console.log('Cannot connect to DB:', err);
  });

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('UNHANDLED REJECTION! Shutting down ...');
  server.close(() => {
    process.exit(1);
  });
});
