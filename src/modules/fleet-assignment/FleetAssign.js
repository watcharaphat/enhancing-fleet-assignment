import timeSpaceAssign from './TimeSpaceAssign';
import dynamicAssign from './DynamicAssign';

export default function fleetAssign(req, res, next) {
  switch (req.query.algorithm) {
    case 'ts':
      timeSpaceAssign(req.schedule);
      break;
    case 'dynamic':
      dynamicAssign(req.schedule);
      break;
    case 'greedy':
      console.log('Greedy Assign');
      break;
    default:
      console.log(`Invalid Algorithm Request: ${req.query.algorithm}`);
      break;
  }

  res.json(req.schedule);
  return req.schedule;
}
