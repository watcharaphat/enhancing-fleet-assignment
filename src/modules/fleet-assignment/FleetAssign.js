import timeSpaceAssign from './TimeSpaceAssign';
import dynamicAssign from './DynamicAssign';
import greedyAssign from './GreedyAssign';
import maxFlowMinCostAssign from './MaxFlowMinCost';
import GetJobList from '../utils/GetJobList';
import * as helper from '../utils/FleetAssignHelper';
import util from 'util';

export default function fleetAssign(req, res, next) {
  if (req.query.season === 'summer') {
    console.log('summer is here');
  }

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

  const summary = [];
  const jobs = GetJobList(req.schedule);

  jobs.forEach((job) => {
    summary.push({
      'equipmentName': job.equipmentName,
      'number': helper.getNumberOfAircraft(job.schedule)
    });
  });

  const response = {
    summary,
    'schedule': req.schedule,
  };

  console.log(util.inspect(response.summary));

  res.json(response);
  return response;
}
