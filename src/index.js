import Moment from 'moment';
import fs from 'fs';
import Papa from 'papaparse';
import util from 'util';
import { extendMoment } from 'moment-range';
import { convertTime, convertTimePlusTurnTime } from './modules/utils/ConvertTime';
import { printRow } from './modules/utils/PrintRow';
import { checkAssignedSchedule, isConflict, countNotAssigned } from './modules/utils/CheckAssignedSchedule';
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

  const A = await optimum(aList);
  await optimum(bList);
  await optimum(cList);

  console.log('\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\n');

  flightTable.forEach((row) => {
    printRow(row);
  });

  let decisionTree = getDecisionTree(aList, A + 1);
  console.log('decisionTree: ', decisionTree);

  aList.forEach((row, index) => {
    row.aircraftNo = decisionTree[0][index];
    printRow(row);
  });

  for (let i = 1; i <= 14; i++) {
    // checkAssignedSchedule(aList,y i);
  }


  /* testing timeSpaceGraph */
  // let ts = constructTimeSpaceGraphOnTime(aList, aList[0].depTime);

  // for (let i = 1; i <= 6; i++) {
  //   checkAssignedSchedule(aList, i);
  // }

  // aList.forEach((row) => {
  //   printRow(row, 1);
  // });
}

function getDecisionTree(schedule, numberOfAitcrafts) {
  console.log('\n* * * * * Constructing Decision Tree * * * * *\n');
  // clear aircraftNo, just for testing
  schedule.forEach((row) => {
    row.aircraftNo = undefined;
  });

  const decisionTree = [];
  // const currentPath = [];
  // let currentAircraft = 1;

  // console.log(getOperatableList(schedule, 0));

  const pathAssign = (currentAircraft = 1, currentRow = 0 , currentPath = [], isNewAircraft = true) => {
    if (isNewAircraft) {
      for (let i = 0; i < schedule.length; i++) {
        if (!currentPath[i]) {
          currentPath[i] = currentAircraft;
          currentRow = i;
          break;
        }
      }
    }
    
    if (isPathComplete(schedule, currentPath)) {
      console.log('* * * * * FINISH A PATH ! ! ! * * * * *');
      decisionTree.push(currentPath);
      return;
    }

    for (let i = currentRow; i < schedule.length; i++) {
      const row = schedule[i];

      if (currentPath[i]) {
        // skip assigned flight.
        continue;
      }

      const choices = getOperatableList(schedule, i);

      if (choices[0]) {
        let choice;

        for (let j = 0; j < choices.length; j++) {
          if (!currentPath[choices[j]]) {
            choice = choices[j];
            break;
          }
        }

        if (!choice) {
          pathAssign(currentAircraft + 1, 0, currentPath, true);
          return;
        }

        currentPath[choice] = currentAircraft;

        // assign to DT for testing.
        decisionTree[0] = currentPath;

        pathAssign(currentAircraft, choice, currentPath, false);
        return;
      }
    }

    pathAssign(currentAircraft + 1, 0, currentPath, true);
  };

  pathAssign();

  console.log('= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = ');

  return decisionTree;
}

function getOperatableList(schedule, latestRow) {
  const operatableList = [];

  // console.log(`* * * * * Operatable * * * * *`);
  // printRow(schedule[latestRow]);
  // console.log(`choices are:`);

  for (let i = latestRow + 1; i < schedule.length; i++) {
    if (isOperatable(schedule[latestRow], schedule[i])) {
      operatableList.push(i);
    }
  }

  // operatableList.forEach(index => {
  //   printRow(schedule[index]);
  // });

  // console.log('\n');

  return operatableList;
}


function isPathComplete(schedule, path) {
  for (let i = 0; i < schedule.length; i++) {
    if (!path[i]) {
      // console.log(`not Complete: ${i}`);
      return false;
    }
  }

  return true;
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

  const numberOfAitcrafts = currentAircraft - 1;
  console.log(`Optimum number for ${schedule[0].equipmentName} is ${numberOfAitcrafts}`);

  return numberOfAitcrafts;
}

function isOperatable(row1, row2) {
  if (!row1) return true;

  return (row1.destinationCode === row2.originCode) && !isConflict(row1, row2);
}

// function isDone(schedule) {
//   for (let i = 0; i < schedule.length; i++) {
//     const row = schedule[i];

//     if (!row.aircraftNo) {
//       console.log('not done')
//       return false;
//     }
//   }

//   console.log('done');

//   // all row in schedule assigned
//   return true;
// }

function compareFlight(row1, row2) {
  if (row1.momentRange.end < row2.momentRange.end) {
    return -1;
  } else {
    return 1;
  }
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

  // await constructTimeSpaceGraphOnTime(flightTable, flightTable[0].momentRange.start);
  await constructTimeSpaceGraphOnTime(flightTable);
}

// async function constructTimeSpaceGraphOnTime(schedule, time) {
//   console.log(`Constructing Time Space Graph at ${time}`);

//   const aircraftList = ['(PG) 319', '(PG) 320', '(PG) AT7'];
//   let tsGraph = {
//     '(PG) 319': {},
//     '(PG) 320': {},
//     '(PG) AT7': {},
//   };

