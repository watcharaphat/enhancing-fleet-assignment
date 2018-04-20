import * as mongoose from './models/models';
import moment from 'moment';
import FlightModel from './models/flight.model';
import util from 'util';

mongoose.connectDatabase().then(async (result) => {
  const date = moment('Jan 1 2017', 'MMM DD YYYY').toDate();
  const airline = 'PG';

  let schedule;
  try {
    schedule = await FlightModel.find({ date, airline });
  } catch (error) {
    console.error('Error query in FlightModel', error);
  }
  console.log(util.inspect(schedule, false, null, true));
}).catch((error) => {
  console.error('Error connecting database', error);
});
