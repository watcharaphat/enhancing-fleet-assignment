import mongoose from 'mongoose';
import databaseEnv from '../env';

mongoose.Promise = global.Promise;

export async function connectDatabase() {
  const username = databaseEnv.username;
  const password = databaseEnv.password;
  const host = databaseEnv.host;
  const port = databaseEnv.port;
  const database = databaseEnv.database;

  let mongoDb;
  try {
    mongoDb = `mongodb://${username}:${password}@${host}:${port}/${database}`;
    await mongoose.connect(mongoDb);
  } catch (error) {
    console.error('Error on connecting database', error);
  }

  return mongoDb;
}
