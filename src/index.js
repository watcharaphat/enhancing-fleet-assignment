import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { convertTime, convertTimePlusTurnTime } from './modules/utils/ConvertTime';
import fs from 'fs';
import Papa from 'papaparse';
import util from 'util';
// import timeSpaceNetwork from './algorithm/TimeSpaceNetwork';

const moment = extendMoment(Moment);

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

function countOverlaps(flightTable, aircraft) {
  let maxOverlaps = 0;

  for (let i = 0; i < flightTable.length; i++) {
    let overlapsCount = 0;
    for (let j = 0; j < flightTable.length; j++) {
      if (i === j) continue;

      if (flightTable[i].equipmentName === aircraft && flightTable[j].equipmentName === aircraft) {
        const range1 = flightTable[i].momentRange;
        const range2 = flightTable[j].momentRange;

        let s = 'is ';
        if (!isOperatable(flightTable[i], flightTable[j])) {
          s = s.concat('not ');
        }

        // console.log(`${flightTable[i].flight} -> ${flightTable[j].flight} ${s} operatable`);

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
  console.log('* * * * * * * * * * Dynamic Assign * * * * * * * * * *\n');

  // sort by depTime: start
  // sort by arrTime: end
  flightTable.sort((row1, row2) => {
    if (row1.momentRange.start < row2.momentRange.start) {
      return -1;
    } else {
      return 1;
    }
  });

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

  // const a = countOverlaps(flightTable, aircraftList[0]);
  // const b = countOverlaps(flightTable, aircraftList[1]);
  // const c = countOverlaps(flightTable, aircraftList[2]);

  // console.log(`a: ${a}`);
  // console.log(`b: ${b}`);
  // console.log(`c: ${c}`);

  await optimum(aList);
  await optimum(bList);
  await optimum(cList);

  console.log('\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\n');

  flightTable.forEach((row) => {
    printRow(row);
  });

  for (let i = 1; i <= 6; i++) {
    checkAssignedSchedule(aList, i);
  }

  // aList.forEach((row) => {
  //   printRow(row, 1);
  // });
}

function assignAircraftNo(row, aircraftNo) {
  row.aircraftNo = aircraftNo;
}

async function optimum(schedule) {
  let currentAircraft = 1;
  let latestRow = null;

  while (countNotAssigned(schedule) > 0) {
    for (let i = 0; i < schedule.length; i++) {
      const row = schedule[i];

      if (!row.aircraftNo && isOperatable(latestRow, row)) {
        assignAircraftNo(row, currentAircraft);
        latestRow = row;
      }
    }

    currentAircraft += 1;
    latestRow = null;
  }

  console.log(`Optimum number for ${schedule[0].equipmentName} is ${currentAircraft - 1}`);

  // while (!isDone(schedule)) {
  //   for (let i = 0; i < schedule.length; i++) {
  //     const row = schedule[i];
  
  //     if (!isConflict(row, latestRow)) {
  //       row.aircraftNo = currentAircraft;
  //       latestRow = row;
  //       continue;
  //     }
  //   }
  
  //   latestRow = null;
  //   currentAircraft += 1;
  // }
}

function isConflict(row1, row2) {
  if (!row1) {
    // console.log('not conflict');
    return false;
  }

  // console.log(`isConflict: ${row1.momentRange.overlaps(row2.momentRange)}`);

  return row1.momentRange.overlaps(row2.momentRange);
}

function countNotAssigned(schedule) {
  let count = 0;

  schedule.forEach((row) => { 
    if (!row.aircraftNo) count += 1;
  });

  return count;
}

function isOperatable(row1, row2) {
  if (!row1) return true;

  return (row1.destinationCode === row2.originCode) && !isConflict(row1, row2);
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

function checkAssignedSchedule(schedule, aircraftNo) {
  let conflictCount = 0;

  for (let i = 0; i < schedule.length; i++) {
    const row1 = schedule[i];

    for (let j = 0; j < schedule.length; j++) {
      const row2 = schedule[j];
      if (i === j) continue;
      if (row1.aircraftNo !== row2.aircraftNo) continue;

      if (isConflict(row1, row2)) {
        conflictCount += 1;
        console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ');
        console.log('CONFLICT!!!');
        console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ');
      }
    }
  }

  if (conflictCount === 0) {
    console.log(`There is no conflict for aircraftNo: ${aircraftNo}`);
  }
}

function printRow(row, filterAircraftNo) {
  if (filterAircraftNo) {
    if (row.aircraftNo !== filterAircraftNo) return;
  }
  console.log(`${row.flight}, ${row.equipmentName}, ${row.originCode} -> ${row.destinationCode}, depTime: ${row.depTime}, arrTime: ${row.arrTime}, aircraftNo. ${row.aircraftNo}`);
}

async function timeSpaceAssign(aircraftList, flightTable) {
  console.log('* * * * * * * * * * Time Space Network Assign * * * * * * * * * *\n');

  flightTable.sort((row1, row2) => {
    if (row1.momentRange.start < row2.momentRange.start) {
      return -1;
    } else {
      return 1;
    }
  });

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

  await constructTimeSpaceGraph(flightTable, flightTable[0].momentRange.start);
}

async function timeSpaceNetwork(schedule) {
  ;
}

async function constructTimeSpaceGraph(schedule, time) {
  console.log('Constructing Time Space Graph');

  let scheduleAt
  for (let i = 0; i < schedule.length; i++) {

  }
}

async function main() {
  const turnTime = 30;

  const aircraftList = ['(PG) 319', '(PG) 320', '(PG) AT7'];

  // ****************************** 

  const dataText = await getData();
  const data = Papa.parse(dataText, {
    header: true,
    dynamTyping: false,
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
  // await timeSpaceAssign(aircraftList, data);
}

main();
