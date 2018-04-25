import moment from 'moment';
import { isConflict } from './CheckAssignedSchedule';

export function getOperatableList(schedule, latestRow) {
  const operatableList = [];

  for (let i = latestRow + 1; i < schedule.length; i++) {
    if (isOperatable(schedule[latestRow], schedule[i])) {
      operatableList.push(i);
    }
  }

  return operatableList;
}

export function constructBpGraph(schedule) {
  const bpGraph = [];
  const date = moment().format('YYYY-MM-DD');

  for (let i = 0; i < schedule.length; i++) {
    const links = [];
    for (let j = i + 1; j < schedule.length; j++) {
      if (isOperatable(schedule[i], schedule[j])) {
        const a = moment(`${date} ${schedule[i].arrTime}`);
        const b = moment(`${date} ${schedule[j].depTime}`);

        const cost = b.diff(a) / (60 * 1000);

        // console.log(`${schedule[i].arrTime} -> ${schedule[j].depTime}, cost: ${cost}`);

        links[j] = cost;
      } else {
        links[j] = 0;
      }
    }
    bpGraph[i] = links;
  }
  return bpGraph;
}

export function getBpLinks(schedule) {
  const bpLinks = [];
  const date = moment().format('YYYY-MM-DD');

  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      if (isOperatable(schedule[i], schedule[j])) {
        bpLinks.push([i, j]);
      }
    }
  }

  return bpLinks;
}

export function assignPathToSchedule(schedule, path) {
  schedule.forEach((row, index) => {
    row.aircraftNo = path[index];
  });
}

export function countNotAssigned(schedule) {
  let count = 0;

  schedule.forEach((row) => { 
    if (!row.aircraftNo) count += 1;
  });

  return count;
}

export function isOperatable(row1, row2) {
  if (!row1) return true;

  return (row1.destinationCode === row2.originCode) && !isConflict(row1, row2);
}
