import timeSpaceAssign from './TimeSpaceAssign';

export default function fleetAssign(req, res, next) {
  switch (req.query.algorithm) {
    case 'ts':
      timeSpaceAssign(req.schedule);
      break;
    case 'dynamic':
      console.log('Dynamic Assign');
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
