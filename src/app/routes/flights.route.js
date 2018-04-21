import * as flight from '../controllers/flights.controller';
import parseSchedule from '../../modules/utils/parseSchedule';

export default function(app) {
  app.route('/flights')
    .get(flight.list, parseSchedule);
}
