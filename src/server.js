import * as mongoose from './app/models/models';
import express from './config/express';

mongoose.connectDatabase().then(async (result) => {
  const app = express();
  const port = 3000;

  app.listen(port);

  console.log('Sever is running at localhost:3000');
}).catch((error) => {
  console.error('Error connecting database', error);
});
