import mongoose from 'mongoose';
import moment from 'moment';
import Flight from '../models/flight.model';
import Summer from '../models/summer.model';

export async function list(req, res, next) {
  console.log(req.originalUrl);
  const date = moment(req.query.date, 'DD-MMM-YYYY').toDate();

  if (req.query.season === 'summer') {
    try {
      req.schedule = await Summer.find({}).lean();
    } catch (error) {
      console.error('400 Invalid query', req.query);
      res.status(400).send('Invalid query');
      return;
    }
  } else {
    try {
      req.schedule = await Flight.find({
        'date': date,
        airline: req.query.airline,
      }).lean();
    } catch (error) {
      console.error('400 Invalid query', req.query);
      res.status(400).send('Invalid query');
      return;
    }
  }

  next();
}
