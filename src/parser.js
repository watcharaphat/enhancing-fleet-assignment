import * as mongoose from './app/models/models';
import express from 'express';
import moment from 'moment';
import FlightModel from './app/models/flight.model';
import util from 'util';
import parseSchedule from './modules/utils/parseSchedule';

mongoose.connectDatabase().then(async (result) => {
  const app = express();
  app.listen(3000);

  console.log('Server running at port 3000');

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  const date = moment('Jan 1 2017', 'MMM DD YYYY').toDate();
  const airline = 'PG';

  let schedule;
  try {
    schedule = await FlightModel.find({ date, airline }).lean();
  } catch (error) {
    console.error('Error query in FlightModel', error);
  }

  const req = { 'schedule': schedule };
  parseSchedule(req);
  console.log(schedule[0]);
}).catch((error) => {
  console.error('Error connecting database', error);
});
