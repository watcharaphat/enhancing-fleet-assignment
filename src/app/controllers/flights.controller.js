import mongoose from 'mongoose';
import moment from 'moment';
import Flight from '../models/flight.model';
import Summer from '../models/summer.model';
import Winter from '../models/winter.model';

export async function list(req, res, next) {
  console.log(req.originalUrl);
  const date = moment(req.query.date, 'DD-MMM-YYYY').toDate();

  switch (req.query.season) {
    case 'summer':
      try {
        req.schedule = await Summer.find({}).lean();
      } catch (error) {
        console.error('400 Invalid query', req.query);
        res.status(400).send('Invalid query');
        return;
      }
      break;
    case 'winter':
      try {
        req.schedule = await Winter.find({}).lean();
      } catch (error) {
        console.error('400 Invalid query', req.query);
        res.status(400).send('Invalid query');
        return;
      }
      break; 
    default:
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
