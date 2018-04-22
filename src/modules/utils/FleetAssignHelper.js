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

export function assignPathToSchedule(schedule, path) {
  schedule.forEach((row, index) => {
    row.aircraftNo = path[index];
  });
}

function isOperatable(row1, row2) {
  if (!row1) return true;

  return (row1.destinationCode === row2.originCode) && !isConflict(row1, row2);
}
