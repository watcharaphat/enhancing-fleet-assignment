export function checkAssignedSchedule(schedule, aircraftNo) {
  let conflictCount = 0;

  for (let i = 0; i < schedule.length; i++) {
    const row1 = schedule[i];

    for (let j = 0; j < schedule.length; j++) {
      if (i === j) continue;

      const row2 = schedule[j];
      if (i === j) continue;
      if (row1.aircraftNo !== row2.aircraftNo) continue;

      if (isConflict(row1, row2)) {
        conflictCount += 1;
        console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ');
        console.log(`CONFLICT in index ${i} and ${j} aircraftNo: ${aircraftNo} !!!`);
        // console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ');
      }
    }
  }

  if (conflictCount === 0) {
    console.log(`There is no conflict for aircraftNo: ${aircraftNo}`);
  }
}

// export function checkAssignedSchedule(schedule, message) {
//   if (message) {
//     console.log(`\n${message}\n`);
//   }

//   const aircraftList = [];
//   const lastFlightOfAircraft = [];

//   schedule.forEach((row, index) => {
//     if (aircraftList.indexOf(row.aircraftNo) === -1) {
//       aircraftList.push(row.aircraftNo);
//       lastFlightOfAircraft.push(index);
//     }
//   });

//   console.log(aircraftList);
//   console.log(lastFlightOfAircraft);

//   for (let i = 0; i < aircraftList.length; i++) {
//     const aircraftNo = aircraftList[i];
//   }
// }

export function isConflict(row1, row2) {
  if (!row1) {
    return false;
  }

  return row1.momentRange.overlaps(row2.momentRange);
}

export function countNotAssigned(schedule) {
  let count = 0;

  schedule.forEach((row) => { 
    if (!row.aircraftNo) count += 1;
  });

  return count;
}
