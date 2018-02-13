import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

const util = require('util');
const fs = require('fs');
const Papa = require('papaparse');

const readFileAsync = util.promisify(fs.readFile);

const filePath = '/Users/watcharaphat/Documents/CPEY4/ProjectRelate/code/enhancing-fleet-assignment/data/PlannerBkkAirways.csv';

async function getData() {
  try {
    const dataText = await readFileAsync(filePath, { encoding: 'utf8' });

    return dataText;
  } catch(error) {
    console.error(error);
  }
}

function convertToMin(timeString) {
  if (timeString.length === 3) {
    timeString = '0'.concat(timeString);
  }
  const hour = timeString[0].concat(timeString[1]);
  const minute = timeString[2].concat(timeString[3]);

  const hourMin = parseInt(hour) * 60;
  const minMin = parseInt(minute);

  const totalMin = hourMin + minMin;
  return totalMin;
}

function convertToTimeString(minTime) {
  let hour = Math.floor(minTime/60);
  if (hour < 10) {
    hour = '0'.concat(hour.toString());
  }

  let minute = minTime%60;

  if (minute < 10) {
    minute = '0'.concat(minute.toString());
  }

  const time = `${hour.toString()}:${minute.toString()}`;
  return time;
}

function convertTime(timeString) {
  return convertToTimeString(convertToMin(timeString));
}

function convertTimePlusTurnTime(timeString, turnTime) {
  return convertToTimeString(convertToMin(timeString) + turnTime);
}

function countOverlaps(flightTable, aircraft) {
  let maxOverlaps = 0;

  for (let i = 0; i < flightTable.length; i++) {
    let overlapsCount = 0;
    for (let j = 0; j < flightTable.length; j++) {
      if (i === j) continue;

      if (flightTable[i].equipmentName === aircraft && flightTable[j].equipmentName === aircraft) {
        const range1 = flightTable[i].momentRange;
        const range2 = flightTable[j].momentRange;

        if (range1.overlaps(range2)) {
          overlapsCount += 1;
          maxOverlaps = Math.max(maxOverlaps, overlapsCount);
        }
      }
    }
  }

  return maxOverlaps;
}

async function dynamicAssign(aircraftList, flightTable) {
  console.log('Fleet Assigning.');

  // sort by arrTime
  flightTable.sort(compareFlight);

  let aList = [];
  let bList = [];
  let cList = [];

  flightTable.forEach((row) => {
    switch(row.equipmentName) {
      case '(PG) 319':
        aList.push(row);
        break;
      case '(PG) 320':
        bList.push(row);
        break;
      case '(PG) AT7':
        cList.push(row);
        break;
    }
  });

  // await optimum(aList);

  // aList.forEach((row) => {
  //   if (row.aircraftNo) {
  //     console.log(row.flight);
  //   }
  // });

  const a = countOverlaps(flightTable, aircraftList[0]);
  const b = countOverlaps(flightTable, aircraftList[1]);
  const c = countOverlaps(flightTable, aircraftList[2]);

  console.log(`a: ${a}`);
  console.log(`b: ${b}`);
  console.log(`c: ${c}`);
}

let currentAircraft = 1;
let latestRow = null;

async function optimum(schedule) {
  while (!isDone(schedule)) {
    for (let i = 0; i < schedule.length; i++) {
      const row = schedule[i];
  
      if (!isConflict(row, latestRow)) {
        row.aircraftNo = currentAircraft;
        latestRow = row;
        continue;
      }
    }
  
    latestRow = null;
    currentAircraft += 1;
  }
}

function isConflict(row1, row2) {
  if (!row2) {
    console.log('not conflict');
    return false;
  }

  console.log(`isConflict: ${row1.momentRange.overlaps(row2.momentRange)}`);

  return row1.momentRange.overlaps(row2.momentRange);
}

function isDone(schedule) {
  for (let i = 0; i < schedule.length; i++) {
    const row = schedule[i];

    if (!row.aircraftNo) {
      console.log('not done')
      return false;
    }
  }

  console.log('done');

  // all row in schedule assigned
  return true;
}

function compareFlight(row1, row2) {
  if (row1.momentRange.end < row2.momentRange.end) {
    return -1;
  } else {
    return 1;
  }
}

async function main() {
  const turnTime = 30;

  const aircraftList = ['(PG) 319', '(PG) 320', '(PG) AT7'];

  // ****************************** 

  const dataText = await getData();
  const data = Papa.parse(dataText, {
    header: true,
    dynamicTyping: false,
  }).data;

  data.forEach((row) => {
    for (let key in row) {
      row[key] = row[key].replace(/\s\s+/g, ' ');
    }

    let tmp = row.arrTime;

    row.depTime = convertTime(row.depTime);
    row.arrTime = convertTime(row.arrTime);

    tmp = convertTimePlusTurnTime(tmp, turnTime);

    const date = moment().format('YYYY-MM-DD');
    const depMoment = moment(`${date} ${row.depTime}`);
    const arrMoment = moment(`${date} ${tmp}`);

    const range = moment.range(depMoment, arrMoment);
    row['momentRange'] = range;

    row.revenue = Number(row.revenue);
  });

  await dynamicAssign(aircraftList, data);
}

main();
