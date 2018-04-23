import cors from 'cors';
import * as flight from '../controllers/flights.controller';
import parseSchedule from '../../modules/utils/ParseSchedule';
import fleetAssign from '../../modules/fleet-assignment/FleetAssign';

export default function(app) {
  app.route('/flights', cors())
    .get(flight.list, parseSchedule, fleetAssign);
}
