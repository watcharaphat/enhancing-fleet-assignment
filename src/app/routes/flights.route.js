import * as flight from '../controllers/flights.controller';
import parseSchedule from '../../modules/utils/parseSchedule';
import fleetAssign from '../../modules/fleet-assignment/FleetAssign';

export default function(app) {
  app.route('/flights')
    .get(flight.list, parseSchedule, fleetAssign);
}
