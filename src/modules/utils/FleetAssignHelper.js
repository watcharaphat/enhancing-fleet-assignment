import moment from 'moment';
import chiSquared from 'chi-squared';
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

export function getNumberOfAircraft(schedule) {
  let maxNumber = -Infinity;

  schedule.forEach((row) => {
    maxNumber = row.aircraftNo > maxNumber ? row.aircraftNo : maxNumber;
  });

  return maxNumber;
}

export function countEachAircraft(job) {
  let counter = [];
  job.schedule.forEach((row) => {
    console.log(row);
    if (counter[row.aircraftNo]) counter[row.aircraftNo] += 1;
    else {
      counter[row.aircraftNo] = 1;
      console.log(`init new counter: ${row.aircraftNo}`);
      console.log(counter);
    }
  });

  console.log(`${job.equipmentName}: ${counter}`);
}

export function getBestPath(paths) {
  let counter = [];

  for (let i = 0; i < paths.length; i++) {
    counter[i] = [];
    for (let j = 0; j < paths[i].length; j++) {
      const ac = paths[i][j] - 1;
      if (counter[i][ac]) counter[i][ac] += 1;
      else counter[i][ac] = 1;
    }
  }

  let max = -Infinity;
  let min = Infinity;
  let bestPath;
  let uniformCounter = 0;
  counter.forEach((array, index) => {
    // const squaredError = calUniformSquaredError(array);
    const testResult = chiSquaredTest(array);

    if (min > testResult.squaredError) {
      min = testResult.squaredError;
      bestPath = paths[index];
    }

    if (testResult.isUniform) uniformCounter++;
  });

  return {
    path: bestPath,
    squaredError: min,
    numberOfUniformChoices: uniformCounter,
  };
}

function chiSquaredTest(array) {
  let sum = 0;
  array.forEach(data => sum += data);

  const mean = sum / array.length;

  let x2 = 0;
  array.forEach(data => x2 += ((data - mean)**2) / mean);

  const p = pValue(x2, array.length - 1);

  // console.log(`x2: ${x2}, p: ${p}`);

  let isPassUniformTest = false;
  if (p > 0.05)  isPassUniformTest = true;

  return {
    squaredError: x2,
    isUniform: isPassUniformTest,
  };
}

function pValue(x2, df) {
  return 1 - chiSquared.cdf(x2, df);
}
