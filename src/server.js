import * as mongoose from './app/models/models';
import express from './config/express';

console.log('Connecting database');

mongoose.connectDatabase().then(async (result) => {
  console.log('Connted to database');

  const app = express();
  const port = 3000;

  app.listen(port);

  console.log('Sever is running at localhost:3000');
}).catch((error) => {
  console.error('Error connecting database', error);
});
