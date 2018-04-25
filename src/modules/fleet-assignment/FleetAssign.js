import timeSpaceAssign from './TimeSpaceAssign';
import dynamicAssign from './DynamicAssign';
import greedyAssign from './GreedyAssign';
import maxFlowMinCostAssign from './MaxFlowMinCost';

export default function fleetAssign(req, res, next) {
  switch (req.query.algorithm) {
    case 'ts':
      timeSpaceAssign(req.schedule);
      break;
    case 'dynamic':
      dynamicAssign(req.schedule);
      break;
    case 'greedy':
      greedyAssign(req.schedule);
      break;
    case 'maxflow':
      maxFlowMinCostAssign(req.schedule);
      break;
    default:
      console.log(`Invalid Algorithm Request: ${req.query.algorithm}`);
      break;
  }

  res.json(req.schedule);
  return req.schedule;
}
