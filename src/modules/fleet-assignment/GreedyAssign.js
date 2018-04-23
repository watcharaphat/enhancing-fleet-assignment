import getJobList from '../utils/GetJobList';
import * as helper from '../utils/FleetAssignHelper';

export default function(schedule) {
  const jobs = getJobList(schedule);

  for (let i = 0; i < jobs.length; i++) {
    greedyPick(jobs[i].schedule);
  }
}

function greedyPick(schedule) {
  let currentAircraft = 1;
  let latestRow = null;

  while (helper.countNotAssigned(schedule) > 0) {
    for (let i = 0; i < schedule.length; i++) {
      const row = schedule[i];

      if (!row.aircraftNo && helper.isOperatable(latestRow, row)) {
        row.aircraftNo = currentAircraft;
        latestRow = row;
      }
    }

    currentAircraft += 1;
    latestRow = null;
  }

  const numberOfAitcrafts = currentAircraft - 1;
  // console.log(`Optimum number for ${schedule[0].equipmentName} is ${numberOfAitcrafts}`);

  return numberOfAitcrafts;
}