//   for (let i = 0; i < schedule.length; i++) {
//     const row = schedule[i];
//     const equipmentName = row.equipmentName;
//     const aircraftNo = row.aircraftNo;

//     // console.log(aircraftNo);

//     if (!tsGraph[equipmentName][aircraftNo.toString()]) {
//       initAircraftGraph(tsGraph, equipmentName, aircraftNo)
//       // console.log(`init ${equipmentName}: ${aircraftNo}`);
//     }

//     const timeMoment = moment(`${moment().format('YYYY-MM-DD')} ${time}`);
//     let isOnGround = true;
    
//     if (row.momentRange.contains(timeMoment)) {
//       console.log(`${i}: contains`);
//       isOnGround = false;
//     } else {
//       console.log(`${i}: not`);
//       isOnGround = true;
//     }
//   }

//   console.log(tsGraph);
// }

async function constructTimeSpaceGraphOnTime(schedule) {
  console.log(`\n\n***** Constructing Time Space Graph for all time *****\n\n`);

  const aircraftList = ['(PG) 319', '(PG) 320', '(PG) AT7'];
  let tsGraph = {
    '(PG) 319': {},
    // '(PG) 320': {},
    // '(PG) AT7': {},
  };

  // const timesSet = new Set();
  const times = [];

  schedule.forEach((row) => {
    const depMoment = row.momentRange.start;
    const arrMoment = row.momentRange.end;

    // timesSet.add(depMoment);
    // timesSet.add(arrMoment);
    
    let isDepSame = false;
    for (let i = 0; i < times.length; i++) {
      if (times[i].isSame(depMoment)) {
        isDepSame = true;
        break;
      }
    }
    if (!isDepSame) times.push(depMoment);

    let isArrSame = false;
    for (let i = 0; i < times.length; i++) {
      if (times[i].isSame(arrMoment)) {
        isDepSame = true;
        break;
      }
    }
    if (!isArrSame) times.push(arrMoment);
  });

  times.sort((time1, time2) => {
    if (time1.isBefore(time2)) {
      return -1;
    } else {
      return 1;
    }
  });

  // const times = [...timesSet];

  // max number of links
  let max = -1;

  for (let i = 0; i < times.length; i++) {
    const timeMoment = times[i];
    // console.log(timeMoment);
    tsGraph['(PG) 319'][timeMoment] = {};
    const g = tsGraph['(PG) 319'][timeMoment]; // a shortcut
    
    // init links array
    g.links = [];

    for (let j = 0; j < schedule.length; j++) {
      const row = schedule[j];

      // exclusive: false means momentRange.end is the same as timeMoment
      if (row.momentRange.contains(timeMoment, { exclusive: false })) {
        const a = row.momentRange.start.format('HH:mm:ss');
        const b = row.momentRange.end.format('HH:mm:ss');
        const z = timeMoment.format('HH:mm:ss');

        const link = `${row.originCode} -> ${row.destinationCode}`;

        if (row.momentRange.end.isSame(timeMoment)) {
          g.links.push({
            'status': 'arrived',
            'flight': row.flight,
            link,
            'aircraftNo': row.aircraftNo,
          });
        } else {
          g.links.push({
            'status': 'flight arc',
            'flight': row.flight,
            link,
            'aircraftNo': row.aircraftNo,
          });
          // g.links.push(`${row.originCode} -> ${row.destinationCode}`);
        }


      }

      // if (timeMoment.isBefore(row.momentRange.start)) {
      //   console.log(`${timeMoment.format('HH:mm:ss')} isBefore ${row.momentRange.start.format('HH:mm:ss')}`);
      //   break;
      // }
    }

    for (let time in tsGraph['(PG) 319']) {
      const numberOfLinks = tsGraph['(PG) 319'][time].links.length;
      // if (numberOfLinks === 5) console.log(`*****\n${tsGraph['(PG) 319'][time].links}\n*****\n`);

      max = numberOfLinks > max ? numberOfLinks : max;
    }
  }


  // for (let i = 0; i < schedule.length; i++) {
  //   const row = schedule[i];
  //   const equipmentName = row.equipmentName;
  //   const aircraftNo = row.aircraftNo;

  //   // console.log(aircraftNo);

  //   if (!tsGraph[equipmentName][aircraftNo.toString()]) {
  //     initAircraftGraph(tsGraph, equipmentName, aircraftNo)
  //     // console.log(`init ${equipmentName}: ${aircraftNo}`);
  //   }

  //   // const timeMoment = moment(`${moment().format('YYYY-MM-DD')} ${time}`);
  //   // let isOnGround = true;
    
  //   // if (row.momentRange.contains(timeMoment)) {
  //   //   console.log(`${i}: contains`);
  //   //   isOnGround = false;
  //   // } else {
  //   //   console.log(`${i}: not`);
  //   //   isOnGround = true;
  //   // }
  // }

  console.log(util.inspect(tsGraph, false, null, true));
  console.log(`Max number of links: ${max}`);
}

// function initAircraftGraph(tsGraph, equipmentName, aircraftNo) {
//   // console.log(equipmentName);
//   tsGraph[equipmentName][aircraftNo] = {
//     status: '',
//   };
// }

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
